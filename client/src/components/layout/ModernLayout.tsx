import { useState } from 'react';
import { ReactNode } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Rocket as RocketIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

const drawerWidth = 280;

const Layout = ({ children }: LayoutProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Missions', icon: <RocketIcon />, path: '/missions' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { text: 'Trends', icon: <TrendingUpIcon />, path: '/trends' },
    { text: 'AI Chat', icon: <ChatIcon />, path: '/chat' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const sidebarVariants = {
    open: {
      width: drawerWidth,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
      },
    },
    closed: {
      width: 70,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const contentVariants = {
    open: {
      marginLeft: drawerWidth,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
      },
    },
    closed: {
      marginLeft: 70,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
      },
    },
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Top Navigation Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              flexGrow: 1,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            AI Space Explorer
          </Typography>

          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              }}
            >
              <PersonIcon />
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                background: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 2,
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => navigate('/profile')}>
              <Avatar /> Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => navigate('/settings')}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={() => navigate('/')}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        animate={drawerOpen ? 'open' : 'closed'}
        initial="open"
      >
        <Drawer
          variant="permanent"
          sx={{
            width: drawerOpen ? drawerWidth : 70,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerOpen ? drawerWidth : 70,
              boxSizing: 'border-box',
              background: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(20px)',
              border: 'none',
              borderRight: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              overflow: 'hidden',
              transition: 'width 0.3s ease-in-out',
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto', mt: 2 }}>
            <List>
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ListItem disablePadding sx={{ px: 1 }}>
                    <ListItemButton
                      onClick={() => handleNavigation(item.path)}
                      selected={location.pathname === item.path}
                      sx={{
                        minHeight: 48,
                        borderRadius: 2,
                        mb: 0.5,
                        px: drawerOpen ? 2.5 : 1.5,
                        justifyContent: drawerOpen ? 'initial' : 'center',
                        background: location.pathname === item.path 
                          ? alpha(theme.palette.primary.main, 0.2)
                          : 'transparent',
                        '&:hover': {
                          background: alpha(theme.palette.primary.main, 0.1),
                          transform: 'translateX(4px)',
                        },
                        transition: 'all 0.3s ease-in-out',
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: drawerOpen ? 3 : 'auto',
                          justifyContent: 'center',
                          color: location.pathname === item.path 
                            ? theme.palette.primary.main 
                            : theme.palette.text.secondary,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <AnimatePresence>
                        {drawerOpen && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ListItemText 
                              primary={item.text}
                              sx={{
                                color: location.pathname === item.path 
                                  ? theme.palette.primary.main 
                                  : theme.palette.text.primary,
                                fontWeight: location.pathname === item.path ? 600 : 400,
                              }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </ListItemButton>
                  </ListItem>
                </motion.div>
              ))}
            </List>
          </Box>

          {/* Collapse Button */}
          <Box sx={{ position: 'absolute', bottom: 16, left: drawerOpen ? 16 : 8 }}>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                background: alpha(theme.palette.primary.main, 0.2),
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.3),
                },
              }}
            >
              <motion.div
                animate={{ rotate: drawerOpen ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronLeftIcon />
              </motion.div>
            </IconButton>
          </Box>
        </Drawer>
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={contentVariants}
        animate={drawerOpen ? 'open' : 'closed'}
        initial="open"
        style={{ flexGrow: 1 }}
      >
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8, // Account for AppBar height
            minHeight: 'calc(100vh - 64px)',
            background: `radial-gradient(ellipse at top, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%)`,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </Box>
      </motion.div>
    </Box>
  );
};

export default Layout;
