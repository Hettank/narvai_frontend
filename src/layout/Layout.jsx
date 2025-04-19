import { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import useAuthStore from '../store/useAuthStore';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = path => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const storeName = 'Shree Narvai Mini Mart';

  // const menuItems = [{ text: 'Daily Expenses', icon: <ReceiptLongIcon />, path: '/expenses' }];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <AppBar position="static" sx={{ bgcolor: 'secondary.main' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{
                display: { xs: 'none', sm: 'block' },
                fontFamily: 'Rubik',
                fontWeight: 600,
                color: 'background.paper',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
            >
              {storeName}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isAuthenticated ? (
              <>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  startIcon={<LoginIcon />}
                  sx={{
                    color: 'background.paper',
                    borderColor: 'background.paper',
                    '&:hover': {
                      borderColor: 'accent.main',
                      backgroundColor: 'rgba(249, 194, 46, 0.08)',
                    },
                    display: { xs: 'none', sm: 'flex' },
                  }}
                >
                  Login
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => navigate('/register')}
                  startIcon={<PersonAddIcon />}
                  sx={{
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                >
                  Register
                </Button>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography
                  sx={{ color: 'background.paper', display: { xs: 'none', sm: 'block' } }}
                >
                  {user?.username}
                </Typography>
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: 'accent.main',
                    color: 'secondary.main',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{
                    color: 'background.paper',
                    borderColor: 'background.paper',
                    '&:hover': {
                      borderColor: 'primary.light',
                      backgroundColor: 'rgba(214, 73, 51, 0.08)',
                    },
                    ml: 1,
                    display: { xs: 'none', sm: 'flex' },
                  }}
                >
                  Logout
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: { width: '75%', maxWidth: '280px', bgcolor: 'background.paper' },
        }}
      >
        <Box sx={{ p: 3, bgcolor: 'secondary.main', color: 'background.paper' }}>
          <Typography variant="h6" sx={{ fontFamily: 'Rubik', fontWeight: 600 }}>
            {storeName}
          </Typography>
          {isAuthenticated && user && (
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
              Welcome, {user.username}
            </Typography>
          )}
        </Box>
        <Divider />

        {/* Menu Items  */}
        {/* <List>
          {menuItems.map(item => (
            <ListItem
              button
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              sx={{
                py: 1.5,
                '&:hover': {
                  bgcolor: 'rgba(214, 73, 51, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>
                    {item.text}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List> */}

        <Divider />
        <List>
          {isAuthenticated ? (
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                py: 1.5,
                '&:hover': {
                  bgcolor: 'rgba(214, 73, 51, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>Logout</Typography>
                }
              />
            </ListItem>
          ) : (
            <>
              <ListItem
                button
                onClick={() => handleNavigation('/login')}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(214, 73, 51, 0.08)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'primary.main' }}>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>Login</Typography>
                  }
                />
              </ListItem>
              <ListItem
                button
                onClick={() => handleNavigation('/register')}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(214, 73, 51, 0.08)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'primary.main' }}>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>
                      Register
                    </Typography>
                  }
                />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>

      <Box sx={{ p: 2, flexGrow: 1 }}>{children}</Box>
    </Box>
  );
};

export default Layout;
