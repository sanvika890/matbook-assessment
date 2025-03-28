import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Container,
  Grid,
  Link,
  Paper,
  Alert,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import AppleIcon from '@mui/icons-material/Apple';
import HighBridgeIcon from '../assets/HighBridgeIcon';
import { login } from '../services/auth.service';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login({ email, password });
      // Store token in localStorage or a secure storage solution
      localStorage.setItem('token', response.token);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        height: '100vh', 
        display: 'flex',
        backgroundImage: 'url(/bgImg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      {/* Background Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(rgba(33, 33, 33, 0.84), rgba(66, 66, 66, 0.24))',
          zIndex: 1,
        }}
      />
      
      {/* Content Container */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Left Side - Text */}
        <Box
          sx={{
            flex: 1,
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 4,
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent:"center" }}>
            <HighBridgeIcon style={{height:"64px", width:"64px"}} />
            <Typography variant='h3'>HighBridge</Typography>
          </div>
          <Typography variant="h3" component="h1" gutterBottom style={{marginTop:"200px"}}> 
            Building the Future...
          </Typography>
          <Typography variant="body1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Typography>
        </Box>

        {/* Right Side - Login Form */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              width: '100%',
              maxWidth: 450,
              mx: 'auto',
            }}
          >
            <Typography variant="h6" gutterBottom>
              WELCOME BACK!
            </Typography>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Log in to your Account
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }} textAlign="left">
                  Email
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Type here..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 3 }}
                  disabled={loading}
                />

                <Typography variant="body2" sx={{ mb: 1 }} textAlign="left">
                  Password
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  placeholder="Type here..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 2 }}
                  disabled={loading}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        disabled={loading}
                      />
                    }
                    label="Remember me"
                  />
                  <Link href="#" underline="none" sx={{ color: 'text.secondary' }}>
                    Forgot Password?
                  </Link>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  size="large"
                  type="submit"
                  sx={{ mb: 2 }}
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </Button>

                <Box sx={{ textAlign: 'center', my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Or
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Box sx={{ width: '100%', mb: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<GoogleIcon />}
                      sx={{ textTransform: 'none' }}
                      disabled={loading}
                    >
                      Log in with Google
                    </Button>
                  </Box>
                  <Box sx={{ width: '100%', mb: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<FacebookIcon />}
                      sx={{ textTransform: 'none' }}
                      disabled={loading}
                    >
                      Log in with Facebook
                    </Button>
                  </Box>
                  <Box sx={{ width: '100%', mb: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<AppleIcon />}
                      sx={{ textTransform: 'none' }}
                      disabled={loading}
                    >
                      Log in with Apple
                    </Button>
                  </Box>
                </Grid>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2">
                    New User?{' '}
                    <RouterLink to="/signup" style={{ 
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      color: '#1B4B66'
                    }}>
                      SIGN UP HERE
                    </RouterLink>
                  </Typography>
                </Box>
              </Box>
            </form>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
