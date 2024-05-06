import React from "react"
import ReactDom, { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"


import WebsiteScraper from "./pages/user/Home";

import SignupPage from "./pages/user/Signup";
import LoginPage from "./pages/user/Login";
import AddBookForm from "./pages/user/AddBook";
import PdfUploaderAndViewer from "./pages/user/Test";






const AppLayout = () => {

    return (

        <>
            <Outlet/>
         
        </>
    )
}




const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        errorElement: <Error />,
        children: [
            {
                path: "/",
                element: <WebsiteScraper />
            },
            {
                path: "/test",
                element: <PdfUploaderAndViewer />
            },
            {
                path: "/signup",
                element: <SignupPage />
            },
            {
                path: "/login",
                element: <LoginPage />
            },
            {
                path: "/addBook",
                element: <AddBookForm />
            },
           
           
          


        ]
    },
  
  
   

])


const root = ReactDom.createRoot(document.getElementById('root'))

root.render(<RouterProvider router={appRouter} />) 