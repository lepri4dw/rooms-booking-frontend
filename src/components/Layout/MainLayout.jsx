import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText,
    Divider, IconButton, useTheme, Box, Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser} from '../../features/users/usersSlice';
import { logout } from '../../features/users/usersThunks';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 0,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: drawerWidth,
        }),
    }),
);

const AppBarStyled = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
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

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const MainLayout = ({ children }) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <>
            <AppBarStyled position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Бронирование аудиторий
                    </Typography>
                    {!user ? (
                        <>
                            <Button color="inherit" component={Link} to="/login">
                                Войти
                            </Button>
                            <Button color="inherit" component={Link} to="/register">
                                Регистрация
                            </Button>
                        </>
                    ) : (
                        <Typography variant="body1">
                            {user.displayName || user.username}
                        </Typography>
                    )}
                </Toolbar>
            </AppBarStyled>

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
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItem button component={Link} to="/dashboard">
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Моя панель" />
                    </ListItem>
                    <ListItem button component={Link} to="/rooms">
                        <ListItemIcon>
                            <MeetingRoomIcon />
                        </ListItemIcon>
                        <ListItemText primary="Аудитории" />
                    </ListItem>
                    <ListItem button component={Link} to="/bookings">
                        <ListItemIcon>
                            <BookmarkIcon />
                        </ListItemIcon>
                        <ListItemText primary="Мои бронирования" />
                    </ListItem>
                </List>
                <Divider />
                {user && (
                    <List>
                        <ListItem button onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Выйти" />
                        </ListItem>
                    </List>
                )}
            </Drawer>

            <Main open={open}>
                <DrawerHeader />
                <Box sx={{ minWidth: '100%' }}>
                    {children}
                </Box>
            </Main>
        </>
    );
};

export default MainLayout;