# Travel-Tally 🧳🚖

[![Node.js](https://img.shields.io/badge/Node.js-Express-green)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)](https://www.mongodb.com)
[![Postman Docs](https://img.shields.io/badge/API-Postman-orange)](https://documenter.getpostman.com/view/16026763/2sB2j989gf#4f9c0cf9-1d83-44ab-ac1f-91be812b311b)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Travel-Tally** is a backend API application built with **Express.js** and **MongoDB** to manage a travel cab service system. It handles key operations such as cab management, driver assignments, trip bookings, and more.

## Features

- Cab and driver management
- Trip booking and scheduling
- Customer and admin APIs
- Real-time trip status updates
- Secure authentication and role-based access control

## Technologies Used

- **Node.js** with **Express.js**
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Postman** for API testing

## Installation

1. **Clone the repository**
   
   ```bash
   git clone https://github.com/your-username/travel-tally.git
   cd travel-tally

2. **Install dependencies**
   
   ```bash
   npm install

3. **Set up environment variables**
   Create a .env file in the root directory and add:
   ```bash
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/travel-tally
   JWT_SECRET=your_jwt_secret


5. **Start the application**
   
   ```bash
   npm run dev
  The server will start on: http://localhost:5000

## 📬 API Documentation

Explore the full API on Postman:

[🔗 Travel-Tally API Documentation](https://documenter.getpostman.com/view/16026763/2sB2j989gf#4f9c0cf9-1d83-44ab-ac1f-91be812b311b)

## Contributing

  1. Fork the repo
  2. Create a feature branch: ```git checkout -b feature-name```
  3. Commit your changes: ```git commit -m "Add new feature"```
  4. Push to the branch: ```git push origin feature-name```
  5. Create a pull request

