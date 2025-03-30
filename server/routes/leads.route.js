import express from "express";
import { verifyToken } from "../controllers/user.controllers.js";
import Lead from "../models/Lead.js";

const leads = express.Router();

const defaultColumns = [
  { name: "Name", type: "text", required: true },
  { name: "Phone", type: "text", required: true },
  { name: "Service", type: "text", required: false },
  { name: "Price", type: "number", required: false },
  { name: "Status", type: "text", required: false },
];

const defaultRows = [
  {
    data: {
      Name: "Alice Johnson",
      Phone: "9876543210",
      Service: "Web Development",
      Price: 10000,
      Status: "New",
    },
  },
  {
    data: {
      Name: "Bob Smith",
      Phone: "8765432109",
      Service: "SEO Optimization",
      Price: 5000,
      Status: "Contacted",
    },
  },
  {
    data: {
      Name: "Charlie Davis",
      Phone: "7654321098",
      Service: "Social Media Marketing",
      Price: 7000,
      Status: "Proposal Sent",
    },
  },
];

export const createBoard = async ({ userId, projectId }) => {
  if (!userId) {
    return res.status(401).json({
      msg: "Unauthorized. Please log in!",
      success: false,
    });
  }

  if (!projectId) {
    return res.status(401).json({
      msg: "Project Id is Missing... !",
      success: false,
    });
  }

  const newLeadBoard = new Lead({
    userId,
    projectId,
    columns: defaultColumns,
    rows: defaultRows,
  });

  await newLeadBoard.save();

  console.log(newLeadBoard);
};

leads.post("/", verifyToken, async (req, res) => {
  const userId = req.id;

  if (!userId) {
    return res.status(401).json({
      msg: "Unauthorized. Please log in!",
      success: false,
    });
  }

  // const { projectId } = req.query;
  // if (!projectId) {
  //   return res.status(401).json({
  //     msg: "Project Id is Missing... !",
  //     success: false,
  //   });
  // }

  try {
    const newLeadBoard = {
      userId,
      projectId,
      colums: defaultColumns,
      rows: defaultRows,
    };

    await newLeadBoard.save();

    console.log(newLeadBoard);

    return res.status(201).json({
      msg: "Lead board created successfully with default leads!",
      success: true,
      data: newLeadBoard,
    });
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({
      msg: "Internal Server Error",
      success: false,
    });
  }
});

leads.get("/", verifyToken, async (req, res) => {
  console.log("called");
  const userId = req.id;

  if (!userId) {
    return res.status(401).json({
      msg: "Unauthorized. Please log in!",
      success: false,
    });
  }

  const { projectId } = req.query;
  if (!projectId) {
    return res.status(401).json({
      msg: "Project Id is Missing... !",
      success: false,
    });
  }

  try {
    const leads = await Lead.find({ userId, projectId });

    console.log("l", leads);

    return res.status(200).json({
      msg: "Leads Data...!",
      success: true,
      data: leads,
    });
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({
      msg: "Internal Server Error",
      success: false,
    });
  }
});

leads.put("/", verifyToken, async (req, res) => {
  const userId = req.id;

  if (!userId) {
    return res.status(401).json({
      msg: "Unauthorized. Please log in!",
      success: false,
    });
  }

  const { projectId } = req.query;
  if (!projectId) {
    return res.status(401).json({
      msg: "Project Id is Missing... !",
      success: false,
    });
  }

  try {
    const { updatedColumns } = req.body;
    const leadsBoard = await Lead.findOne({ userId, projectId });

    if (!leadsBoard) {
      return res.status(404).json({
        msg: "Lead board not found",
        success: false,
      });
    }

    leadsBoard.columns = updatedColumns;

    await leadsBoard.save();

    return res.status(200).json({
      msg: "Leads board updated successfully!",
      success: true,
      data: leadsBoard,
    });
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({
      msg: "Internal Server Error",
      success: false,
    });
  }
});

export default leads;
