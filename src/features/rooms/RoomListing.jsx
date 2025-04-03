import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Grid, Card, CardContent, CardActions,
    Button, Chip, TextField, FormControl, InputLabel,
    Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import {
    fetchRooms,
    selectAllRooms,
    setSelectedRoom,
    setSelectedDate,
    selectSelectedDate,
    createBooking
} from './roomsSlice';
import dayjs from 'dayjs';

const RoomListing = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const rooms = useSelector(selectAllRooms);
    const selectedDate = useSelector(selectSelectedDate);
    const [filter, setFilter] = useState({
        roomNumber: '',
        capacity: '',
        feature: ''
    });

    // State for booking dialog
    const [openBookingDialog, setOpenBookingDialog] = useState(false);
    const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
    const [bookingDate, setBookingDate] = useState(dayjs(selectedDate));
    const [bookingData, setBookingData] = useState({
        startTime: '',
        endTime: '',
        purpose: ''
    });

    useEffect(() => {
        dispatch(fetchRooms());
    }, [dispatch]);

    const handleDateChange = (newDate) => {
        const formattedDate = newDate.toISOString().split('T')[0];
        dispatch(setSelectedDate(formattedDate));
    };

    const handleFilterChange = (event) => {
        setFilter({
            ...filter,
            [event.target.name]: event.target.value
        });
    };

    const handleRoomSelect = (room) => {
        dispatch(setSelectedRoom(room));
        navigate(`/rooms/${room.id}`);
    };

    // Booking dialog handlers
    const handleOpenBookingDialog = (room) => {
        setSelectedRoomForBooking(room);
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
            roomId: selectedRoomForBooking.id,
            date: bookingDate.toISOString().split('T')[0],
            ...bookingData,
            userId: 1, // In a real app, get this from auth state
        }));

        handleCloseBookingDialog();
    };

    const filteredRooms = rooms.filter(room => {
        return (
            (filter.roomNumber === '' || room.roomNumber.includes(filter.roomNumber)) &&
            (filter.capacity === '' || room.capacity >= Number(filter.capacity)) &&
            (filter.feature === '' || room.features.includes(filter.feature))
        );
    });

    const features = [...new Set(rooms.flatMap(room => room.features))];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Аудитории для бронирования
            </Typography>

            <Box sx={{ mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={3}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Выберите дату"
                                value={dayjs(selectedDate)}
                                onChange={handleDateChange}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            name="roomNumber"
                            label="Номер аудитории"
                            value={filter.roomNumber}
                            onChange={handleFilterChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            name="capacity"
                            label="Минимальная вместимость"
                            type="number"
                            value={filter.capacity}
                            onChange={handleFilterChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Особенности</InputLabel>
                            <Select
                                name="feature"
                                value={filter.feature}
                                onChange={handleFilterChange}
                                label="Особенности"
                            >
                                <MenuItem value="">Любые</MenuItem>
                                {features.map(feature => (
                                    <MenuItem key={feature} value={feature}>
                                        {feature === 'whiteboard' ? 'Доска' :
                                            feature === 'projector' ? 'Проектор' :
                                                feature === 'computers' ? 'Компьютеры' : feature}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

            <Grid container spacing={3}>
                {filteredRooms.map((room) => (
                    <Grid item xs={12} sm={6} md={4} key={room.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Аудитория {room.roomNumber}
                                </Typography>
                                <Typography color="text.secondary">
                                    Вместимость: {room.capacity} человек
                                </Typography>
                                <Box sx={{ mt: 1 }}>
                                    {room.features.map((feature) => (
                                        <Chip
                                            key={feature}
                                            label={feature === 'whiteboard' ? 'Доска' :
                                                feature === 'projector' ? 'Проектор' :
                                                    feature === 'computers' ? 'Компьютеры' : feature}
                                            size="small"
                                            sx={{ mr: 0.5, mb: 0.5 }}
                                        />
                                    ))}
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => handleRoomSelect(room)}
                                >
                                    Посмотреть расписание
                                </Button>
                                <Button
                                    size="small"
                                    color="secondary"
                                    onClick={() => handleOpenBookingDialog(room)}
                                >
                                    Забронировать
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Booking Dialog */}
            <Dialog open={openBookingDialog} onClose={handleCloseBookingDialog}>
                <DialogTitle>
                    {selectedRoomForBooking ? `Забронировать аудиторию ${selectedRoomForBooking.roomNumber}` : 'Забронировать аудиторию'}
                </DialogTitle>
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

export default RoomListing;