import React from "react"
import ReactDom, { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"


import WebsiteScraper from "./pages/user/Home";

import SignupPage from "./pages/user/Signup";
import LoginPage from "./pages/user/Login";
import AddBookForm from "./pages/user/AddBook";
import PdfUploaderAndViewer from "./pages/user/Test";
import Nav from "./components/Nav";
import AdminNav from "./components/AdminNav";
import AdminPage from "./pages/admin/Home";
import PdfViewer from "./pages/user/getPdf";
import ProjectArchiveSystem from "./pages/user/Home";





const AppLayout = () => {

    return (

        <>
        <Nav/>
            <Outlet/>
         
        </>
    )
}


const AdminLayout = () => {

    return (

        <>
        <AdminNav/>
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
                element: <ProjectArchiveSystem />
            },
            {
                path: "/view",
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
            {
                path: "/report/:id",
                element: <PdfViewer />
            },
            // {
            //     path: "/viewPdf",
            //     element: <PdfViewer />
            // },
        ]
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        errorElement: <Error />,
        children: [
            {
                path: "/admin",
                element: <AdminPage />
            },
            
        ]
    },
  
  
   

])


const root = ReactDom.createRoot(document.getElementById('root'))

root.render(<RouterProvider router={appRouter} />) 