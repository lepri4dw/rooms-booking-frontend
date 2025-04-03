import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Grid
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import {
    selectAllRooms,
    setSelectedRoom,
    selectSelectedRoom,
    selectSelectedDate,
    selectRoomAvailability,
    createBooking,
    setSelectedDate
} from '../roomsSlice';
import dayjs from "dayjs";

const RoomDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const rooms = useSelector(selectAllRooms);
    const selectedRoom = useSelector(state => selectSelectedRoom(state));
    const selectedDate = useSelector(selectSelectedDate);
    const { schedule, bookings } = useSelector(state =>
        selectedRoom ? selectRoomAvailability(state, selectedRoom.id, selectedDate) : { schedule: [], bookings: [] }
    );

    const [openBookingDialog, setOpenBookingDialog] = useState(false);
    const [bookingDate, setBookingDate] = useState(dayjs(selectedDate));
    const [bookingData, setBookingData] = useState({
        startTime: '',
        endTime: '',
        purpose: ''
    });

    // Set the selected room based on URL parameter
    useEffect(() => {
        if (id && rooms.length > 0) {
            const roomId = parseInt(id);
            const room = rooms.find(r => r.id === roomId);
            if (room) {
                dispatch(setSelectedRoom(room));
            } else {
                navigate('/rooms');
            }
        }
    }, [id, rooms, dispatch, navigate]);

    if (!selectedRoom) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h5">
                    Загрузка аудитории...
                </Typography>
            </Box>
        );
    }

    const getDayOfWeek = (dateString) => {
        const date = new Date(dateString);
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        return days[date.getDay()];
    };

    const daySchedule = schedule.filter(item => item.day === getDayOfWeek(selectedDate));

    const timeSlots = [
        { start: '09:30', end: '10:50' },
        { start: '11:00', end: '12:20' },
        { start: '12:30', end: '13:50' },
        { start: '14:00', end: '15:20' },
        { start: '15:30', end: '16:50' },
        { start: '17:00', end: '18:20' }
    ];

    const handleOpenBookingDialog = () => {
        setOpenBookingDialog(true);
    };

    const handleCloseBookingDialog = () => {
        setOpenBookingDialog(false);
        setBookingData({ startTime: '', endTime: '', purpose: '' });
    };

    const handleBookingDateChange = (newDate) => {
        setBookingDate(newDate);
    };

    const handleBookingDataChange = (field, value) => {
        setBookingData({
            ...bookingData,
            [field]: value
        });
    };

    const handleSubmitBooking = () => {
        dispatch(createBooking({
            roomId: selectedRoom.id,
            date: bookingDate.toISOString().split('T')[0],
            ...bookingData,
            userId: 1, // In a real app, get this from auth state
        }));

        handleCloseBookingDialog();
    };

    const isTimeSlotOccupied = (start, end) => {
        const scheduleConflict = daySchedule.some(
            item => (start < item.endTime && end > item.startTime)
        );

        const bookingConflict = bookings.some(
            booking => (start < booking.endTime && end > booking.startTime)
        );

        return scheduleConflict || bookingConflict;
    };

    return (
        <Box sx={{ p: 3 }}>
            <Button variant="outlined" onClick={() => navigate('/rooms')} sx={{ mb: 2 }}>
                ← Назад к списку аудиторий
            </Button>

            <Typography variant="h4" gutterBottom>
                Аудитория {selectedRoom.roomNumber}
            </Typography>

            <Box sx={{ mb: 3 }}>
                <Typography variant="h6">
                    Информация об аудитории
                </Typography>

                <Typography>Вместимость: {selectedRoom.capacity} человек</Typography>

                <Box sx={{ mt: 1 }}>
                    {selectedRoom.features.map((feature) => (
                        <Chip
                            key={feature}
                            label={feature === 'whiteboard' ? 'Доска' :
                                feature === 'projector' ? 'Проектор' : feature === 'computers' ? 'Компьютеры' : feature}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                        />
                    ))}
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={handleOpenBookingDialog}
                >
                    Забронировать аудиторию
                </Button>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                        <Typography variant="h6">
                            Расписание на {new Date(selectedDate).toLocaleDateString('ru-RU')} ({getDayOfWeek(selectedDate)})
                        </Typography>
                    </Grid>
                    <Grid item>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Изменить дату"
                                value={dayjs(selectedDate)}
                                onChange={(newDate) => {
                                    if (newDate) {
                                        dispatch(setSelectedDate(newDate.toISOString().split('T')[0]));
                                    }
                                }}
                                slotProps={{
                                    textField: {
                                        size: "small",
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Время</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Занятие/Бронирование</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {timeSlots.map((slot) => {
                            const scheduledClass = daySchedule.find(
                                item => item.startTime === slot.start && item.endTime === slot.end
                            );

                            const booking = bookings.find(
                                item => item.startTime === slot.start && item.endTime === slot.end
                            );

                            const isOccupied = isTimeSlotOccupied(slot.start, slot.end);

                            return (
                                <TableRow key={`${slot.start}-${slot.end}`}>
                                    <TableCell>{slot.start} - {slot.end}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={isOccupied ? "Занято" : "Свободно"}
                                            color={isOccupied ? "error" : "success"}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {scheduledClass ? (
                                            <Typography>
                                                {scheduledClass.courseName} ({scheduledClass.instructor})
                                            </Typography>
                                        ) : booking ? (
                                            <Typography>
                                                Бронирование: {booking.purpose}
                                            </Typography>
                                        ) : (
                                            "—"
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openBookingDialog} onClose={handleCloseBookingDialog}>
                <DialogTitle>Забронировать аудиторию {selectedRoom.roomNumber}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1, minWidth: '300px' }}>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Выберите дату"
                                    value={bookingDate}
                                    onChange={handleBookingDateChange}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    label="Время начала"
                                    value={bookingData.startTime ? dayjs(bookingDate).hour(bookingData.startTime.split(':')[0]).minute(bookingData.startTime.split(':')[1]) : null}
                                    onChange={(newValue) => {
                                        if (newValue) {
                                            const hours = newValue.hour().toString().padStart(2, '0');
                                            const minutes = newValue.minute().toString().padStart(2, '0');
                                            handleBookingDataChange('startTime', `${hours}:${minutes}`);
                                        }
                                    }}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    label="Время окончания"
                                    value={bookingData.endTime ? dayjs(bookingDate).hour(bookingData.endTime.split(':')[0]).minute(bookingData.endTime.split(':')[1]) : null}
                                    onChange={(newValue) => {
                                        if (newValue) {
                                            const hours = newValue.hour().toString().padStart(2, '0');
                                            const minutes = newValue.minute().toString().padStart(2, '0');
                                            handleBookingDataChange('endTime', `${hours}:${minutes}`);
                                        }
                                    }}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Цель бронирования"
                                value={bookingData.purpose}
                                onChange={(e) => handleBookingDataChange('purpose', e.target.value)}
                                fullWidth
                                multiline
                                rows={2}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseBookingDialog}>Отмена</Button>
                    <Button
                        onClick={handleSubmitBooking}
                        color="primary"
                        disabled={!bookingData.startTime || !bookingData.endTime || !bookingData.purpose}
                    >
                        Забронировать
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RoomDetail;