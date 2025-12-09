/**
 * Rento - Main Application Module
 * Entry point that initializes all components
 */

// DOM Ready handler
document.addEventListener('DOMContentLoaded', () => {
    console.log('Rento App Initializing...');
    
    // Initialize data
    DataManager.initializeData();
    
    // Set current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Auto-login demo user for testing (remove in production)
    if (!DataManager.getCurrentUser()) {
        DataManager.setCurrentUser(3); // Demo user
        UIManager.updateUserInterface();
    }
    
    console.log('Rento App Ready!');
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    UIManager.showToast('An error occurred. Please try again.', 'error');
});

// Export for debugging
window.RentoApp = {
    DataManager,
    UIManager
};