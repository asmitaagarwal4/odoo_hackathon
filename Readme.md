QuickDesk Help Desk Application
This repository contains the backend and frontend code for a simple help desk application.

Prerequisites
To run this project, you need to have the following software installed:

Docker: Used to run the MySQL database server.

Node.js: The JavaScript runtime environment for the backend and frontend.

Getting Started
Follow these steps to set up and run the project locally.

Step 1: Start Docker and Clone the Project
Start Docker Engine: Ensure that your Docker Desktop or Docker service is running on your machine.

Clone the Repository: Clone this project to your local machine using Git.

git clone "https://github.com/asmitaagarwal4/odoo_hackathon.git"



Step 2: Start the MySQL Database Server
Navigate to the project root and run the following Docker command to start a MySQL 8.0 container. This command sets up a container named my-mysql-db, a root password, a database named database, and maps the container's port to your local machine.

docker run --name my-mysql-db -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=database -p 3306:3306 -d mysql:8.0



Step 3: Initialize the Database Schema
This project is set up to automatically create the necessary tables and populate initial data.

Navigate to the backend folder:

cd backend



Run the following command to execute the database initialization script:

npm run db



This script will connect to the MySQL container you started in Step 2 and set up all the required tables.

Step 4: Run the Backend Server
With the database initialized, you can now start the backend server.

If you are not already in the backend folder, navigate there:

# cd backend



Run the development server using this command:

# npm run dev



The backend server will start and be accessible, typically on http://localhost:5000.

## Step 5: Configure Frontend Environment Variables
 Navigate to the frontend folder:

# cd ../frontend



Create a file named .env.local inside this folder and add the following environment variables.

Note: Storing secrets like JWT_SECRET on the client-side is not a recommended security practice. These variables should be treated as public API keys.

JWT_SECRET= <YOUR_JWT_SECRET>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>



Step 6: Run the Frontend Application
Finally, start the frontend to interact with the backend.

Navigate to the frontend folder from your terminal:

cd frontend



Run the frontend development server:

# npm run dev



The frontend application will start, usually accessible at http://localhost:3000 or a similar port. You can now use the application to register users, create tickets, and manage them.