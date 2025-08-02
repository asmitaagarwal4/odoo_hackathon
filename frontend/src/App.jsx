"use client"
import React from "react"
import './App.css'
import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from "./pages/Dashboard";
import Ticket from "./pages/CreateTicket";
// import AboutPage from './pages/AboutPage';
// import NotFoundPage from './pages/NotFoundPage';



function App() {


  return (
    <>
      <Routes>
        {/* The `element` prop takes the component to render */}
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/createticket" element={<Ticket />} />
        {/* This is the catch-all route for 404 Not Found pages */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </>
  )
}

export default App
