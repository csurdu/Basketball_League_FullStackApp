
# Basketball League Full-Stack Application

## Overview
The **Basketball League Full-Stack Application** is a comprehensive web-based platform for managing basketball teams, players, and games. This application allows users to create teams, manage player statistics, and simulate games with ease. It combines a robust front-end interface with a functional back-end to provide a seamless user experience.

## Features
- **Team Management**: Create, update, and manage basketball teams.
- **Player Statistics**: Add, view, and edit player stats.
- **Game Simulation**: Simulate basketball games and view results.
- **User-Friendly Interface**: Intuitive navigation with a responsive design.

## Tech Stack
### Frontend
The front-end of the application is built with **React.js**, a popular JavaScript library for building user interfaces. Key details:
- **React Components**: The application is structured using reusable React components like `Navbar`, `TeamCard`, and `PlayerCard`.
- **Routing**: Managed using `react-router-dom` to enable seamless navigation between pages (e.g., Teams, Player Stats, Simulate Game).
- **State Management**: Uses React's built-in `useState` and `useEffect` hooks for managing component states and lifecycle events.
- **Styling**: CSS and Bootstrap are utilized for responsive and modern UI designs.
- **Dynamic Rendering**: Ensures data fetched from the backend is displayed dynamically without page reloads.

### Backend
The back-end is powered by **Node.js** and **Express.js**, offering a robust and scalable API. Key details:
- **RESTful API**: Exposes endpoints for managing teams, players, and games (e.g., `/api/teams`, `/api/players`).
- **Database Integration**: Connected to a **MongoDB** database for storing and retrieving data.
- **Authentication & Security**:
  - Implements token-based authentication using **JWT (JSON Web Tokens)**.
  - Includes middleware for request validation and error handling.
- **Game Simulation Logic**: Contains business logic to simulate basketball games, calculate scores, and update player stats accordingly.
- **Environment Variables**: Uses `.env` for sensitive configurations like database credentials and server ports.

## Installation
Follow these steps to run the application locally:

### Prerequisites
- Node.js and npm installed on your system.
- MongoDB database running locally or on a server.

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd Basketball_League_FullStackApp-main
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Configure the environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     MONGO_URI=your_mongo_db_connection_string
     PORT=your_preferred_port_number
     ```

5. Start the server:
   ```bash
   npm start
   ```

6. Open the application in your browser:
   ```
   http://localhost:<your_port_number>
   ```

## File Structure
```
Basketball_League_FullStackApp/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── components/         # Reusable components (e.g., Navbar)
│   ├── pages/              # Application pages (e.g., Teams, PlayerStats)
│   ├── App.js              # Main React application file
│   └── index.js            # Entry point for React
├── server/
│   ├── controllers/        # Business logic for API endpoints
│   ├── models/             # Mongoose models for database schema
│   ├── routes/             # Express routes for API endpoints
│   ├── middleware/         # Middleware for authentication and validation
│   └── server.js           # Main server file
├── .env.example            # Example environment variables file
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```

## Usage
### Creating a Team
1. Navigate to the "Teams" page.
2. Click "Create Team" and fill out the required fields.
3. Save the team to view it in the list.

### Managing Player Stats
1. Open the "Player Stats" page.
2. Select a player to view or edit their statistics.
3. Save changes to update the database.

### Simulating Games
1. Go to the "Simulate Game" page.
2. Choose the teams for the match.
3. Start the simulation to view results.



[proiect_licenta_acs_Surdu_G_Cristian_147868 (1).pdf](https://github.com/user-attachments/files/17244404/proiect_licenta_acs_Surdu_G_Cristian_147868.1.pdf)
