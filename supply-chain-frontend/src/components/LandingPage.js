import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import Typewriter from 'typewriter-effect';
import Logo from '../images/logo.png';

const LandingPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: 'white',
        textAlign: 'center',
        padding: 3,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom sx={{fontWeight: 'bold'}}>
            Welcome to <br /> Supply Chain Data Hub
          </Typography>
          <Typography variant="h4" gutterBottom>
            What can you do?
          </Typography>
          <Box
            sx={{
              fontSize: '1.5rem',
              marginBottom: 2,
              color: '#066ebe'
            }}
          >
            <Typewriter
              options={{
                strings: ["View Registered Companies", "View Company Locations", "View Company Details"],
                speed: 480,
                autoStart: true,
                loop: true,
              }}
            />
          </Box>
          <Button
            variant="contained"
            size="large"
            sx={{backgroundColor: '#066ebe',
                color: 'white',
                borderColor: '066ebe',
                '&:hover': {
                    backgroundColor: 'white',
                    color: '#066ebe',
                    borderColor: '066ebe',
                },}}
            component={Link}
            to="/companies"
          >
            View Companies
          </Button>
          <Box
            sx={{
              marginTop: 4,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <img
              src={Logo}
              alt="Hero Logo"
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;