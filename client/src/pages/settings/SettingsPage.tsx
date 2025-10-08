import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Switch, 
  FormControlLabel,
  Divider,
  Avatar,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as ThemeIcon,
  Person as PersonIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

const SettingsPage = () => {
  const theme = useTheme();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    autoRefresh: true,
    soundAlerts: false,
    emailNotifications: true,
  });

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const settingsCategories = [
    {
      title: 'Notifications',
      icon: <NotificationsIcon />,
      items: [
        { key: 'notifications', label: 'Push Notifications', value: settings.notifications },
        { key: 'emailNotifications', label: 'Email Notifications', value: settings.emailNotifications },
        { key: 'soundAlerts', label: 'Sound Alerts', value: settings.soundAlerts },
      ]
    },
    {
      title: 'Appearance',
      icon: <ThemeIcon />,
      items: [
        { key: 'darkMode', label: 'Dark Mode', value: settings.darkMode },
        { key: 'autoRefresh', label: 'Auto Refresh Data', value: settings.autoRefresh },
      ]
    },
    {
      title: 'Security',
      icon: <SecurityIcon />,
      items: []
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Box sx={{ p: 3 }}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              mb: 1,
            }}
          >
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Customize your space exploration dashboard experience.
          </Typography>
        </motion.div>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 3 
        }}>
          {/* Profile Settings */}
          <Box>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar 
                      sx={{ 
                        background: alpha(theme.palette.primary.main, 0.2),
                        color: theme.palette.primary.main,
                        width: 48,
                        height: 48,
                        mr: 2,
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight={600}>
                      Profile Information
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Full Name"
                      defaultValue="Space Explorer"
                      variant="outlined"
                      fullWidth
                    />
                    <TextField
                      label="Email"
                      defaultValue="explorer@nasa.gov"
                      variant="outlined"
                      fullWidth
                    />
                    <TextField
                      label="Role"
                      defaultValue="Mission Controller"
                      variant="outlined"
                      fullWidth
                    />
                    <Button 
                      variant="contained" 
                      startIcon={<SaveIcon />}
                      sx={{ mt: 2, alignSelf: 'flex-start' }}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Box>

          {/* Settings Categories */}
          <Box>
            {settingsCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <Card sx={{ mb: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          background: alpha(theme.palette.secondary.main, 0.2),
                          color: theme.palette.secondary.main,
                          width: 40,
                          height: 40,
                          mr: 2,
                        }}
                      >
                        {category.icon}
                      </Avatar>
                      <Typography variant="h6" fontWeight={600}>
                        {category.title}
                      </Typography>
                    </Box>
                    
                    {category.items.length > 0 ? (
                      category.items.map((item, itemIndex) => (
                        <Box key={item.key}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={item.value}
                                onChange={() => handleSettingChange(item.key as keyof typeof settings)}
                                color="primary"
                              />
                            }
                            label={item.label}
                            sx={{ width: '100%', justifyContent: 'space-between', m: 0 }}
                          />
                          {itemIndex < category.items.length - 1 && (
                            <Divider sx={{ my: 1 }} />
                          )}
                        </Box>
                      ))
                    ) : (
                      <Paper sx={{ p: 2, backgroundColor: alpha(theme.palette.info.main, 0.1) }}>
                        <Typography variant="body2" color="text.secondary">
                          Advanced security settings will be available in the next update.
                        </Typography>
                      </Paper>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default SettingsPage;
