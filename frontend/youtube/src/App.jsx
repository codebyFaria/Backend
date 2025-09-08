import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./page/Home/Home";
import LoginPage from "./page/Login/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/login",
    element: <LoginPage />
  }
]);


function App() {
  return (
    <>
      <RouterProvider router={router} />
     
    </>
  );
}



export default App;