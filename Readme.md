# QuickDesk Help Desk Application

This repository contains the backend and frontend code for a simple help desk application.

## Prerequisites

To run this project, you need to have the following software installed:

- **Docker**: Used to run the MySQL database server
- **Node.js**: The JavaScript runtime environment for the backend and frontend

## Getting Started

Follow these steps to set up and run the project locally.

### Step 1: Start Docker and Clone the Project

1. **Start Docker Engine**: Ensure that your Docker Desktop or Docker service is running on your machine.

2. **Clone the Repository**: Clone this project to your local machine using Git.

```bash
git clone "https://github.com/asmitaagarwal4/odoo_hackathon.git"
```

### Step 2: Start the MySQL Database Server

Navigate to the project root and run the following Docker command to start a MySQL 8.0 container. This command sets up a container named `my-mysql-db`, a root password, a database named `database`, and maps the container's port to your local machine.

```bash
docker run --name my-mysql-db -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=database -p 3306:3306 -d mysql:8.0
```

### Step 3: Initialize the Database Schema

This project is set up to automatically create the necessary tables and populate initial data.

1. Navigate to the backend folder:

```bash
cd backend
```

2. Run the following command to execute the database initialization script:

```bash
npm run db
```

This script will connect to the MySQL container you started in Step 2 and set up all the required tables.

### Step 4: Run the Backend Server

With the database initialized, you can now start the backend server.

1. If you are not already in the backend folder, navigate there:

```bash
cd backend
```

2. Run the development server using this command:

```bash
npm run dev
```

The backend server will start and be accessible, typically on http://localhost:5000.

### Step 5: Configure Frontend Environment Variables

1. Navigate to the frontend folder:

```bash
cd ../frontend
```

2. Create a file named `.env.local` inside this folder and add the following environment variables:

> **Note**: The `JWT_SECRET` is required for authentication to work properly. The database configuration variables (`DB_*`) are also recommended for proper connection setup. The Cloudinary variables are optional but required if you want file attachment functionality to work in the application.

```env
APP_PORT=3000
DB_PORT=3306
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=database
JWT_SECRET=1234
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
```

### Step 6: Run the Frontend Application

Finally, start the frontend to interact with the backend.

1. Navigate to the frontend folder from your terminal:

```bash
cd frontend
```

2. Run the frontend development server:

```bash
npm run dev
```

The frontend application will start, usually accessible at http://localhost:3000 or a similar port. You can now use the application to register users, create tickets, and manage them.