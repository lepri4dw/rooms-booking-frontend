import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Grid
} from '@mui/material';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider, DatePicker, TimePicker} from '@mui/x-date-pickers';
import {
    selectSelectedRoom,
    selectSelectedDate,
    selectRoomAvailability,
    createBooking
} from '../roomsSlice';
import dayjs from "dayjs";

const RoomDetail = () => {
    const dispatch = useDispatch();
    const selectedRoom = useSelector(state => selectSelectedRoom(state));
    const selectedDate = useSelector(selectSelectedDate);
    const {schedule, bookings} = useSelector(state =>
        selectedRoom ? selectRoomAvailability(state, selectedRoom.id, selectedDate) : {schedule: [], bookings: []}
    );

    const [openBookingDialog, setOpenBookingDialog] = useState(false);
    const [bookingDate, setBookingDate] = useState(dayjs(selectedDate)); // Новое состояние для даты бронирования
    const [bookingData, setBookingData] = useState({
        startTime: '',
        endTime: '',
        purpose: ''
    });

    if (!selectedRoom) {
        return (
            <Box sx={{p: 3}}>
                <Typography variant="h5">
                    Пожалуйста, выберите аудиторию для просмотра расписания
                </Typography>
            </Box>
        );
    }

    // Get the day of the week for the selected date
    const getDayOfWeek = (dateString) => {
        const date = new Date(dateString);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    };

    const daySchedule = schedule.filter(item => item.day === getDayOfWeek(selectedDate));

    // Combine schedule and bookings for the selected date
    const timeSlots = [
        {start: '08:00', end: '09:30'},
        {start: '09:45', end: '11:15'},
        {start: '11:30', end: '13:00'},
        {start: '13:30', end: '15:00'},
        {start: '15:15', end: '16:45'},
        {start: '17:00', end: '18:30'}
    ];

    const handleOpenBookingDialog = () => {
        setOpenBookingDialog(true);
    };

    const handleCloseBookingDialog = () => {
        setOpenBookingDialog(false);
    };

    const handleBookingDateChange = (newDate) => { // Новая функция для обработки изменения даты бронирования
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
            date: bookingDate.toISOString().split('T')[0], // Используем дату бронирования
            ...bookingData,
            userId: 1, // This would come from auth in a real app
        }));

        handleCloseBookingDialog();
    };

    const isTimeSlotOccupied = (start, end) => {
        // Check if slot is occupied by regular schedule
        const scheduleConflict = daySchedule.some(
            item => (start < item.endTime && end > item.startTime)
        );

        // Check if slot is occupied by a booking
        const bookingConflict = bookings.some(
            booking => (start < booking.endTime && end > booking.startTime)
        );

        return scheduleConflict || bookingConflict;
    };

    return (
        <Box sx={{p: 3}}>
            <Typography variant="h4" gutterBottom>
                Аудитория {selectedRoom.roomNumber}
            </Typography>

            <Box sx={{mb: 3}}>
                <Typography variant="h6">
                    Информация об аудитории
                </Typography>

                <Typography>Вместимость: {selectedRoom.capacity} человек</Typography>

                <Box sx={{mt: 1}}>
                    {selectedRoom.features.map((feature) => (
                        <Chip
                            key={feature}
                            label={feature === 'whiteboard' ? 'Доска' :
                                feature === 'projector' ? 'Проектор' : feature === 'computers' ? 'Компьютеры' : feature}
                            size="small"
                            sx={{mr: 0.5, mb: 0.5}}
                        />
                    ))}
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    sx={{mt: 2}}
                    onClick={handleOpenBookingDialog}
                >
                    Забронировать аудиторию
                </Button>
            </Box>


            <Typography variant="h6" gutterBottom>
                Расписание на {new Date(selectedDate).toLocaleDateString('ru-RU')}
            </Typography>

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
                    <Grid container spacing={2} sx={{mt: 1}}>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Выберите дату"
                                    value={bookingDate}
                                    onChange={handleBookingDateChange} // Используем новую функцию
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        {/* ... остальной код диалогового окна ... */}
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