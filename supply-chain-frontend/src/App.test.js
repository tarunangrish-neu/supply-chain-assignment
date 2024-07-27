import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

// Helper to render the App component with Router
const renderApp = () => {
    render(
        <Router>
            <App />
        </Router>
    );
};

describe('App Component', () => {
    test('renders LandingPage at root path', () => {
        renderApp();
        // Simulate visiting the root path
        window.history.pushState({}, 'Landing Page', '/');
        
        expect(screen.getByText(/Landing Page/i)).toBeInTheDocument();
    });

    test('renders CompanyList at /companies path', () => {
        renderApp();
        // Simulate visiting the /companies path
        window.history.pushState({}, 'Company List', '/companies');
        
        expect(screen.getByText(/Company List/i)).toBeInTheDocument();
    });

    test('renders CompanyDetails at /companies/:companyId path', () => {
        renderApp();
        // Simulate visiting the /companies/:companyId path
        window.history.pushState({}, 'Company Details', '/companies/1');
        
        expect(screen.getByText(/Company Details/i)).toBeInTheDocument();
    });

    test('renders 404 page for undefined paths', () => {
        renderApp();
        // Simulate visiting an undefined path
        window.history.pushState({}, 'Not Found', '/undefined-path');
        
        expect(screen.getByText(/404 Not Found/i)).toBeInTheDocument();
    });
});
