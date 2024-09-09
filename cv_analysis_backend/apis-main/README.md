# FBA-Backend Project

## Overview

This project provides a backend service for user authentication and CV analysis. It is built using Flask and integrates functionalities for user registration, login, and uploading CVs for analysis.

## Prerequisites

- Python 3.8+
- MongoDB
- pip (Python package installer)

## Setup Instructions


python -m venv venv
source venv/bin/activate # On Windows, use `venv\Scripts\activate`

Create .env file. Copy the required environment variables from env_example

THIS CODE AND THE WHOLE PLAY2EARN CODE REQUIRES JWT_SECRET_KEY.
PLEASE MAKE SURE TO HAVE JWT SECRET KEY SAME AS NODE JS's SECRET KEY.

3. Install Dependencies

pip install -r requirements.txt

4. run

flask run

