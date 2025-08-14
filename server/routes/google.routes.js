import express from "express";
import dotenv from "dotenv";
import axios from "axios";
const googles = express.Router();
import { google } from "googleapis";

dotenv.config();

const client_id = process.env.GOOGLE_BUSINESS_CLIENT_ID;
const client_secret = process.env.GOOGLE_BUSINESS_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

console.log(client_id);
googles.get("/", (req, res) => {
  const scope = encodeURIComponent(
    "https://www.googleapis.com/auth/business.manage"
  );
  const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&access_type=offline&prompt=consent`;
  res.redirect(redirectUrl);
});

googles.get("/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id,
      client_secret,
      redirect_uri,
      grant_type: "authorization_code",
    });

    const { access_token, refresh_token, expires_in } = tokenRes.data;

    res.send({ access_token, refresh_token, expires_in });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send("OAuth error");
  }
});

googles.get("/locations", async (req, res) => {
  const access_token = req.headers.authorization?.split(" ")[1];
  if (!access_token) return res.status(401).send("No token");

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token });

  try {
    // STEP 1: Get account name
    const accountManagement = google.mybusinessaccountmanagement({
      version: "v1",
      auth,
    });
    const accountsRes = await accountManagement.accounts.list();
    const account = accountsRes.data.accounts?.[0];
    if (!account) return res.status(404).send("No account found");

    // STEP 2: Get locations for account
    const businessInfo = google.mybusinessbusinessinformation({
      version: "v1",
      auth,
    });
    const locationsRes = await businessInfo.accounts.locations.list({
      parent: account.name,
    });

    res.send({ locations: locationsRes.data.locations || [] });
  } catch (err) {
    console.error("Error fetching GBP locations:", err);
    res.status(500).send("Something went wrong");
  }
});
  

export default googles;
