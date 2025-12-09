/**
 * Rento - UI Management Module
 * Handles view rendering, navigation, and UI updates
 */

class UIManager {
    constructor() {
        this.currentView = 'home';
        this.modalOpen = false;
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.renderView('home');
    }
    
    bindEvents() {
        // Navigation clicks
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('[data-view]');
            if (navLink) {
                e.preventDefault();
                const view = navLink.dataset.view;
                this.renderView(view);
                this.updateActiveNav(view);
                
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                navMenu.classList.remove('active');
            }
            
            // Menu toggle
            if (e.target.closest('.menu-toggle')) {
                const navMenu = document.querySelector('.nav-menu');
                navMenu.classList.toggle('active');
            }
            
            // Modal close
            if (e.target.closest('.modal-close') || 
                (e.target.id === 'vehicle-modal' && !e.target.closest('.modal-content'))) {
                this.closeModal();
            }
            
            // Toast close
            if (e.target.closest('.toast-close')) {
                this.hideToast();
            }
        });
        
        // Filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.filter-btn')) {
                const btn = e.target.closest('.filter-btn');
                const filterType = btn.dataset.filter;
                const value = btn.dataset.value;
                
                if (filterType && value) {
                    this.handleFilter(filterType, value, btn);
                }
            }
        });
    }
    
    renderView(view) {
        this.currentView = view;
        const contentArea = document.getElementById('app-content');
        
        switch(view) {
            case 'home':
                contentArea.innerHTML = this.renderHomeView();
                break;
            case 'browse':
                contentArea.innerHTML = this.renderBrowseView();
                this.renderVehicleGrid();
                break;
            case 'booking':
                contentArea.innerHTML = this.renderBookingView();
                this.setupBookingForm();
                break;
            case 'profile':
                contentArea.innerHTML = this.renderProfileView();
                this.renderUserBookings();
                break;
            case 'admin':
                contentArea.innerHTML = this.renderAdminView();
                this.setupAdminTabs();
                break;
            case 'driver':
                contentArea.innerHTML = this.renderDriverView();
                this.renderDriverAssignments();
                break;
            default:
                contentArea.innerHTML = this.renderHomeView();
        }
    }
    
    updateActiveNav(view) {
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.view === view) {
                link.classList.add('active');
            }
        });
    }
    
    renderHomeView() {
        return `
            <section class="home-view view">
                <div class="hero">
                    <h1>Flexible Vehicle & Driver Rental</h1>
                    <p>Experience the freedom of flexible mobility with our hub-to-hub rental service. Choose from EVs, traditional vehicles, or add a driver for complete convenience.</p>
                    <button class="btn" data-view="booking">Book Now</button>
                    <button class="btn btn-secondary" data-view="browse">Browse Vehicles</button>
                </div>
                
                <div class="features">
                    <div class="feature-card">
                        <i class="fas fa-map-marker-alt"></i>
                        <h3>Hub-to-Hub Service</h3>
                        <p>Pick up from one hub and drop off at another for ultimate flexibility in your travels.</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-leaf"></i>
                        <h3>EV Priority</h3>
                        <p>Choose from our growing fleet of electric vehicles to reduce your carbon footprint.</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-user-tie"></i>
                        <h3>Driver Option</h3>
                        <p>Add a professional driver to your rental for stress-free travel in unfamiliar areas.</p>
                    </div>
                </div>
                
                <div class="cta-section text-center mt-4">
                    <h2>Ready to Ride?</h2>
                    <p class="mb-3">Join thousands of satisfied customers who choose Rento for their mobility needs.</p>
                    <button class="btn" data-view="booking">Start Your Booking</button>
                </div>
            </section>
        `;
    }
    
    renderBrowseView() {
        const hubs = DataManager.getHubs();
        return `
            <section class="browse-view view">
                <h1>Browse Available Vehicles</h1>
                
                <div class="filters">
                    <div class="filter-group">
                        <span class="form-label">Filter by Fuel Type:</span>
                        <button class="filter-btn active" data-filter="fuelType" data-value="all">All</button>
                        <button class="filter-btn" data-filter="fuelType" data-value="EV">
                            <i class="fas fa-bolt"></i> Electric
                        </button>
                        <button class="filter-btn" data-filter="fuelType" data-value="ICE">
                            <i class="fas fa-gas-pump"></i> Gasoline
                        </button>
                    </div>
                    
                    <div class="filter-group">
                        <span class="form-label">Filter by Vehicle Type:</span>
                        <button class="filter-btn active" data-filter="type" data-value="all">All</button>
                        <button class="filter-btn" data-filter="type" data-value="car">Car</button>
                        <button class="filter-btn" data-filter="type" data-value="suv">SUV</button>
                        <button class="filter-btn" data-filter="type" data-value="van">Van</button>
                        <button class="filter-btn" data-filter="type" data-value="scooter">Scooter</button>
                    </div>
                    
                    <div class="filter-group">
                        <span class="form-label">Available at Hub:</span>
                        <select class="form-control" id="hub-filter">
                            <option value="all">All Hubs</option>
                            ${hubs.map(hub => `<option value="${hub.id}">${hub.name}</option>`).join('')}
                        </select>
                    </div>
                </div>
                
                <div id="vehicle-grid" class="vehicle-grid">
                    <!-- Vehicles will be rendered here -->
                </div>
            </section>
        `;
    }
    
    renderVehicleGrid(filters = {}) {
        const vehicles = DataManager.getVehicles();
        const hubs = DataManager.getHubs();
        const grid = document.getElementById('vehicle-grid');
        
        if (!grid) return;
        
        let filteredVehicles = [...vehicles];
        
        // Apply filters
        if (filters.fuelType && filters.fuelType !== 'all') {
            filteredVehicles = filteredVehicles.filter(v => v.fuelType === filters.fuelType);
        }
        
        if (filters.type && filters.type !== 'all') {
            filteredVehicles = filteredVehicles.filter(v => v.type === filters.type);
        }
        
        if (filters.hub && filters.hub !== 'all') {
            filteredVehicles = filteredVehicles.filter(v => v.hubs.includes(parseInt(filters.hub)));
        }
        
        if (filteredVehicles.length === 0) {
            grid.innerHTML = '<div class="text-center"><p>No vehicles match your filters.</p></div>';
            return;
        }
        
        grid.innerHTML = filteredVehicles.map(vehicle => {
            const availableHubs = vehicle.hubs.map(hubId => {
                const hub = hubs.find(h => h.id === hubId);
                return hub ? hub.name : 'Unknown';
            }).join(', ');
            
            return `
                <div class="vehicle-card" data-vehicle-id="${vehicle.id}">
                    <div class="vehicle-image">
                        <i class="fas fa-${vehicle.type === 'car' ? 'car' : vehicle.type === 'suv' ? 'truck' : vehicle.type === 'van' ? 'van' : 'motorcycle'}"></i>
                    </div>
                    <div class="vehicle-details">
                        <h3>${vehicle.name}</h3>
                        <span class="vehicle-type ${vehicle.fuelType.toLowerCase()}">
                            ${vehicle.fuelType}
                        </span>
                        <div class="price">$${vehicle.pricePerHour}<small>/hour</small></div>
                        <p><i class="fas fa-users"></i> ${vehicle.seats} seats</p>
                        <p><i class="fas fa-map-marker-alt"></i> Available at: ${availableHubs}</p>
                        <button class="btn view-details-btn" data-vehicle-id="${vehicle.id}">
                            View Details
                        </button>
                        <button class="btn btn-secondary" data-vehicle-id="${vehicle.id}" data-action="book">
                            Book Now
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Add event listeners to detail and book buttons
        grid.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const vehicleId = e.target.dataset.vehicleId;
                this.showVehicleDetails(vehicleId);
            });
        });
        
        grid.querySelectorAll('[data-action="book"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const vehicleId = e.target.dataset.vehicleId;
                this.renderView('booking');
                const vehicleSelect = document.getElementById('vehicle-select');
                if (vehicleSelect) {
                    vehicleSelect.value = vehicleId;
                    // Trigger change event to update form
                    vehicleSelect.dispatchEvent(new Event('change'));
                }
            });
        });
    }
    
    showVehicleDetails(vehicleId) {
        const vehicle = DataManager.getVehicleById(vehicleId);
        const hubs = DataManager.getHubs();
        
        if (!vehicle) return;
        
        const modalBody = document.getElementById('modal-body');
        const modal = document.getElementById('vehicle-modal');
        
        const availableHubs = vehicle.hubs.map(hubId => {
            const hub = hubs.find(h => h.id === hubId);
            return hub ? `<li><strong>${hub.name}</strong> - ${hub.location} (Fee: $${hub.fee})</li>` : '';
        }).join('');
        
        modalBody.innerHTML = `
            <h2 id="modal-title">${vehicle.name}</h2>
            <p id="modal-description">${vehicle.description}</p>
            
            <div class="vehicle-specs mb-3">
                <div class="spec-item">
                    <i class="fas fa-gas-pump"></i>
                    <span>Fuel Type: <strong>${vehicle.fuelType}</strong></span>
                </div>
                <div class="spec-item">
                    <i class="fas fa-users"></i>
                    <span>Seats: <strong>${vehicle.seats}</strong></span>
                </div>
                <div class="spec-item">
                    <i class="fas fa-car"></i>
                    <span>Type: <strong>${vehicle.type}</strong></span>
                </div>
                <div class="spec-item">
                    <i class="fas fa-dollar-sign"></i>
                    <span>Price: <strong>$${vehicle.pricePerHour}/hour</strong></span>
                </div>
            </div>
            
            <h3>Available at Hubs:</h3>
            <ul>${availableHubs}</ul>
            
            <div class="modal-actions mt-3">
                <button class="btn book-from-modal" data-vehicle-id="${vehicle.id}">
                    Book This Vehicle
                </button>
            </div>
        `;
        
        modal.style.display = 'flex';
        this.modalOpen = true;
        
        // Add event listener to book button in modal
        modalBody.querySelector('.book-from-modal').addEventListener('click', () => {
            this.closeModal();
            this.renderView('booking');
            const vehicleSelect = document.getElementById('vehicle-select');
            if (vehicleSelect) {
                vehicleSelect.value = vehicle.id;
                vehicleSelect.dispatchEvent(new Event('change'));
            }
        });
    }
    
    closeModal() {
        const modal = document.getElementById('vehicle-modal');
        modal.style.display = 'none';
        this.modalOpen = false;
    }
    
    handleFilter(filterType, value, button) {
        // Update button states
        const buttons = button.parentElement.querySelectorAll('.filter-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Collect all current filters
        const filters = {
            fuelType: document.querySelector('[data-filter="fuelType"].active')?.dataset.value || 'all',
            type: document.querySelector('[data-filter="type"].active')?.dataset.value || 'all',
            hub: document.getElementById('hub-filter')?.value || 'all'
        };
        
        // Render filtered grid
        this.renderVehicleGrid(filters);
    }
    
    renderBookingView() {
        const vehicles = DataManager.getVehicles();
        const hubs = DataManager.getHubs();
        
        return `
            <section class="booking-view view">
                <h1>Book Your Ride</h1>
                
                <form id="booking-form" class="booking-form">
                    <div class="form-section">
                        <h2>1. Vehicle & Hubs</h2>
                        
                        <div class="form-group">
                            <label for="vehicle-select" class="form-label">Select Vehicle</label>
                            <select id="vehicle-select" class="form-control" required>
                                <option value="">Choose a vehicle...</option>
                                ${vehicles.map(vehicle => 
                                    `<option value="${vehicle.id}">${vehicle.name} (${vehicle.fuelType}) - $${vehicle.pricePerHour}/hour</option>`
                                ).join('')}
                            </select>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="pickup-hub" class="form-label">Pick-up Hub</label>
                                <select id="pickup-hub" class="form-control" required>
                                    <option value="">Select hub...</option>
                                    ${hubs.map(hub => 
                                        `<option value="${hub.id}">${hub.name} - ${hub.location} (Fee: $${hub.fee})</option>`
                                    ).join('')}
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="dropoff-hub" class="form-label">Drop-off Hub</label>
                                <select id="dropoff-hub" class="form-control" required>
                                    <option value="">Select hub...</option>
                                    ${hubs.map(hub => 
                                        `<option value="${hub.id}">${hub.name} - ${hub.location} (Fee: $${hub.fee})</option>`
                                    ).join('')}
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h2>2. Date & Time</h2>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="pickup-date" class="form-label">Pick-up Date</label>
                                <input type="date" id="pickup-date" class="form-control" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="pickup-time" class="form-label">Pick-up Time</label>
                                <input type="time" id="pickup-time" class="form-control" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="dropoff-date" class="form-label">Drop-off Date</label>
                                <input type="date" id="dropoff-date" class="form-control" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="dropoff-time" class="form-label">Drop-off Time</label>
                                <input type="time" id="dropoff-time" class="form-control" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h2>3. Driver & Age Requirements</h2>
                        
                        <div class="form-group toggle-switch">
                            <label for="driver-toggle" class="form-label">Add Driver</label>
                            <label class="switch">
                                <input type="checkbox" id="driver-toggle">
                                <span class="slider"></span>
                            </label>
                            <span id="driver-status">No</span>
                        </div>
                        
                        <div id="driver-options" class="hidden">
                            <div class="form-group">
                                <label for="driver-select" class="form-label">Select Driver</label>
                                <select id="driver-select" class="form-control">
                                    <option value="">Choose a driver...</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="user-age" class="form-label">Your Age</label>
                            <input type="number" id="user-age" class="form-control" 
                                   min="16" max="100" required 
                                   placeholder="Enter your age">
                            <small class="form-text">Age verification is required for all bookings</small>
                        </div>
                        
                        <div id="age-warning" class="alert hidden">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>Under 18? You must select an EV and add a driver for safety and legal compliance.</span>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h2>4. Price Summary</h2>
                        
                        <div id="price-summary" class="price-summary">
                            <div class="price-item">
                                <span>Vehicle Rental:</span>
                                <span id="vehicle-price">$0</span>
                            </div>
                            <div class="price-item">
                                <span>Driver Service:</span>
                                <span id="driver-price">$0</span>
                            </div>
                            <div class="price-item">
                                <span>Hub Fees:</span>
                                <span id="hub-fees">$0</span>
                            </div>
                            <div class="price-item total">
                                <strong>Total:</strong>
                                <strong id="total-price">$0</strong>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn" id="submit-booking">
                            Confirm Booking
                        </button>
                    </div>
                </form>
            </section>
        `;
    }
    
    setupBookingForm() {
        const form = document.getElementById('booking-form');
        if (!form) return;
        
        // Initialize with current date
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('pickup-date').min = today;
        document.getElementById('dropoff-date').min = today;
        
        // Update price summary on changes
        const updateFields = [
            'vehicle-select',
            'pickup-hub',
            'dropoff-hub',
            'driver-toggle',
            'driver-select',
            'pickup-date',
            'pickup-time',
            'dropoff-date',
            'dropoff-time'
        ];
        
        updateFields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.addEventListener('change', () => this.updatePriceSummary());
            }
        });
        
        // Age validation
        const ageInput = document.getElementById('user-age');
        ageInput.addEventListener('input', (e) => this.handleAgeChange(e.target.value));
        
        // Driver toggle
        const driverToggle = document.getElementById('driver-toggle');
        driverToggle.addEventListener('change', (e) => this.handleDriverToggle(e.target.checked));
        
        // Vehicle change - update available hubs
        const vehicleSelect = document.getElementById('vehicle-select');
        vehicleSelect.addEventListener('change', (e) => this.updateAvailableHubs(e.target.value));
        
        // Form submission
        form.addEventListener('submit', (e) => this.handleBookingSubmit(e));
        
        // Initial price update
        this.updatePriceSummary();
    }
    
    handleAgeChange(age) {
        const ageWarning = document.getElementById('age-warning');
        const vehicleSelect = document.getElementById('vehicle-select');
        const driverToggle = document.getElementById('driver-toggle');
        
        if (age && parseInt(age) < 18) {
            ageWarning.classList.remove('hidden');
            
            // Enforce EV + driver requirement
            driverToggle.checked = true;
            driverToggle.dispatchEvent(new Event('change'));
            driverToggle.disabled = true;
            
            // Filter vehicles to show only EVs
            const vehicles = DataManager.getVehicles();
            const evVehicles = vehicles.filter(v => v.fuelType === 'EV');
            
            // Update vehicle select options
            vehicleSelect.innerHTML = `
                <option value="">Choose an EV...</option>
                ${evVehicles.map(vehicle => 
                    `<option value="${vehicle.id}">${vehicle.name} (EV) - $${vehicle.pricePerHour}/hour</option>`
                ).join('')}
            `;
            
            this.showToast('Under 18 booking: EV and driver are required for safety and legal compliance.', 'warning');
        } else {
            ageWarning.classList.add('hidden');
            
            // Re-enable driver toggle
            driverToggle.disabled = false;
            
            // Reset vehicle options
            const vehicles = DataManager.getVehicles();
            vehicleSelect.innerHTML = `
                <option value="">Choose a vehicle...</option>
                ${vehicles.map(vehicle => 
                    `<option value="${vehicle.id}">${vehicle.name} (${vehicle.fuelType}) - $${vehicle.pricePerHour}/hour</option>`
                ).join('')}
            `;
        }
        
        this.updatePriceSummary();
    }
    
    handleDriverToggle(hasDriver) {
        const driverOptions = document.getElementById('driver-options');
        const driverStatus = document.getElementById('driver-status');
        const driverSelect = document.getElementById('driver-select');
        
        if (hasDriver) {
            driverOptions.classList.remove('hidden');
            driverStatus.textContent = 'Yes';
            
            // Load available drivers
            const vehicleSelect = document.getElementById('vehicle-select');
            const vehicle = DataManager.getVehicleById(vehicleSelect.value);
            
            if (vehicle) {
                const drivers = DataManager.getAvailableDrivers(vehicle.type);
                driverSelect.innerHTML = `
                    <option value="">Choose a driver...</option>
                    ${drivers.map(driver => 
                        `<option value="${driver.id}" data-rate="${driver.hourlyRate}">
                            ${driver.name} ($${driver.hourlyRate}/hour) ⭐${driver.rating}
                        </option>`
                    ).join('')}
                `;
            }
        } else {
            driverOptions.classList.add('hidden');
            driverStatus.textContent = 'No';
            driverSelect.innerHTML = '<option value="">Choose a driver...</option>';
        }
        
        this.updatePriceSummary();
    }
    
    updateAvailableHubs(vehicleId) {
        const vehicle = DataManager.getVehicleById(vehicleId);
        if (!vehicle) return;
        
        const pickupSelect = document.getElementById('pickup-hub');
        const dropoffSelect = document.getElementById('dropoff-hub');
        
        // Filter options to show only hubs where vehicle is available
        [pickupSelect, dropoffSelect].forEach(select => {
            Array.from(select.options).forEach(option => {
                if (option.value) {
                    const isAvailable = vehicle.hubs.includes(parseInt(option.value));
                    option.disabled = !isAvailable;
                    if (select.value === option.value && !isAvailable) {
                        select.value = '';
                    }
                }
            });
        });
        
        this.updatePriceSummary();
    }
    
    updatePriceSummary() {
        const vehicleId = document.getElementById('vehicle-select')?.value;
        const pickupHubId = document.getElementById('pickup-hub')?.value;
        const dropoffHubId = document.getElementById('dropoff-hub')?.value;
        const hasDriver = document.getElementById('driver-toggle')?.checked;
        const driverId = document.getElementById('driver-select')?.value;
        const pickupDate = document.getElementById('pickup-date')?.value;
        const pickupTime = document.getElementById('pickup-time')?.value;
        const dropoffDate = document.getElementById('dropoff-date')?.value;
        const dropoffTime = document.getElementById('dropoff-time')?.value;
        
        let total = 0;
        let rentalCost = 0;
        let driverCost = 0;
        let hubFees = 0;
        
        // Calculate rental duration in hours
        if (pickupDate && pickupTime && dropoffDate && dropoffTime) {
            const pickup = new Date(`${pickupDate}T${pickupTime}`);
            const dropoff = new Date(`${dropoffDate}T${dropoffTime}`);
            const durationHours = Math.max(1, Math.ceil((dropoff - pickup) / (1000 * 60 * 60)));
            
            // Vehicle cost
            if (vehicleId) {
                const vehicle = DataManager.getVehicleById(vehicleId);
                if (vehicle) {
                    rentalCost = vehicle.pricePerHour * durationHours;
                }
            }
            
            // Driver cost
            if (hasDriver && driverId) {
                const driverSelect = document.getElementById('driver-select');
                const selectedOption = driverSelect.querySelector(`option[value="${driverId}"]`);
                if (selectedOption) {
                    const hourlyRate = parseFloat(selectedOption.dataset.rate);
                    driverCost = hourlyRate * durationHours;
                }
            }
            
            // Hub fees
            if (pickupHubId) {
                const pickupHub = DataManager.getHubById(pickupHubId);
                if (pickupHub) hubFees += pickupHub.fee;
            }
            
            if (dropoffHubId && dropoffHubId !== pickupHubId) {
                const dropoffHub = DataManager.getHubById(dropoffHubId);
                if (dropoffHub) hubFees += dropoffHub.fee;
            }
        }
        
        total = rentalCost + driverCost + hubFees;
        
        // Update display
        document.getElementById('vehicle-price').textContent = `$${rentalCost.toFixed(2)}`;
        document.getElementById('driver-price').textContent = `$${driverCost.toFixed(2)}`;
        document.getElementById('hub-fees').textContent = `$${hubFees.toFixed(2)}`;
        document.getElementById('total-price').textContent = `$${total.toFixed(2)}`;
    }
    
    async handleBookingSubmit(e) {
        e.preventDefault();
        
        const user = DataManager.getCurrentUser();
        if (!user) {
            this.showToast('Please log in to make a booking', 'error');
            return;
        }
        
        // Collect form data
        const formData = {
            userId: user.id,
            vehicleId: parseInt(document.getElementById('vehicle-select').value),
            pickupHubId: parseInt(document.getElementById('pickup-hub').value),
            dropoffHubId: parseInt(document.getElementById('dropoff-hub').value),
            pickupDate: document.getElementById('pickup-date').value,
            pickupTime: document.getElementById('pickup-time').value,
            dropoffDate: document.getElementById('dropoff-date').value,
            dropoffTime: document.getElementById('dropoff-time').value,
            userAge: parseInt(document.getElementById('user-age').value),
            hasDriver: document.getElementById('driver-toggle').checked,
            driverId: document.getElementById('driver-select').value ? 
                     parseInt(document.getElementById('driver-select').value) : null,
            totalPrice: parseFloat(document.getElementById('total-price').textContent.replace('$', ''))
        };
        
        // Validation
        if (formData.userAge < 18) {
            const vehicle = DataManager.getVehicleById(formData.vehicleId);
            if (vehicle.fuelType !== 'EV' || !formData.hasDriver) {
                this.showToast('Under 18 bookings require EV and driver', 'error');
                return;
            }
        }
        
        // Save booking
        const booking = DataManager.saveBooking(formData);
        
        // Show confirmation
        this.showToast(`Booking confirmed! Booking ID: ${booking.id}`, 'success');
        
        // Reset form
        setTimeout(() => {
            this.renderView('profile');
        }, 2000);
    }
    
    renderProfileView() {
        const user = DataManager.getCurrentUser();
        if (!user) {
            return `
                <section class="profile-view view">
                    <h1>Profile</h1>
                    <div class="alert">
                        <p>Please log in to view your profile and bookings.</p>
                        <button class="btn" onclick="UIManager.showLoginModal()">Log In</button>
                    </div>
                </section>
            `;
        }
        
        return `
            <section class="profile-view view">
                <h1>Welcome, ${user.name}</h1>
                
                <div class="user-info card mb-4">
                    <h2>Your Information</h2>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Age:</strong> ${user.age} years</p>
                </div>
                
                <div class="booking-history">
                    <h2>Booking History</h2>
                    <div id="bookings-list">
                        <!-- Bookings will be loaded here -->
                    </div>
                </div>
            </section>
        `;
    }
    
    renderUserBookings() {
        const user = DataManager.getCurrentUser();
        if (!user) return;
        
        const bookings = DataManager.getUserBookings(user.id);
        const container = document.getElementById('bookings-list');
        
        if (!container) return;
        
        if (bookings.length === 0) {
            container.innerHTML = '<p>No bookings yet. <a href="#" data-view="booking">Book your first ride!</a></p>';
            return;
        }
        
        container.innerHTML = bookings.map(booking => {
            const vehicle = DataManager.getVehicleById(booking.vehicleId);
            const pickupHub = DataManager.getHubById(booking.pickupHubId);
            const dropoffHub = DataManager.getHubById(booking.dropoffHubId);
            const driver = booking.driverId ? 
                DataManager.getData(DataManager.STORAGE_KEYS.DRIVERS).find(d => d.id === booking.driverId) : null;
            
            return `
                <div class="booking-card card ${booking.status}">
                    <div class="booking-header">
                        <h3>${vehicle?.name || 'Unknown Vehicle'}</h3>
                        <span class="booking-status">${booking.status}</span>
                    </div>
                    <div class="booking-details">
                        <p><strong>Booking ID:</strong> ${booking.id}</p>
                        <p><strong>Pick-up:</strong> ${pickupHub?.name} on ${booking.pickupDate} at ${booking.pickupTime}</p>
                        <p><strong>Drop-off:</strong> ${dropoffHub?.name} on ${booking.dropoffDate} at ${booking.dropoffTime}</p>
                        <p><strong>Driver:</strong> ${driver ? driver.name : 'No driver'}</p>
                        <p><strong>Total:</strong> $${booking.totalPrice}</p>
                        <p><strong>Booked on:</strong> ${new Date(booking.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div class="booking-actions">
                        ${booking.status === 'confirmed' ? 
                            `<button class="btn btn-danger" onclick="UIManager.cancelBooking(${booking.id})">
                                Cancel Booking
                            </button>` : ''
                        }
                    </div>
                </div>
            `;
        }).join('');
    }
    
    cancelBooking(bookingId) {
        if (confirm('Are you sure you want to cancel this booking?')) {
            const success = DataManager.cancelBooking(bookingId);
            if (success) {
                this.showToast('Booking cancelled successfully', 'success');
                this.renderUserBookings();
            } else {
                this.showToast('Failed to cancel booking', 'error');
            }
        }
    }
    
    renderAdminView() {
        return `
            <section class="admin-view view">
                <h1>Admin Dashboard</h1>
                
                <div class="admin-tabs">
                    <button class="tab-btn active" data-tab="hubs">Hubs</button>
                    <button class="tab-btn" data-tab="vehicles">Vehicles</button>
                    <button class="tab-btn" data-tab="drivers">Drivers</button>
                    <button class="tab-btn" data-tab="bookings">Bookings</button>
                </div>
                
                <div class="tab-content">
                    <div id="hubs-tab" class="tab-pane active">
                        <div class="admin-header">
                            <h2>Manage Hubs</h2>
                            <button class="btn" onclick="UIManager.showHubForm()">
                                <i class="fas fa-plus"></i> Add Hub
                            </button>
                        </div>
                        <div id="hubs-list"></div>
                    </div>
                    
                    <div id="vehicles-tab" class="tab-pane">
                        <div class="admin-header">
                            <h2>Manage Vehicles</h2>
                            <button class="btn" onclick="UIManager.showVehicleForm()">
                                <i class="fas fa-plus"></i> Add Vehicle
                            </button>
                        </div>
                        <div id="vehicles-list"></div>
                    </div>
                    
                    <div id="drivers-tab" class="tab-pane">
                        <div class="admin-header">
                            <h2>Manage Drivers</h2>
                            <button class="btn" onclick="UIManager.showDriverForm()">
                                <i class="fas fa-plus"></i> Add Driver
                            </button>
                        </div>
                        <div id="drivers-list"></div>
                    </div>
                    
                    <div id="bookings-tab" class="tab-pane">
                        <h2>All Bookings</h2>
                        <div id="all-bookings-list"></div>
                    </div>
                </div>
                
                <!-- Forms will be loaded here dynamically -->
                <div id="admin-forms"></div>
            </section>
        `;
    }
    
    setupAdminTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Show corresponding tab pane
                tabPanes.forEach(pane => pane.classList.remove('active'));
                document.getElementById(`${tab}-tab`).classList.add('active');
                
                // Load tab data
                this.loadAdminTabData(tab);
            });
        });
        
        // Load initial tab data
        this.loadAdminTabData('hubs');
    }
    
    loadAdminTabData(tab) {
        switch(tab) {
            case 'hubs':
                this.renderHubsList();
                break;
            case 'vehicles':
                this.renderVehiclesList();
                break;
            case 'drivers':
                this.renderDriversList();
                break;
            case 'bookings':
                this.renderAllBookings();
                break;
        }
    }
    
    renderHubsList() {
        const hubs = DataManager.getHubs();
        const container = document.getElementById('hubs-list');
        
        if (!container) return;
        
        if (hubs.length === 0) {
            container.innerHTML = '<p>No hubs found.</p>';
            return;
        }
        
        container.innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Coordinates</th>
                            <th>Fee</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${hubs.map(hub => `
                            <tr>
                                <td>${hub.id}</td>
                                <td>${hub.name}</td>
                                <td>${hub.location}</td>
                                <td>${hub.lat.toFixed(4)}, ${hub.lon.toFixed(4)}</td>
                                <td>$${hub.fee}</td>
                                <td>
                                    <button class="btn btn-sm" onclick="UIManager.editHub(${hub.id})">
                                        Edit
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="UIManager.deleteHub(${hub.id})">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    renderVehiclesList() {
        const vehicles = DataManager.getVehicles();
        const container = document.getElementById('vehicles-list');
        
        if (!container) return;
        
        if (vehicles.length === 0) {
            container.innerHTML = '<p>No vehicles found.</p>';
            return;
        }
        
        container.innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Fuel</th>
                            <th>Seats</th>
                            <th>Price/Hour</th>
                            <th>Available Hubs</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${vehicles.map(vehicle => `
                            <tr>
                                <td>${vehicle.id}</td>
                                <td>${vehicle.name}</td>
                                <td>${vehicle.type}</td>
                                <td><span class="vehicle-type ${vehicle.fuelType.toLowerCase()}">${vehicle.fuelType}</span></td>
                                <td>${vehicle.seats}</td>
                                <td>$${vehicle.pricePerHour}</td>
                                <td>${vehicle.hubs.join(', ')}</td>
                                <td>
                                    <button class="btn btn-sm" onclick="UIManager.editVehicle(${vehicle.id})">
                                        Edit
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="UIManager.deleteVehicle(${vehicle.id})">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    renderDriversList() {
        const drivers = DataManager.getData(DataManager.STORAGE_KEYS.DRIVERS) || [];
        const container = document.getElementById('drivers-list');
        
        if (!container) return;
        
        if (drivers.length === 0) {
            container.innerHTML = '<p>No drivers found.</p>';
            return;
        }
        
        container.innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Rating</th>
                            <th>Hourly Rate</th>
                            <th>Available</th>
                            <th>Vehicle Types</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${drivers.map(driver => `
                            <tr>
                                <td>${driver.id}</td>
                                <td>${driver.name}</td>
                                <td>${driver.rating} ⭐</td>
                                <td>$${driver.hourlyRate}</td>
                                <td><span class="status ${driver.available ? 'available' : 'busy'}">
                                    ${driver.available ? 'Available' : 'Busy'}
                                </span></td>
                                <td>${driver.vehicleTypes.join(', ')}</td>
                                <td>
                                    <button class="btn btn-sm" onclick="UIManager.editDriver(${driver.id})">
                                        Edit
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="UIManager.deleteDriver(${driver.id})">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    renderAllBookings() {
        const bookings = DataManager.getBookings();
        const container = document.getElementById('all-bookings-list');
        
        if (!container) return;
        
        if (bookings.length === 0) {
            container.innerHTML = '<p>No bookings found.</p>';
            return;
        }
        
        container.innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User ID</th>
                            <th>Vehicle</th>
                            <th>Pick-up</th>
                            <th>Drop-off</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bookings.map(booking => {
                            const vehicle = DataManager.getVehicleById(booking.vehicleId);
                            return `
                                <tr>
                                    <td>${booking.id}</td>
                                    <td>${booking.userId}</td>
                                    <td>${vehicle?.name || 'Unknown'}</td>
                                    <td>${booking.pickupDate}</td>
                                    <td>${booking.dropoffDate}</td>
                                    <td>$${booking.totalPrice}</td>
                                    <td><span class="status ${booking.status}">${booking.status}</span></td>
                                    <td>${new Date(booking.createdAt).toLocaleDateString()}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    showHubForm(hub = null) {
        const formsContainer = document.getElementById('admin-forms');
        const isEdit = !!hub;
        
        formsContainer.innerHTML = `
            <div class="modal" id="hub-form-modal" style="display: flex;">
                <div class="modal-content">
                    <button class="modal-close" onclick="UIManager.closeAdminForm()">
                        <i class="fas fa-times"></i>
                    </button>
                    <h2>${isEdit ? 'Edit Hub' : 'Add New Hub'}</h2>
                    <form id="hub-form">
                        <input type="hidden" id="hub-id" value="${hub?.id || ''}">
                        
                        <div class="form-group">
                            <label for="hub-name" class="form-label">Hub Name</label>
                            <input type="text" id="hub-name" class="form-control" 
                                   value="${hub?.name || ''}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="hub-location" class="form-label">Location</label>
                            <input type="text" id="hub-location" class="form-control" 
                                   value="${hub?.location || ''}" required>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="hub-lat" class="form-label">Latitude</label>
                                <input type="number" step="0.0001" id="hub-lat" class="form-control" 
                                       value="${hub?.lat || ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="hub-lon" class="form-label">Longitude</label>
                                <input type="number" step="0.0001" id="hub-lon" class="form-control" 
                                       value="${hub?.lon || ''}" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="hub-fee" class="form-label">Hub Fee ($)</label>
                            <input type="number" step="0.01" id="hub-fee" class="form-control" 
                                   value="${hub?.fee || ''}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="hub-description" class="form-label">Description</label>
                            <textarea id="hub-description" class="form-control" rows="3">${hub?.description || ''}</textarea>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn">
                                ${isEdit ? 'Update Hub' : 'Add Hub'}
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="UIManager.closeAdminForm()">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.getElementById('hub-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveHub();
        });
    }
    
    saveHub() {
        const id = document.getElementById('hub-id').value;
        const hubs = DataManager.getHubs();
        
        const hubData = {
            id: id ? parseInt(id) : hubs.length ? Math.max(...hubs.map(h => h.id)) + 1 : 1,
            name: document.getElementById('hub-name').value,
            location: document.getElementById('hub-location').value,
            lat: parseFloat(document.getElementById('hub-lat').value),
            lon: parseFloat(document.getElementById('hub-lon').value),
            fee: parseFloat(document.getElementById('hub-fee').value),
            description: document.getElementById('hub-description').value
        };
        
        if (id) {
            // Update existing hub
            const index = hubs.findIndex(h => h.id === parseInt(id));
            hubs[index] = hubData;
        } else {
            // Add new hub
            hubs.push(hubData);
        }
        
        DataManager.saveData(DataManager.STORAGE_KEYS.HUBS, hubs);
        this.closeAdminForm();
        this.renderHubsList();
        this.showToast(`Hub ${id ? 'updated' : 'added'} successfully`, 'success');
    }
    
    editHub(id) {
        const hubs = DataManager.getHubs();
        const hub = hubs.find(h => h.id === id);
        if (hub) {
            this.showHubForm(hub);
        }
    }
    
    deleteHub(id) {
        if (confirm('Are you sure you want to delete this hub?')) {
            const hubs = DataManager.getHubs();
            const filteredHubs = hubs.filter(h => h.id !== id);
            DataManager.saveData(DataManager.STORAGE_KEYS.HUBS, filteredHubs);
            this.renderHubsList();
            this.showToast('Hub deleted successfully', 'success');
        }
    }
    
    showVehicleForm(vehicle = null) {
        const formsContainer = document.getElementById('admin-forms');
        const isEdit = !!vehicle;
        const hubs = DataManager.getHubs();
        
        formsContainer.innerHTML = `
            <div class="modal" id="vehicle-form-modal" style="display: flex;">
                <div class="modal-content">
                    <button class="modal-close" onclick="UIManager.closeAdminForm()">
                        <i class="fas fa-times"></i>
                    </button>
                    <h2>${isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
                    <form id="vehicle-form">
                        <input type="hidden" id="vehicle-id" value="${vehicle?.id || ''}">
                        
                        <div class="form-group">
                            <label for="vehicle-name" class="form-label">Vehicle Name</label>
                            <input type="text" id="vehicle-name" class="form-control" 
                                   value="${vehicle?.name || ''}" required>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="vehicle-type" class="form-label">Type</label>
                                <select id="vehicle-type" class="form-control" required>
                                    <option value="car" ${vehicle?.type === 'car' ? 'selected' : ''}>Car</option>
                                    <option value="suv" ${vehicle?.type === 'suv' ? 'selected' : ''}>SUV</option>
                                    <option value="van" ${vehicle?.type === 'van' ? 'selected' : ''}>Van</option>
                                    <option value="scooter" ${vehicle?.type === 'scooter' ? 'selected' : ''}>Scooter</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="vehicle-fuel" class="form-label">Fuel Type</label>
                                <select id="vehicle-fuel" class="form-control" required>
                                    <option value="EV" ${vehicle?.fuelType === 'EV' ? 'selected' : ''}>Electric (EV)</option>
                                    <option value="ICE" ${vehicle?.fuelType === 'ICE' ? 'selected' : ''}>Gasoline (ICE)</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="vehicle-seats" class="form-label">Seats</label>
                                <input type="number" id="vehicle-seats" class="form-control" 
                                       value="${vehicle?.seats || ''}" min="1" required>
                            </div>
                            <div class="form-group">
                                <label for="vehicle-price" class="form-label">Price per Hour ($)</label>
                                <input type="number" step="0.01" id="vehicle-price" class="form-control" 
                                       value="${vehicle?.pricePerHour || ''}" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="vehicle-hubs" class="form-label">Available at Hubs</label>
                            <select id="vehicle-hubs" class="form-control" multiple>
                                ${hubs.map(hub => `
                                    <option value="${hub.id}" 
                                        ${vehicle?.hubs?.includes(hub.id) ? 'selected' : ''}>
                                        ${hub.name}
                                    </option>
                                `).join('')}
                            </select>
                            <small class="form-text">Hold Ctrl/Cmd to select multiple hubs</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="vehicle-description" class="form-label">Description</label>
                            <textarea id="vehicle-description" class="form-control" rows="3">${vehicle?.description || ''}</textarea>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn">
                                ${isEdit ? 'Update Vehicle' : 'Add Vehicle'}
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="UIManager.closeAdminForm()">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.getElementById('vehicle-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveVehicle();
        });
    }
    
    saveVehicle() {
        const id = document.getElementById('vehicle-id').value;
        const vehicles = DataManager.getVehicles();
        
        const vehicleData = {
            id: id ? parseInt(id) : vehicles.length ? Math.max(...vehicles.map(v => v.id)) + 1 : 1,
            name: document.getElementById('vehicle-name').value,
            type: document.getElementById('vehicle-type').value,
            fuelType: document.getElementById('vehicle-fuel').value,
            seats: parseInt(document.getElementById('vehicle-seats').value),
            pricePerHour: parseFloat(document.getElementById('vehicle-price').value),
            hubs: Array.from(document.getElementById('vehicle-hubs').selectedOptions)
                      .map(option => parseInt(option.value)),
            description: document.getElementById('vehicle-description').value,
            image: `car-${document.getElementById('vehicle-fuel').value.toLowerCase()}-${Math.floor(Math.random() * 3) + 1}`
        };
        
        if (id) {
            // Update existing vehicle
            const index = vehicles.findIndex(v => v.id === parseInt(id));
            vehicles[index] = vehicleData;
        } else {
            // Add new vehicle
            vehicles.push(vehicleData);
        }
        
        DataManager.saveData(DataManager.STORAGE_KEYS.VEHICLES, vehicles);
        this.closeAdminForm();
        this.renderVehiclesList();
        this.showToast(`Vehicle ${id ? 'updated' : 'added'} successfully`, 'success');
    }
    
    editVehicle(id) {
        const vehicles = DataManager.getVehicles();
        const vehicle = vehicles.find(v => v.id === id);
        if (vehicle) {
            this.showVehicleForm(vehicle);
        }
    }
    
    deleteVehicle(id) {
        if (confirm('Are you sure you want to delete this vehicle?')) {
            const vehicles = DataManager.getVehicles();
            const filteredVehicles = vehicles.filter(v => v.id !== id);
            DataManager.saveData(DataManager.STORAGE_KEYS.VEHICLES, filteredVehicles);
            this.renderVehiclesList();
            this.showToast('Vehicle deleted successfully', 'success');
        }
    }
    
    showDriverForm(driver = null) {
        const formsContainer = document.getElementById('admin-forms');
        const isEdit = !!driver;
        
        formsContainer.innerHTML = `
            <div class="modal" id="driver-form-modal" style="display: flex;">
                <div class="modal-content">
                    <button class="modal-close" onclick="UIManager.closeAdminForm()">
                        <i class="fas fa-times"></i>
                    </button>
                    <h2>${isEdit ? 'Edit Driver' : 'Add New Driver'}</h2>
                    <form id="driver-form">
                        <input type="hidden" id="driver-id" value="${driver?.id || ''}">
                        
                        <div class="form-group">
                            <label for="driver-name" class="form-label">Driver Name</label>
                            <input type="text" id="driver-name" class="form-control" 
                                   value="${driver?.name || ''}" required>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="driver-rating" class="form-label">Rating</label>
                                <input type="number" step="0.1" min="0" max="5" id="driver-rating" 
                                       class="form-control" value="${driver?.rating || '4.5'}" required>
                            </div>
                            <div class="form-group">
                                <label for="driver-rate" class="form-label">Hourly Rate ($)</label>
                                <input type="number" step="0.01" id="driver-rate" class="form-control" 
                                       value="${driver?.hourlyRate || ''}" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Vehicle Types</label>
                            <div class="checkbox-group">
                                <label>
                                    <input type="checkbox" name="vehicle-types" value="car" 
                                        ${driver?.vehicleTypes?.includes('car') ? 'checked' : ''}>
                                    Car
                                </label>
                                <label>
                                    <input type="checkbox" name="vehicle-types" value="suv" 
                                        ${driver?.vehicleTypes?.includes('suv') ? 'checked' : ''}>
                                    SUV
                                </label>
                                <label>
                                    <input type="checkbox" name="vehicle-types" value="van" 
                                        ${driver?.vehicleTypes?.includes('van') ? 'checked' : ''}>
                                    Van
                                </label>
                                <label>
                                    <input type="checkbox" name="vehicle-types" value="scooter" 
                                        ${driver?.vehicleTypes?.includes('scooter') ? 'checked' : ''}>
                                    Scooter
                                </label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Availability</label>
                            <label class="switch">
                                <input type="checkbox" id="driver-available" 
                                    ${driver?.available !== false ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                            <span id="available-status">${driver?.available !== false ? 'Available' : 'Busy'}</span>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn">
                                ${isEdit ? 'Update Driver' : 'Add Driver'}
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="UIManager.closeAdminForm()">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Update availability status text
        document.getElementById('driver-available').addEventListener('change', function() {
            document.getElementById('available-status').textContent = 
                this.checked ? 'Available' : 'Busy';
        });
        
        document.getElementById('driver-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveDriver();
        });
    }
    
    saveDriver() {
        const id = document.getElementById('driver-id').value;
        const drivers = DataManager.getData(DataManager.STORAGE_KEYS.DRIVERS) || [];
        
        const driverData = {
            id: id ? parseInt(id) : drivers.length ? Math.max(...drivers.map(d => d.id)) + 1 : 1,
            name: document.getElementById('driver-name').value,
            rating: parseFloat(document.getElementById('driver-rating').value),
            hourlyRate: parseFloat(document.getElementById('driver-rate').value),
            available: document.getElementById('driver-available').checked,
            vehicleTypes: Array.from(document.querySelectorAll('input[name="vehicle-types"]:checked'))
                             .map(checkbox => checkbox.value)
        };
        
        if (id) {
            // Update existing driver
            const index = drivers.findIndex(d => d.id === parseInt(id));
            drivers[index] = driverData;
        } else {
            // Add new driver
            drivers.push(driverData);
        }
        
        DataManager.saveData(DataManager.STORAGE_KEYS.DRIVERS, drivers);
        this.closeAdminForm();
        this.renderDriversList();
        this.showToast(`Driver ${id ? 'updated' : 'added'} successfully`, 'success');
    }
    
    editDriver(id) {
        const drivers = DataManager.getData(DataManager.STORAGE_KEYS.DRIVERS) || [];
        const driver = drivers.find(d => d.id === id);
        if (driver) {
            this.showDriverForm(driver);
        }
    }
    
    deleteDriver(id) {
        if (confirm('Are you sure you want to delete this driver?')) {
            const drivers = DataManager.getData(DataManager.STORAGE_KEYS.DRIVERS) || [];
            const filteredDrivers = drivers.filter(d => d.id !== id);
            DataManager.saveData(DataManager.STORAGE_KEYS.DRIVERS, filteredDrivers);
            this.renderDriversList();
            this.showToast('Driver deleted successfully', 'success');
        }
    }
    
    closeAdminForm() {
        const formsContainer = document.getElementById('admin-forms');
        formsContainer.innerHTML = '';
    }
    
    renderDriverView() {
        return `
            <section class="driver-view view">
                <h1>Driver Dashboard</h1>
                
                <div class="driver-info card mb-4">
                    <h2>Available Assignments</h2>
                    <p>Check and manage your assigned rides here.</p>
                </div>
                
                <div id="assignments-list">
                    <!-- Driver assignments will be loaded here -->
                </div>
            </section>
        `;
    }
    
    renderDriverAssignments() {
        const container = document.getElementById('assignments-list');
        if (!container) return;
        
        const bookings = DataManager.getBookings();
        const currentBookings = bookings.filter(b => 
            b.status === 'confirmed' && b.driverId
        );
        
        if (currentBookings.length === 0) {
            container.innerHTML = '<div class="alert"><p>No active assignments found.</p></div>';
            return;
        }
        
        container.innerHTML = currentBookings.map(booking => {
            const vehicle = DataManager.getVehicleById(booking.vehicleId);
            const pickupHub = DataManager.getHubById(booking.pickupHubId);
            
            return `
                <div class="assignment-card card mb-3">
                    <h3>Assignment for Booking #${booking.id}</h3>
                    <div class="assignment-details">
                        <p><strong>Vehicle:</strong> ${vehicle?.name || 'Unknown'}</p>
                        <p><strong>Pick-up:</strong> ${pickupHub?.name} on ${booking.pickupDate} at ${booking.pickupTime}</p>
                        <p><strong>Drop-off:</strong> ${booking.dropoffDate} at ${booking.dropoffTime}</p>
                        <p><strong>Customer Age:</strong> ${booking.userAge} years</p>
                        <p><strong>Total Earnings:</strong> $${booking.totalPrice * 0.2}</p>
                    </div>
                    <div class="assignment-actions">
                        <button class="btn btn-success" onclick="UIManager.acceptAssignment(${booking.id})">
                            Accept Ride
                        </button>
                        <button class="btn btn-danger" onclick="UIManager.rejectAssignment(${booking.id})">
                            Reject Ride
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    acceptAssignment(bookingId) {
        this.showToast('Ride accepted successfully!', 'success');
        // In a real app, this would update the booking status
    }
    
    rejectAssignment(bookingId) {
        if (confirm('Are you sure you want to reject this assignment?')) {
            this.showToast('Ride rejected.', 'warning');
            // In a real app, this would update the booking and make driver available
        }
    }
    
    showToast(message, type = 'info') {
        const toast = document.getElementById('notification-toast');
        const messageElement = document.getElementById('toast-message');
        
        if (!toast || !messageElement) return;
        
        // Set message and type
        messageElement.textContent = message;
        toast.className = `toast ${type}`;
        
        // Show toast
        toast.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideToast();
        }, 5000);
    }
    
    hideToast() {
        const toast = document.getElementById('notification-toast');
        if (toast) {
            toast.style.display = 'none';
        }
    }
    
    showLoginModal() {
        // Simple login for demo purposes
        const email = prompt('Enter email (use: user@example.com):');
        if (email === 'user@example.com') {
            DataManager.setCurrentUser(1);
            this.showToast('Logged in successfully!', 'success');
            this.renderView('profile');
        }
    }
}

// Initialize UI Manager
window.UIManager = new UIManager();