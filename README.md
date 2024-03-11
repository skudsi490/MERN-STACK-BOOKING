# TripAura - MERN Stack Booking Platform

Welcome to **TripAura**, a cutting-edge booking platform engineered with the MERN stack for a seamless accommodation booking experience. **TripAura** provides a user-friendly interface for users to effortlessly search, manage, and book accommodations.

## Key Features

- **User Authentication**: Secure sign-up and login functionality for users.
- **Hotel and Room Listings**: Explore a wide range of hotels and their available rooms.
- **Booking System**: Book accommodations based on real-time availability.

## Project Structure

The project is divided into two main directories: `api` for the backend and `client` for the frontend.

### Backend (`api`)

- **Controllers**: Contains logic for user, hotel, and room operations.
- **Models**: Mongoose schemas for User, Hotel, and Room.
- **Routes**: API endpoints for authentication, user, hotel, and room operations.
- **Utils**: Utility functions for error handling and token verification.

### Frontend (`client`)

- **Assets**: Static files like images and stylesheets.
- **Components**: Reusable React components.
- **Context**: React context for global state management.
- **Hooks**: Custom React hooks, including `useFetch` for data fetching.
- **Pages**: Different pages of the application, like Home, Hotel, List, and Login.

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Git

### Setup and Installation

1. **Clone the repository**
   git clone https://github.com/skudsi490/MERN-Booking-WebApp.git
   cd MERN-Booking-WebApp

1. **Backend setup**
   - cd api
   - npm install
   - npm start
1. **Ensure you have a .env file in the api directory with necessary environment variables**

   - MONGO=<your_mongo_cluster>
   - JWT=<your_jwt_key>

1. **Frontend setup**
   - Open a new terminal, navigate to the client directory, install dependencies, and start the React app:
   * cd client
   * npm install
   * npm run dev

- The app should now be running, with the frontend accessible at http://localhost:5173 and the backend at http://localhost:8800.

## Usage

After launching the app, you can:

- Register a new account or login.
- Browse through the list of hotels and rooms.
- Book a room of your choice.

## Built With

- **MongoDB** - Database
- **Express.js** - Backend framework
- **React** - Frontend library
- **Node.js** - Server environment
- **Vite** - Frontend build tool

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Sami Kudsi - skudsi490@gmail.com

Project Link: [https://github.com/skudsi490/MERN-Booking-WebApp](https://github.com/skudsi490/MERN-Booking-WebApp)
