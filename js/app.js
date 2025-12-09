/**
 * Rento - Main Application Module
 * Entry point that initializes all components
 */

// DOM Ready handler
document.addEventListener('DOMContentLoaded', () => {
    console.log('Rento App Initializing...');
    
    // Initialize data
    DataManager.initializeData();
    
    // Set demo user for testing
    DataManager.setCurrentUser(1);
    
    // Set current year in footer if exists
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Add some CSS for hidden class
    const style = document.createElement('style');
    style.textContent = `
        .hidden { display: none !important; }
        .alert { 
            background-color: #fff3cd; 
            border: 1px solid #ffeaa7; 
            border-radius: var(--border-radius-md); 
            padding: var(--spacing-md); 
            margin: var(--spacing-md) 0; 
        }
        .alert.error { background-color: #f8d7da; border-color: #f5c6cb; }
        .alert.success { background-color: #d4edda; border-color: #c3e6cb; }
        .alert.warning { background-color: #fff3cd; border-color: #ffeaa7; }
        .card { 
            background: var(--light-card); 
            border-radius: var(--border-radius-lg); 
            padding: var(--spacing-lg); 
            margin-bottom: var(--spacing-md); 
            box-shadow: 0 2px 4px var(--shadow-color); 
        }
        .btn-sm { padding: var(--spacing-sm) var(--spacing-md); font-size: var(--font-size-sm); }
        .btn-danger { background-color: var(--danger-color); }
        .btn-success { background-color: var(--success-color); }
        .status { 
            display: inline-block; 
            padding: var(--spacing-xs) var(--spacing-sm); 
            border-radius: var(--border-radius-sm); 
            font-size: var(--font-size-xs); 
            font-weight: 600; 
        }
        .status.confirmed { background-color: #d4edda; color: #155724; }
        .status.cancelled { background-color: #f8d7da; color: #721c24; }
        .status.available { background-color: #d4edda; color: #155724; }
        .status.busy { background-color: #f8d7da; color: #721c24; }
        .form-row { display: flex; gap: var(--spacing-md); }
        .form-row .form-group { flex: 1; }
        .price-summary { 
            background: var(--light-bg); 
            padding: var(--spacing-lg); 
            border-radius: var(--border-radius-md); 
        }
        .price-item { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: var(--spacing-sm); 
            padding-bottom: var(--spacing-sm); 
            border-bottom: 1px solid var(--border-color); 
        }
        .price-item.total { 
            border-top: 2px solid var(--border-color); 
            margin-top: var(--spacing-md); 
            padding-top: var(--spacing-md); 
            font-size: var(--font-size-lg); 
        }
        .admin-tabs { 
            display: flex; 
            gap: var(--spacing-sm); 
            margin-bottom: var(--spacing-lg); 
            border-bottom: 2px solid var(--border-color); 
        }
        .tab-btn { 
            padding: var(--spacing-md) var(--spacing-lg); 
            background: none; 
            border: none; 
            border-bottom: 2px solid transparent; 
            cursor: pointer; 
            font-weight: 500; 
        }
        .tab-btn.active { 
            border-bottom-color: var(--primary-color); 
            color: var(--primary-color); 
        }
        .tab-pane { display: none; }
        .tab-pane.active { display: block; }
        .admin-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: var(--spacing-lg); 
        }
        .checkbox-group { 
            display: flex; 
            flex-wrap: wrap; 
            gap: var(--spacing-md); 
        }
        .checkbox-group label { 
            display: flex; 
            align-items: center; 
            gap: var(--spacing-sm); 
        }
        .toast.success { background-color: #d4edda; border-color: #c3e6cb; }
        .toast.error { background-color: #f8d7da; border-color: #f5c6cb; }
        .toast.warning { background-color: #fff3cd; border-color: #ffeaa7; }
    `;
    document.head.appendChild(style);
    
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