/**
 * Rento - Data Management Module
 * Handles localStorage operations and initial data seeding
 */

// Data storage keys
const STORAGE_KEYS = {
    USERS: 'rento_users',
    HUBS: 'rento_hubs',
    VEHICLES: 'rento_vehicles',
    DRIVERS: 'rento_drivers',
    BOOKINGS: 'rento_bookings',
    CURRENT_USER: 'rento_current_user'
};

// Initial seed data
const SEED_DATA = {
    hubs: [
        {
            id: 1,
            name: 'Green Hub',
            location: 'Dhaka North',
            lat: 23.7806,
            lon: 90.4076,
            description: 'Eco-friendly hub with EV charging stations',
            fee: 5
        },
        {
            id: 2,
            name: 'Central Hub',
            location: 'Dhaka City',
            lat: 23.8103,
            lon: 90.4125,
            description: 'Main city center hub',
            fee: 3
        },
        {
            id: 3,
            name: 'South Hub',
            location: 'Dhaka South',
            lat: 23.7500,
            lon: 90.3900,
            description: 'Southern district hub',
            fee: 4
        }
    ],
    
    vehicles: [
        {
            id: 1,
            name: 'Nissan Leaf',
            type: 'car',
            fuelType: 'EV',
            seats: 4,
            pricePerHour: 10,
            hubs: [1, 2],
            image: 'car-ev-1',
            description: 'Compact electric vehicle with great efficiency'
        },
        {
            id: 2,
            name: 'MG ZS EV',
            type: 'suv',
            fuelType: 'EV',
            seats: 5,
            pricePerHour: 12,
            hubs: [1, 3],
            image: 'car-ev-2',
            description: 'Electric SUV with spacious interior'
        },
        {
            id: 3,
            name: 'Toyota Axio',
            type: 'car',
            fuelType: 'ICE',
            seats: 4,
            pricePerHour: 8,
            hubs: [2, 3],
            image: 'car-ice-1',
            description: 'Reliable gasoline sedan'
        },
        {
            id: 4,
            name: 'Honda Civic',
            type: 'car',
            fuelType: 'ICE',
            seats: 5,
            pricePerHour: 9,
            hubs: [1, 2, 3],
            image: 'car-ice-2',
            description: 'Popular sedan with great fuel economy'
        },
        {
            id: 5,
            name: 'Toyota HiAce',
            type: 'van',
            fuelType: 'ICE',
            seats: 8,
            pricePerHour: 20,
            hubs: [2],
            image: 'van-ice-1',
            description: 'Large van for group transport'
        },
        {
            id: 6,
            name: 'Electric Scooter',
            type: 'scooter',
            fuelType: 'EV',
            seats: 1,
            pricePerHour: 3,
            hubs: [1, 3],
            image: 'scooter-ev-1',
            description: 'Compact electric scooter for short trips'
        }
    ],
    
    drivers: [
        {
            id: 1,
            name: 'Mohammad Rahman',
            rating: 4.8,
            available: true,
            hourlyRate: 5,
            vehicleTypes: ['car', 'suv']
        },
        {
            id: 2,
            name: 'Anika Chowdhury',
            rating: 4.9,
            available: true,
            hourlyRate: 6,
            vehicleTypes: ['car', 'van']
        },
        {
            id: 3,
            name: 'Jamal Hossain',
            rating: 4.7,
            available: true,
            hourlyRate: 4,
            vehicleTypes: ['car', 'scooter']
        }
    ],
    
    users: [
        {
            id: 1,
            email: 'user@example.com',
            name: 'Demo User',
            age: 25,
            bookings: []
        }
    ]
};

/**
 * Initialize localStorage with seed data if empty
 */
function initializeData() {
    console.log('Initializing Rento data...');
    
    // Check if data exists, if not, seed it
    if (!localStorage.getItem(STORAGE_KEYS.HUBS)) {
        localStorage.setItem(STORAGE_KEYS.HUBS, JSON.stringify(SEED_DATA.hubs));
        console.log('Hubs seeded:', SEED_DATA.hubs.length);
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.VEHICLES)) {
        localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(SEED_DATA.vehicles));
        console.log('Vehicles seeded:', SEED_DATA.vehicles.length);
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.DRIVERS)) {
        localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(SEED_DATA.drivers));
        console.log('Drivers seeded:', SEED_DATA.drivers.length);
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_DATA.users));
        console.log('Users seeded:', SEED_DATA.users.length);
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
        console.log('Bookings initialized');
    }
}

