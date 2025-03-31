import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, Typography, Grid, Card, CardContent, CardActions,
    Button, Chip, TextField, FormControl, InputLabel,
    Select, MenuItem, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {
    fetchRooms,
    selectAllRooms,
    setSelectedRoom,
    setSelectedDate,
    selectSelectedDate
} from './roomsSlice';
import dayjs from 'dayjs';

const RoomListing = () => {
    const dispatch = useDispatch();
    const rooms = useSelector(selectAllRooms);
    const selectedDate = useSelector(selectSelectedDate);
    const [filter, setFilter] = useState({
        roomNumber: '',
        capacity: '',
        feature: ''
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
        // Navigate to room detail page in a real app
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

                    {/* Остальной код компонента */}
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
                                >
                                    Забронировать
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default RoomListing;