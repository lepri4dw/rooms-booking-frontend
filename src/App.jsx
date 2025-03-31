import React, {useState} from 'react';
import {BrowserRouter as Router, Routes, Route, Link, Navigate} from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Button, Container, Box,
    Drawer, List, ListItem, ListItemIcon, ListItemText,
    CssBaseline, Divider, IconButton, useTheme, Grid
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {styled} from '@mui/material/styles';
import Register from "./features/users/Register";
import UserDashboard from "./features/users/components/UserDashboard";
import RoomListing from "./features/rooms/RoomListing";
import RoomDetail from "./features/rooms/components/RoomDetail";
import AppToolbar from "./components/UI/AppToolbar/AppToolbar";
import Login from "./features/users/Login"; // Assuming you have a Login component

const drawerWidth = 240;

const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

const AppBarStyled = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

function App() {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
    };

    return (
        <>
            <CssBaseline/>
            <header>
                <AppToolbar isLoggedIn={isLoggedIn} onLogout={handleLogout}/>
            </header>
            <main>
                <Container maxWidth="xl">
                    <Routes>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
                        <Route path="/dashboard" element={<UserDashboard/>}/>
                        <Route path="/rooms" element={<RoomListing/>}/>
                        <Route path="/rooms/:id" element={<RoomDetail/>}/>
                        <Route path="/bookings" element={<UserDashboard/>}/>
                        <Route path="/schedule" element={<RoomDetail/>}/>
                        <Route path="/" element={<Navigate to="/rooms" replace/>}/>
                        <Route path="*" element={<h1>Not Found! This page does not exist!</h1>}/>
                    </Routes>
                </Container>
            </main>

            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                    </IconButton>
                </DrawerHeader>
                <Divider/>
                <List>
                    <ListItem button component={Link} to="/dashboard">
                        <ListItemIcon>
                            <DashboardIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Моя панель"/>
                    </ListItem>
                    <ListItem button component={Link} to="/rooms">
                        <ListItemIcon>
                            <MeetingRoomIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Аудитории"/>
                    </ListItem>
                    <ListItem button component={Link} to="/bookings">
                        <ListItemIcon>
                            <BookmarkIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Мои бронирования"/>
                    </ListItem>
                    <ListItem button component={Link} to="/schedule">
                        <ListItemIcon>
                            <CalendarTodayIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Расписание"/>
                    </ListItem>
                </List>
                <Divider/>
                <List>
                    <ListItem button onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Выйти"/>
                    </ListItem>
                </List>
            </Drawer>
            <AppBarStyled position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{mr: 2, ...(open && {display: 'none'})}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
                        Бронирование аудиторий
                    </Typography>
                </Toolbar>
            </AppBarStyled>
            <Main open={open}>
                <DrawerHeader/>
            </Main>
        </>
    );
}

export default App;