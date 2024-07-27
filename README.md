Sure, here's a comprehensive `README.md` file for your application:

---

# Supply-Chain Company

This is a full-stack web application that displays a list of companies and their details, including multiple possible locations. The application uses a Python backend API built with Flask and a React frontend. It is containerized using Docker.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Setup and Installation](#setup-and-installation)
4. [Running the Application](#running-the-application)
5. [API Endpoints](#api-endpoints)
6. [Frontend Features](#frontend-features)
7. [Detailed Code Explanation](#detailed-code-explanation)

## Project Structure

```
.
├── backend
│   ├── Dockerfile
│   ├── app.py
│   ├── data
│   │   ├── companies.csv
│   │   └── locations.csv
│   └── requirements.txt
├── frontend
│   ├── Dockerfile
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── App.js
│   │   ├── index.js
│   │   └── ...
│   ├── package.json
│   └── ...
└── docker-compose.yml
```

## Prerequisites

- Docker
- Docker Compose

## Setup and Installation

1. **Clone the repository**:

   ```sh
   git clone https://github.com/your-username/company-locator.git
   cd company-locator
   ```

2. **Ensure you have the necessary CSV files**:
   - `backend/data/companies.csv`
   - `backend/data/locations.csv`

## Running the Application

1. **Build and run the application** using Docker Compose:

   ```sh
   docker-compose up --build
   ```

2. **Access the frontend** at `http://localhost:3000`.

## API Endpoints

### Get all companies

**URL**: `/companies`  
**Method**: `GET`  
**Description**: Returns a list of all companies.

### Get company details by ID

**URL**: `/companies/<company_id_param>`  
**Method**: `GET`  
**Description**: Returns details and locations of a company by its ID.

### Get company location details by company ID and location ID

**URL**: `/companies/<company_id_param>/locations/<location_id_param>`  
**Method**: `GET`  
**Description**: Returns details of a specific location for a company.

## Frontend Features

1. **Company List Page**:
   - Displays a list or grid of companies fetched from the backend API.
   - Basic information shown: name, address.
   - Search/filter functionality to find companies by name.
   - Clicking on a company navigates to the Company Details Page.

2. **Company Details Page**:
   - Displays detailed information about the selected company.
   - Integrates a map component to show the company's main location.
   - Fetches and displays a list of possible locations for the company.
   - Creative and user-friendly way to visualize or interact with the locations data (e.g., interactive list, map with multiple markers, tabbed interface).
   - "Back to List" button to return to the Company List Page.

## Detailed Code Explanation

### Backend (`backend/app.py`)

```python
from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS
import logging

# Initialize the Flask application
app = Flask(__name__)
CORS(app, supports_credentials=True)  # Enable CORS with support for credentials

# Set up logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s %(levelname)s: %(message)s', handlers=[logging.StreamHandler()])

# Load data with error handling
try:
    logging.info("Loading companies.csv")
    companies_df = pd.read_csv('./data/companies.csv')  # Load companies data from CSV
    logging.info("Loading locations.csv")
    locations_df = pd.read_csv('./data/locations.csv')  # Load locations data from CSV
    logging.info("Data loaded successfully")
except FileNotFoundError as e:
    logging.error(f"File not found: {e}")
    companies_df = pd.DataFrame()  # Create an empty DataFrame if file not found
    locations_df = pd.DataFrame()  # Create an empty DataFrame if file not found
except pd.errors.EmptyDataError as e:
    logging.error(f"Empty data error: {e}")
    companies_df = pd.DataFrame()  # Create an empty DataFrame if data is empty
    locations_df = pd.DataFrame()  # Create an empty DataFrame if data is empty
except pd.errors.ParserError as e:
    logging.error(f"Parsing error: {e}")
    companies_df = pd.DataFrame()  # Create an empty DataFrame if parsing error occurs
    locations_df = pd.DataFrame()  # Create an empty DataFrame if parsing error occurs

# Define an endpoint to get the list of all companies
@app.route("/companies", methods=['GET'])
def getCompaniesList():
    try:
        logging.info("Fetching list of companies")
        companies = companies_df.to_dict(orient='records')  # Convert DataFrame to list of dictionaries
        logging.info("Companies data fetched successfully")
        return jsonify(companies)  # Return JSON response with companies data
    except Exception as e:
        logging.error(f"Error fetching companies: {e}")
        return jsonify({"error": str(e)}), 500  # Return error response if any exception occurs

# Define an endpoint to get details of a company by its ID
@app.route("/companies/<company_id_param>", methods=['GET'])
def getCompanyById(company_id_param):
    try:
        logging.info(f"Fetching company by ID: {company_id_param}")
        company_id = int(company_id_param)  # Convert company ID to integer
        companyWithLocations = locations_df[locations_df['company_id'] == company_id].to_dict(orient='records')
        if not companyWithLocations:
            logging.warning(f"Company with ID {company_id} not found")
            return jsonify({"error": "Company not found"}), 404  # Return 404 if company not found
        logging.debug(f"Company with locations data: {companyWithLocations}")
        return jsonify(companyWithLocations)  # Return JSON response with company details and locations
    except ValueError:
        logging.error(f"Invalid company ID: {company_id_param}")
        return jsonify({"error": "Invalid company ID"}), 400  # Return 400 if company ID is invalid
    except Exception as e:
        logging.error(f"Error fetching company by ID: {e}")
        return jsonify({"error": str(e)}), 500  # Return error response if any exception occurs

# Define an endpoint to get details of a location by company ID and location ID
@app.route("/companies/<company_id_param>/locations/<location_id_param>", methods=['GET'])
def getCompanyDetailsByLocationId(company_id_param, location_id_param):
    try:
        logging.info(f"Fetching location by company ID: {company_id_param} and location ID: {location_id_param}")
        company_id = int(company_id_param)  # Convert company ID to integer
        location_id = int(location_id_param)  # Convert location ID to integer
        companyWithLocation = locations_df[(locations_df['company_id'] == company_id) & (locations_df['location_id'] == location_id)].to_dict(orient='records')
        if not companyWithLocation:
            logging.warning(f"Company or location not found for company ID {company_id} and location ID {location_id}")
            return jsonify({"error": "Company or location not found"}), 404  # Return 404 if company or location not found
        logging.debug("Company with location data fetched successfully!")
        return jsonify(companyWithLocation)  # Return JSON response with location details
    except ValueError:
        logging.error(f"Invalid company or location ID: company ID {company_id_param}, location ID {location_id_param}")
        return jsonify({"error": "Invalid company or location ID"}), 400  # Return 400 if company or location ID is invalid
    except Exception as e:
        logging.error(f"Error fetching location by company and location ID: {e}")
        return jsonify({"error": str(e)}), 500  # Return error response if any exception occurs

if __name__ == '__main__':
    logging.info("Starting Flask app")
    app.run(host='0.0.0.0', port=5001, debug=True)  # Run the Flask app on all available IP addresses at port 5001
```

### Frontend

The frontend code is a typical React application. It has the following key components:

1. **Company List Page**:
   - Fetches the list of companies from the backend API.
   - Displays the companies in a list or grid format.
   - Provides a search or filter functionality to find companies by name.
   - Each company item is clickable and navigates to the Company Details Page.

2. **Company Details Page**:
   - Fetches detailed information about the selected company from the backend API.
   - Integrates a map component (using Leaflet or Google Maps React) to show the company's main location.
   - Displays a list of possible locations for the company.
   - Provides an interactive way to visualize the locations data.
   - Includes a "Back to List" button to return to the Company List Page.

### Docker and Docker Compose

#### Backend Dockerfile



```Dockerfile
# Use an official Python runtime as a parent image
FROM python:3.9

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5001 available to the world outside this container
EXPOSE 5001

# Define environment variable
ENV NAME World

# Run app.py when the container launches
CMD ["python", "app.py"]
```

#### Frontend Dockerfile

```Dockerfile
# Use the official node image as the base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Run the application
CMD ["npm", "start"]
```

## Conclusion

This application demonstrates a full-stack setup with Flask, React, and Docker. The backend provides a robust API for accessing company and location data, while the frontend offers a user-friendly interface for interacting with this data. Docker Compose simplifies the process of running and managing the application, ensuring a consistent and reproducible environment.

---