/**
 * Get data from localStorage
 */
function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

/**
 * Save data to localStorage
 */
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`Data saved to ${key}:`, data);
}

/**
 * Get all hubs
 */
function getHubs() {
    return getData(STORAGE_KEYS.HUBS) || [];
}

/**
 * Get hub by ID
 */
function getHubById(id) {
    const hubs = getHubs();
    return hubs.find(hub => hub.id === parseInt(id));
}

/**
 * Get all vehicles
 */
function getVehicles() {
    return getData(STORAGE_KEYS.VEHICLES) || [];
}

/**
 * Get vehicle by ID
 */
function getVehicleById(id) {
    const vehicles = getVehicles();
    return vehicles.find(vehicle => vehicle.id === parseInt(id));
}

/**
 * Get available drivers
 */
function getAvailableDrivers(vehicleType = null) {
    const drivers = getData(STORAGE_KEYS.DRIVERS) || [];
    if (vehicleType) {
        return drivers.filter(driver => 
            driver.available && driver.vehicleTypes.includes(vehicleType)
        );
    }
    return drivers.filter(driver => driver.available);
}

/**
 * Get all bookings
 */
function getBookings() {
    return getData(STORAGE_KEYS.BOOKINGS) || [];
}

/**
 * Get bookings for current user
 */
function getUserBookings(userId) {
    const bookings = getBookings();
    return bookings.filter(booking => booking.userId === userId);
}

/**
 * Save a new booking
 */
function saveBooking(booking) {
    const bookings = getBookings();
    booking.id = bookings.length ? Math.max(...bookings.map(b => b.id)) + 1 : 1;
    booking.createdAt = new Date().toISOString();
    booking.status = 'confirmed';
    
    bookings.push(booking);
    saveData(STORAGE_KEYS.BOOKINGS, bookings);
    
    // Update driver availability if driver was assigned
    if (booking.driverId) {
        const drivers = getData(STORAGE_KEYS.DRIVERS);
        const driverIndex = drivers.findIndex(d => d.id === booking.driverId);
        if (driverIndex !== -1) {
            drivers[driverIndex].available = false;
            saveData(STORAGE_KEYS.DRIVERS, drivers);
        }
    }
    
    return booking;
}

/**
 * Cancel a booking
 */
function cancelBooking(bookingId) {
    const bookings = getBookings();
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex !== -1) {
        const booking = bookings[bookingIndex];
        booking.status = 'cancelled';
        
        // Make driver available again
        if (booking.driverId) {
            const drivers = getData(STORAGE_KEYS.DRIVERS);
            const driverIndex = drivers.findIndex(d => d.id === booking.driverId);
            if (driverIndex !== -1) {
                drivers[driverIndex].available = true;
                saveData(STORAGE_KEYS.DRIVERS, drivers);
            }
        }
        
        bookings[bookingIndex] = booking;
        saveData(STORAGE_KEYS.BOOKINGS, bookings);
        return true;
    }
    
    return false;
}

/**
 * Get current user
 */
function getCurrentUser() {
    const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!userId) return null;
    
    const users = getData(STORAGE_KEYS.USERS) || [];
    return users.find(user => user.id === parseInt(userId));
}

/**
 * Set current user
 */
function setCurrentUser(userId) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId.toString());
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
}

/**
 * Reset all data to initial seed
 */
function resetData() {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
    initializeData();
    console.log('All data reset to initial seed');
}

// Export functions for use in other modules
window.DataManager = {
    initializeData,
    getData,
    saveData,
    getHubs,
    getHubById,
    getVehicles,
    getVehicleById,
    getAvailableDrivers,
    getBookings,
    getUserBookings,
    saveBooking,
    cancelBooking,
    getCurrentUser,
    setCurrentUser,
    calculateDistance,
    resetData,
    STORAGE_KEYS,
    SEED_DATA
};