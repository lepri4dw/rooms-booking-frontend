import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import Register from "./features/users/Register";
import Login from "./features/users/Login";
import UserDashboard from "./features/users/components/UserDashboard";
import RoomListing from "./features/rooms/RoomListing";
import RoomDetail from "./features/rooms/components/RoomDetail";
import MainLayout from './components/Layout/MainLayout';

function App() {
    return (
        <>
            <CssBaseline />
            <MainLayout>
                <Container maxWidth="xl">
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={<UserDashboard />} />
                        <Route path="/rooms" element={<RoomListing />} />
                        <Route path="/rooms/:id" element={<RoomDetail />} />
                        <Route path="/bookings" element={<UserDashboard />} />
                        <Route path="/" element={<Navigate to="/rooms" replace />} />
                        <Route path="*" element={<h1>Not Found! This page does not exist!</h1>} />
                    </Routes>
                </Container>
            </MainLayout>
        </>
    );
}

export default App;