import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TextField, Table, TableHead, TableBody, TableRow, TableCell, Container, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { apiEndpoints, axiosConfig } from '../constants/config';

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCompanyList = async () => {
        try {
            const response = await axios.get(apiEndpoints.baseURL + 'companies', axiosConfig);
            setCompanies(response.data);
            setFilteredCompanies(response.data);
            setError('');  // Clear error if the request is successful
        } catch (error) {
            setError("There was an error fetching the companies!");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = companies.filter(company => company.name.toLowerCase().includes(query));
        setFilteredCompanies(filtered);
    };

    useEffect(() => {
        fetchCompanyList();
    }, []);

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
            <Container
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    flexWrap: 'overflow',
                    flexDirection: 'column',
                }}
            >
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '10px', flexWrap: 'overflow' }}>
            <TextField
                label="Search companies..."
                variant="filled"
                value={searchQuery}
                onChange={handleSearch}
                sx={{ marginBottom: 2, marginTop: 2, backgroundColor: 'white', width: '50%' }}
            />
            <Paper elevation={3} sx={{ width: '50%', margin: 'auto' }}>
                <Table>
                    <TableHead >
                        <TableRow >
                            <TableCell align="center">
                                <Typography variant="h5" sx={{fontWeight: 'bold'}}>List of Companies</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="center">
                        {filteredCompanies.map((company, index) => (
                            <motion.div
                                key={company.company_id}
                                initial={{ opacity: 0, transform: 'translateY(20px)' }}
                                animate={{ opacity: 1, transform: 'translateY(0px)' }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <TableRow>
                                    <TableCell align="center">
                                        <Link to={`/companies/${company.company_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <Typography variant="body1" sx={{ '&:hover': { color: 'primary.main', fontWeight: 'bold'},  }}>
                                                {company.name} <br />
                                                {company.address}
                                            </Typography>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            </motion.div>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};

export default CompanyList;
