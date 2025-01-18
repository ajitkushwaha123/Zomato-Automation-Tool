import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { store } from "./store";
import { Provider } from "react-redux";

import { NextUIProvider } from "@nextui-org/react";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <NextUIProvider>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </NextUIProvider>
);
