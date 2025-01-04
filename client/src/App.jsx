import "./App.css";
import { Routes, Route } from "react-router-dom";
import Register from "./Auth/Register/Register";
import AuthLayout from "./Auth/AuthLayout";
import LoginWithPassword from "./Auth/Login/LoginWithPassword";
import Profile from "./Auth/Profile/Profile";
import ForgetPassword from "./Auth/ForgetPassword/ForgetPassword";

function App() {
  return (
    <div>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<LoginWithPassword />} />
          <Route path="/" element={<LoginWithPassword />} />
          <Route path="reset-password" element={<ForgetPassword />} />
        </Route>

        <Route path="profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
