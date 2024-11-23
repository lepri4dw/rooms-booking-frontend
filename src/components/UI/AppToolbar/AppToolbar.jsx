import { AppBar, Grid, styled, Toolbar, Typography } from '@mui/material';
import { Link as NavLink } from 'react-router-dom';
import { selectUser } from '../../../features/users/usersSlice';
import UserMenu from './UserMenu';
import AnonMenu from './AnonMenu';
import {useSelector} from "react-redux";

const Link = styled(NavLink)({
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': {
    color: 'inherit'
  },
});

const AppToolbar = () => {
  const user = useSelector(selectUser);

  return (
    <AppBar position="sticky" sx={{mb: 2}}>
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            <Link to="/">Online Courses</Link>
          </Typography>
          <Grid item>
            {user ? <UserMenu user={user}/> : <AnonMenu/>}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;