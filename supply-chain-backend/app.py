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
    companies_df = pd.read_csv('./data/companies.csv')
    logging.info("Loading locations.csv")
    locations_df = pd.read_csv('./data/locations.csv')
    logging.info("Data loaded successfully")
except FileNotFoundError as e:
    logging.error(f"File not found: {e}")
    companies_df = pd.DataFrame()
    locations_df = pd.DataFrame()
except pd.errors.EmptyDataError as e:
    logging.error(f"Empty data error: {e}")
    companies_df = pd.DataFrame()
    locations_df = pd.DataFrame()
except pd.errors.ParserError as e:
    logging.error(f"Parsing error: {e}")
    companies_df = pd.DataFrame()
    locations_df = pd.DataFrame()

@app.route("/companies", methods=['GET'])
def getCompaniesList():
    try:
        logging.info("Fetching list of companies")
        companies = companies_df.to_dict(orient='records')
        logging.info(f"Companies data fetched successfully")
        return jsonify(companies)
    except Exception as e:
        logging.error(f"Error fetching companies: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/companies/<company_id_param>", methods=['GET'])
def getCompanyById(company_id_param):
    try:
        logging.info(f"Fetching company by ID: {company_id_param}")
        company_id = int(company_id_param)
        companyWithLocations = locations_df[locations_df['company_id'] == company_id].to_dict(orient='records')
        if not companyWithLocations:
            logging.warning(f"Company with ID {company_id} not found")
            return jsonify({"error": "Company not found"}), 404
        logging.debug(f"Company with locations data: {companyWithLocations}")
        return jsonify(companyWithLocations)
    except ValueError:
        logging.error(f"Invalid company ID: {company_id_param}")
        return jsonify({"error": "Invalid company ID"}), 400
    except Exception as e:
        logging.error(f"Error fetching company by ID: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/companies/<company_id_param>/locations/<location_id_param>", methods=['GET'])
def getCompanyDetailsByLocationId(company_id_param, location_id_param):
    try:
        logging.info(f"Fetching location by company ID: {company_id_param} and location ID: {location_id_param}")
        company_id = int(company_id_param)
        location_id = int(location_id_param)
        companyWithLocation = locations_df[(locations_df['company_id'] == company_id) & (locations_df['location_id'] == location_id)].to_dict(orient='records')
        if not companyWithLocation:
            logging.warning(f"Company or location not found for company ID {company_id} and location ID {location_id}")
            return jsonify({"error": "Company or location not found"}), 404
        logging.debug(f"Company with location data fetched successfully!")
        return jsonify(companyWithLocation)
    except ValueError:
        logging.error(f"Invalid company or location ID: company ID {company_id_param}, location ID {location_id_param}")
        return jsonify({"error": "Invalid company or location ID"}), 400
    except Exception as e:
        logging.error(f"Error fetching location by company and location ID: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    logging.info("Starting Flask app")
    app.run(host='0.0.0.0', port=5001, debug=True)
