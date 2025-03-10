import React, { useEffect, useState, useRef } from "react";
import { getUser, refreshToken } from "../../helper/helper";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";

const Profile = () => {
  const [user, setUser] = useState(null);
  const firstRender = useRef(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (firstRender.current) {
      const userPromise = getUser();

      toast.promise(userPromise, {
        loading: "Fetching User Data ...",
        success: (data) => {
          console.log("data", data);
          setUser(data.user);
          return <b>Got User Data Successfully... !</b>;
        },
        error: (err) => <b>{err.message || "Could not get User Data... !"}</b>,
      });

      firstRender.current = false;
    }

    const interval = setInterval(() => {
      const userPromise = refreshToken();

      toast.promise(userPromise, {
        loading: "Fetching User Data ...",
        success: (data) => {
          console.log("data", data);
          setUser(data.user);
          return <b>Got User Data Successfully... !</b>;
        },
        error: (err) => <b>{err.message || "Could not get User Data... !"}</b>,
      });
    }, 1000 * 60 * 60 * 24); // 24 hours

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <h1>Hi</h1>
      {user && (
        <div>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>

          <button onClick={() => navigate("/projects")}> PROJECT </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
