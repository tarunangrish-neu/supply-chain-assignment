import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography, Container, CircularProgress, Alert, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { apiEndpoints, axiosConfig } from '../constants/config';

function LocationDetails() {
    const { companyId, locationId } = useParams();
    const [location, setLocation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLocationDetails = async () => {
        try {
            const response = await axios.get(`${apiEndpoints.baseURL}companies/${companyId}/locations/${locationId}`, axiosConfig);
            setLocation(response.data);
            setError(null);  // Clear error if the request is successful
        } catch (error) {
            setError("There was an error fetching the location details!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocationDetails();
    }, [companyId, locationId]);

    if (loading) {
        return (
            <Container
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ marginTop: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!location || location.length === 0) {
        return (
            <Container sx={{ marginTop: 4 }}>
                <Alert severity="info">No location data available.</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{paddingBottom: '2rem'}}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {location.map(loc => (
                    <Card key={loc.location_id} sx={{ paddingBottom: '2rem', justifyContent: 'center'}}>
                        <CardContent>
                            <Typography variant="h4" component="h1" gutterBottom>
                                {loc.name}
                            </Typography>
                            <Typography variant="h6" component="h1">
                                Address: {loc.address}
                            </Typography>
                            <MapContainer
                                center={[loc.latitude, loc.longitude]}
                                zoom={13}
                                style={{ height: '500px', width: '100%', marginTop: '20px', }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <Marker
                                    icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}
                                    key={loc.location_id}
                                    position={[loc.latitude, loc.longitude]}
                                >
                                    <Popup>
                                        <Typography variant="h6">{loc.name}</Typography>
                                        <Typography variant="body2">{loc.address}</Typography>
                                        <Typography variant="body2">Latitude: {loc.latitude}</Typography>
                                        <Typography variant="body2">Longitude: {loc.longitude}</Typography>
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </CardContent>
                    </Card>
                ))}
            </motion.div>
        </Container>
    );
}

export default LocationDetails;
