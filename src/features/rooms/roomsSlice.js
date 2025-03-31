// features/rooms/roomsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Mock data for rooms
const initialRooms = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    roomNumber: `${201 + i}`,
    capacity: Math.floor(Math.random() * 15) + 20, // Random capacity between 20-35
    features: ['whiteboard', ...(Math.random() > 0.5 ? ['projector'] : []), ...(Math.random() > 0.7 ? ['computers'] : [])]
}));

// Mock data for schedule
const generateMockSchedule = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = [
        { start: '08:00', end: '09:30' },
        { start: '09:45', end: '11:15' },
        { start: '11:30', end: '13:00' },
        { start: '13:30', end: '15:00' },
        { start: '15:15', end: '16:45' },
        { start: '17:00', end: '18:30' }
    ];

    const schedule = [];

    initialRooms.forEach(room => {
        days.forEach(day => {
            // Create 2-3 random classes per day for each room
            const numClasses = Math.floor(Math.random() * 2) + 2;
            const usedTimeSlots = new Set();

            for (let i = 0; i < numClasses; i++) {
                let timeSlotIndex;
                do {
                    timeSlotIndex = Math.floor(Math.random() * timeSlots.length);
                } while (usedTimeSlots.has(timeSlotIndex));

                usedTimeSlots.add(timeSlotIndex);
                const timeSlot = timeSlots[timeSlotIndex];

                schedule.push({
                    id: schedule.length + 1,
                    roomId: room.id,
                    day,
                    startTime: timeSlot.start,
                    endTime: timeSlot.end,
                    courseName: `Course ${Math.floor(Math.random() * 10) + 1}`,
                    instructor: `Professor ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`
                });
            }
        });
    });

    return schedule;
};

// Mock data for bookings
const generateMockBookings = () => {
    const bookings = [];
    const today = new Date();

    for (let i = 0; i < 20; i++) {
        const roomId = Math.floor(Math.random() * 15) + 1;
        const date = new Date(today);
        date.setDate(date.getDate() + Math.floor(Math.random() * 14)); // Random date within next 2 weeks

        const startHour = Math.floor(Math.random() * 8) + 10; // Between 10 and 18
        const endHour = startHour + 1 + Math.floor(Math.random() * 2); // 1-3 hours long

        bookings.push({
            id: i + 1,
            roomId,
            userId: Math.floor(Math.random() * 10) + 1,
            date: date.toISOString().split('T')[0],
            startTime: `${startHour}:00`,
            endTime: `${endHour}:00`,
            purpose: `Group study session ${i + 1}`,
            status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)]
        });
    }

    return bookings;
};

const initialState = {
    rooms: initialRooms,
    schedule: generateMockSchedule(),
    bookings: generateMockBookings(),
    status: 'idle',
    error: null,
    selectedRoom: null,
    selectedDate: new Date().toISOString().split('T')[0],
};

// Async thunks would go here to fetch from your Django API
export const fetchRooms = createAsyncThunk(
    'rooms/fetchRooms',
    async () => {
        // In a real app, you'd use axios to fetch from your Django backend
        // const response = await axios.get('/api/rooms/');
        // return response.data;

        // For now, just return the mock data
        return initialRooms;
    }
);

export const createBooking = createAsyncThunk(
    'rooms/createBooking',
    async (bookingData) => {
        // In a real app: const response = await axios.post('/api/bookings/', bookingData);
        // return response.data;

        // For now, simulate a successful booking
        return {
            id: Date.now(),
            ...bookingData,
            status: 'pending'
        };
    }
);

const roomsSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
        setSelectedRoom: (state, action) => {
            state.selectedRoom = action.payload;
        },
        setSelectedDate: (state, action) => {
            state.selectedDate = action.payload;
        },
        filterAvailableRooms: (state, action) => {
            const { date, startTime, endTime } = action.payload;
            // Logic to filter available rooms based on date and time would go here
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRooms.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRooms.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.rooms = action.payload;
            })
            .addCase(fetchRooms.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.bookings.push(action.payload);
            });
    },
});

export const { setSelectedRoom, setSelectedDate, filterAvailableRooms } = roomsSlice.actions;

export const selectAllRooms = (state) => state.rooms.rooms;
export const selectSchedule = (state) => state.rooms.schedule;
export const selectBookings = (state) => state.rooms.bookings;
export const selectSelectedRoom = (state) => state.rooms.selectedRoom;
export const selectSelectedDate = (state) => state.rooms.selectedDate;

export const selectRoomAvailability = (state, roomId, date) => {
    const schedule = state.rooms.schedule.filter(item => item.roomId === roomId);
    const bookings = state.rooms.bookings.filter(
        booking => booking.roomId === roomId && booking.date === date && booking.status === 'approved'
    );

    // Return both the regular schedule and bookings for this room
    return { schedule, bookings };
};

export const roomsReducer = roomsSlice.reducer;