# MERN Stack Admin Dashboard

A comprehensive MERN stack admin dashboard application. This project features a fully responsive design, dynamic data visualization, and efficient state management using modern web development technologies.

## 🚀 Live Demo

notice: after 15min of inactivity on the website, reloading the website may take up to a minute or two.

- **Backend**: [MERN Admin Dashboard Backend](https://mern-admin-dashboard-backend-ola7.onrender.com/management/admins)
- **Frontend**: [MERN Admin Dashboard Frontend](https://mern-admin-dashboard-frontend-ob7l.onrender.com)

## 🛠️ Technologies Used

### Frontend
- **React**
- **Material UI**
- **Material UI Data Grid**
- **Nivo Charts**
- **Redux Toolkit**
- **Redux Toolkit Query**

### Backend
- **Node.js**
- **Express.js**
- **Mongoose**
- **MongoDB**

## 🌟 Features

- **Responsive Design**: Optimized for various screen sizes.
- **Material UI Components**: Modern UI components and layouts.
- **Dynamic Data Visualization**: Real-time charts and graphs with Nivo.
- **State Management**: Managed efficiently with Redux Toolkit and Redux Toolkit Query.
- **API Integration**: Backend powered by Node.js, Express, and MongoDB.

## 📂 Project Structure

```plaintext
.
├── client                 # Frontend code
│   ├── public             # Public files
│   ├── src                # Source files
│   │   ├── components     # Reusable components
│   │   ├── scenes         # Application pages and features
│   │   ├── state          # Redux slices and API
│   │   ├── App.js         # Main app component
│   │   ├── index.js       # Entry point
│   └── ...
├── server                 # Backend code
│   ├── controllers        # API controllers
│   ├── models             # Mongoose models
│   ├── routes             # API routes
│   ├── index.js           # Entry point
│   └── ...
├── .gitignore
├── README.md
└── package.json
``` 
## 🧑‍💻 Getting Started

### Prerequisites

- **Node.js**: [Download and install Node.js](https://nodejs.org/)
- **MongoDB**: [Install MongoDB](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud hosting.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ShaiShillo/MERN-Admin-Dashboard.git
   cd mern-admin-dashboard
   ```
   
 2. **Install dependencies:**
   - For the frontend:
     ```bash
     cd client
     npm install
     ```
   - For the backend:
     ```bash
     cd server
     npm install
     ```

3. **Set up environment variables:**
 Create a `.env` file in the `server` directory:
   ```plaintext
   MONGO_URL=your_mongodb_connection_string
   PORT=5000
  

4. **Run the application:**
   - Start the backend server:
     ```bash
     cd server
     npm run dev
     ```
   - Start the frontend:
     ```bash
     cd client
     npm start
     ```

   Access the application:
   - **Frontend**: `http://localhost:3000`
   - **Backend**: `http://localhost:5000`

## 📊 Data Modeling

Entity Relationship Diagrams (ERDs) were used to design data models. The project includes complex MongoDB aggregation queries for dynamic data retrieval.

## 🛠️ Available Scripts

In the project directory, you can run:

- **`npm start`**: Runs the app in development mode.
- **`npm run build`**: Builds the app for production.
- **`npm test`**: Runs the test suite.

## 🚀 Deployment

The project is deployed using [Render](https://render.com/). The backend and frontend are hosted separately.

