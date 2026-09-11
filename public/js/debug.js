// Debug script to test home page functionality
console.log('Debug script loaded');

// Check if main.js functions are available
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking functions...');
    
    // Check main functions
    const functions = [
        'showFlashMessage',
        'homePageInit', 
        'createParticles',
        'initLiveSearch',
        'updateWeather',
        'updateLiveStats',
        'initInteractiveMap'
    ];
    
    functions.forEach(func => {
        if (typeof window[func] === 'function') {
            console.log(`✅ ${func} is available`);
        } else {
            console.log(`❌ ${func} is NOT available`);
        }
    });
    
    // Check important elements
    const elements = [
        'hero-section',
        'liveSearch',
        'searchSuggestions',
        'currentTemp',
        'currentLocation',
        'particles-container'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`✅ Element #${id} found`);
        } else {
            console.log(`❌ Element #${id} NOT found`);
        }
    });
    
    // Test search functionality
    setTimeout(() => {
        console.log('Testing search suggestions...');
        const searchInput = document.getElementById('liveSearch');
        if (searchInput) {
            searchInput.value = 'Par';
            searchInput.dispatchEvent(new Event('input'));
            
            setTimeout(() => {
                const suggestions = document.getElementById('searchSuggestions');
                if (suggestions && suggestions.style.display !== 'none') {
                    console.log('✅ Search suggestions working');
                } else {
                    console.log('❌ Search suggestions not working');
                }
            }, 100);
        }
    }, 2000);
});
