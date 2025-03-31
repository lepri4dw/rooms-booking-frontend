import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Box, Typography, Tabs, Tab, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Button, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { selectBookings, selectAllRooms } from '../../rooms/roomsSlice';

const UserDashboard = () => {
    const [tabValue, setTabValue] = useState(0);
    const allBookings = useSelector(selectBookings);
    const rooms = useSelector(selectAllRooms);

    // Mock current user ID (in a real app, this would come from authentication)
    const currentUserId = 1;

    // Filter bookings for the current user
    const userBookings = allBookings.filter(booking => booking.userId === currentUserId);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const getRoomNumber = (roomId) => {
        const room = rooms.find(r => r.id === roomId);
        return room ? room.roomNumber : 'Unknown';
    };

    // Filter bookings based on status for each tab
    const filteredBookings = tabValue === 0
        ? userBookings
        : userBookings.filter(booking => {
            if (tabValue === 1) return booking.status === 'pending';
            if (tabValue === 2) return booking.status === 'approved';
            if (tabValue === 3) return booking.status === 'rejected';
            return false;
        });

    const getStatusChip = (status) => {
        let color = 'default';
        let label = status;

        switch (status) {
            case 'pending':
                color = 'warning';
                label = 'Ожидает подтверждения';
                break;
            case 'approved':
                color = 'success';
                label = 'Подтверждено';
                break;
            case 'rejected':
                color = 'error';
                label = 'Отклонено';
                break;
            default:
                break;
        }

        return <Chip label={label} color={color} size="small" />;
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Мои бронирования
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="booking tabs">
                    <Tab label="Все" />
                    <Tab label="Ожидающие" />
                    <Tab label="Подтвержденные" />
                    <Tab label="Отклоненные" />
                </Tabs>
            </Box>

            {filteredBookings.length === 0 ? (
                <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
                    У вас нет бронирований в этой категории
                </Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Аудитория</TableCell>
                                <TableCell>Дата</TableCell>
                                <TableCell>Время</TableCell>
                                <TableCell>Цель</TableCell>
                                <TableCell>Статус</TableCell>
                                <TableCell>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredBookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell>{getRoomNumber(booking.roomId)}</TableCell>
                                    <TableCell>
                                        {new Date(booking.date).toLocaleDateString('ru-RU')}
                                    </TableCell>
                                    <TableCell>
                                        {booking.startTime} - {booking.endTime}
                                    </TableCell>
                                    <TableCell>{booking.purpose}</TableCell>
                                    <TableCell>
                                        {getStatusChip(booking.status)}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            disabled={booking.status !== 'pending'}
                                            color="primary"
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            disabled={booking.status === 'approved'}
                                            color="error"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default UserDashboard;