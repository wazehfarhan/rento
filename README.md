# Rento - Flexible Vehicle & Driver Rental

A responsive, accessible web application for vehicle and driver rental services using only HTML5, CSS3, and vanilla JavaScript.

## Features

### Core Features
1. **User Authentication**
   - Sign up with email, name, age, and password
   - Login/logout functionality
   - User roles (Admin, Driver, Regular User)
   - Protected routes based on authentication

2. **Vehicle Browsing & Filtering**
   - Browse available vehicles
   - Filter by fuel type (EV/ICE), vehicle type, and hub location
   - Sort by price/distance
   - Vehicle details modal

3. **Booking System**
   - Complete booking flow with hub-to-hub support
   - Driver toggle option
   - Age validation with automatic EV + driver requirement for under 18
   - Real-time price calculation
   - Booking history and cancellation

4. **User Dashboard**
   - View booking history
   - Cancel active bookings
   - User profile management
   - Account information

5. **Admin Dashboard**
   - CRUD operations for hubs, vehicles, and drivers
   - View all bookings and users
   - System statistics dashboard
   - Manage system data

6. **Driver Dashboard**
   - View assigned rides
   - Accept/reject ride requests
   - Earnings calculation

### Technical Features
- **Data Persistence**: Uses localStorage to persist all data
- **Responsive Design**: Mobile-first CSS with responsive breakpoints
- **Accessibility**: Semantic HTML, ARIA attributes, keyboard navigation
- **Modular JavaScript**: Clean separation of concerns
- **No External Dependencies**: Pure vanilla JavaScript

## Project Structure
```bash
    rento/
    ├── index.html # Main HTML file
    ├── styles/
    │ ├── variables.css # CSS variables and theme
    │ └── main.css # Main stylesheet
    ├── js/
    │ ├── data.js # Data management and localStorage
    │ ├── ui.js # UI rendering and management
    │ ├── booking.js # Booking functionality
    │ ├── admin.js # Admin interface
    │ ├── driver.js # Driver dashboard
    │ └── app.js # Application entry point
    └── README.md # This file
```

## Getting Started

### Running the Application

1. **Direct Browser Opening**
   - Simply open `index.html` in any modern web browser
   - No server required - it's a client-only application

2. **Using a Local Server** (Optional)
   ```bash
   # Using Python
   python -m http.server 8000
   # Then open http://localhost:8000
   
   # Using Node.js with http-server
   npx http-server


## Summary

The complete Rento application now includes:

1. **Full Authentication System**: Sign up, login, logout, user roles
2. **Enhanced Home Page**: Dynamic content based on login state, statistics section
3. **User Dropdown Menu**: Quick access to profile, bookings, and auth options
4. **Admin Dashboard**: Complete CRUD operations with statistics
5. **Protected Routes**: Role-based access control
6. **Complete Booking System**: Age validation, hub-to-hub, real-time pricing
7. **Responsive Design**: Mobile-first approach with accessibility features
8. **Data Persistence**: All data saved to localStorage
9. **Modular Code Structure**: Clean separation of concerns

The application is ready to run by simply opening `index.html` in a browser. All features work without any backend, using localStorage for data persistence.
