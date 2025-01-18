import "./App.css";
import { Routes, Route } from "react-router-dom";
import Register from "./Auth/Register/Register";
import AuthLayout from "./Auth/AuthLayout";
import LoginWithPassword from "./Auth/Login/LoginWithPassword";
import Profile from "./Auth/Profile/Profile";
import ForgetPassword from "./Auth/ForgetPassword/ForgetPassword";
import axios from "axios";
import ZomatoExtensionPage from "./zomatoExtension/ZomatoExtensionPage";
import Menu from "./zomatoExtension/Menu";

function App() {
  const openZomato = async ({ name, description, price }) => {
    try {
      const response = await axios.post(
        "http://localhost:2801/api/zomato/data",
        {
          name,
          description,
          price,
        }
      );

      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const data = [
    { name: "Pizza", description: "Cheese Burst", price: 500 },
    { name: "Burger", description: "Veg Burger", price: 200 },
    { name: "Pasta", description: "Red Sauce Pasta", price: 300 },
    { name: "Noodles", description: "Hakka Noodles", price: 250 },
    { name: "Sandwich", description: "Grilled Chicken Sandwich", price: 150 },
    { name: "Wrap", description: "Paneer Tikka Wrap", price: 180 },
    { name: "Salad", description: "Greek Salad", price: 220 },
    { name: "Soup", description: "Tomato Basil Soup", price: 120 },
    { name: "Fries", description: "Crispy French Fries", price: 100 },
    {
      name: "Garlic Bread",
      description: "Cheesy Garlic Breadsticks",
      price: 130,
    },
    { name: "Ice Cream", description: "Chocolate Sundae", price: 90 },
    { name: "Milkshake", description: "Strawberry Milkshake", price: 150 },
    { name: "Smoothie", description: "Mango Smoothie", price: 180 },
    { name: "Coffee", description: "Espresso", price: 80 },
    { name: "Tea", description: "Masala Chai", price: 60 },
    { name: "Juice", description: "Fresh Orange Juice", price: 100 },
    { name: "Soda", description: "Cola", price: 50 },
    { name: "Lassi", description: "Sweet Lassi", price: 120 },
    { name: "Chutney", description: "Mint Chutney", price: 30 },
    { name: "Pickle", description: "Mango Pickle", price: 40 },
    { name: "Papad", description: "Crispy Papad", price: 50 },
    { name: "Raita", description: "Cucumber Raita", price: 60 },
    { name: "Paratha", description: "Aloo Paratha", price: 150 },
    { name: "Chapati", description: "Whole Wheat Chapati", price: 20 },
    { name: "Rice", description: "Jeera Rice", price: 100 },
    { name: "Dal", description: "Tadka Dal", price: 120 },
    { name: "Curry", description: "Paneer Butter Masala", price: 250 },
    { name: "Kebab", description: "Seekh Kebab", price: 200 },
    { name: "Biryani", description: "Hyderabadi Biryani", price: 300 },
    { name: "Pulao", description: "Vegetable Pulao", price: 180 },
    { name: "Samosa", description: "Spicy Potato Samosa", price: 50 },
    { name: "Pakora", description: "Onion Pakora", price: 60 },
  ];

  const handleFunction = async () => {
    try {
      for (let i = 0; i < data.length; i++) {
        await openZomato(data[i]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* <button onClick={() => handleFunction()}>Open Zomato</button> */}

      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<LoginWithPassword />} />
          <Route path="/" element={<LoginWithPassword />} />
          <Route path="reset-password" element={<ForgetPassword />} />
        </Route>

        <Route path="profile" element={<Profile />} />
        <Route path="/zomato" element={<ZomatoExtensionPage />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </div>
  );
}

export default App;
