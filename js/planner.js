document.addEventListener('DOMContentLoaded', function() {
    // Initialize Chart.js
    initTimeChart();
    
    // Navigation functionality
    setupNavigation();
    
    // Focus items functionality
    setupFocusItems();
    
    // Network contacts functionality
    setupNetworkContacts();
    
    // User profile functionality
    setupUserProfile();
    
    // Wealth tracker functionality
    setupWealthTracker();
    
    // Animation on scroll
    setupAnimations();
});

function initTimeChart() {
    const ctx = document.getElementById('timeChart').getContext('2d');
    
    // Get calendar data from localStorage
    const calendarData = JSON.parse(localStorage.getItem('calendarData')) || {
        events: [],
        calendars: [
            { id: 1, name: 'Work', color: '#4285F4' },
            { id: 2, name: 'Personal', color: '#EA4335' },
            { id: 3, name: 'Family', color: '#FBBC05' }
        ]
    };

    // Process events to get time allocation by calendar
    const timeByCalendar = {};
    calendarData.calendars.forEach(calendar => {
        timeByCalendar[calendar.name] = {
            time: 0,
            color: calendar.color
        };
    });

    calendarData.events.forEach(event => {
        const calendar = calendarData.calendars.find(c => c.id === event.calendarId);
        if (calendar) {
            // Calculate event duration in hours
            const [startHour, startMin] = event.startTime.split(':').map(Number);
            const [endHour, endMin] = event.endTime.split(':').map(Number);
            const duration = (endHour + endMin/60) - (startHour + startMin/60);
            
            timeByCalendar[calendar.name].time += duration;
        }
    });

    // Prepare data for chart
    const labels = [];
    const data = [];
    const backgroundColors = [];
    
    Object.entries(timeByCalendar).forEach(([name, info]) => {
        // Only include calendars with time allocated
        if (info.time > 0) {
            labels.push(name);
            data.push(info.time);
            backgroundColors.push(info.color);
        }
    });

    // If no data, show all calendars with 0 time
    if (labels.length === 0) {
        calendarData.calendars.forEach(calendar => {
            labels.push(calendar.name);
            data.push(0);
            backgroundColors.push(calendar.color);
        });
    }

    // Create the chart
    const timeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 0,
            }]
        },
        options: {
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });

    // Update the legend with all calendars (even those with 0 time)
    updateTimeLegend(calendarData.calendars);
}

function updateTimeLegend(calendars) {
    const legendContainer = document.getElementById('timeLegend');
    legendContainer.innerHTML = '';
    
    calendars.forEach(calendar => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <span class="legend-color" style="background-color: ${calendar.color};"></span>
            <span>${calendar.name}</span>
        `;
        legendContainer.appendChild(legendItem);
    });
}

function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the target page
            const targetPage = this.dataset.page;
            
            // Here you would handle navigation between apps
            console.log(`Navigating to ${targetPage}`);
            // In a real implementation, this would load the appropriate app
        });
    });

    // Add refresh functionality
document.querySelector('.btn-refresh').addEventListener('click', function() {
    // Reinitialize the chart with updated data
    initTimeChart();
});
    // Make sure Planner button is active by default
    document.querySelector('.nav-button[data-page="planner"]').classList.add('active');
}

function setupFocusItems() {
    const focusContainer = document.getElementById('focusItemsContainer');
    const addFocusBtn = document.getElementById('addFocusItem');
    
    // Add new focus item
    addFocusBtn.addEventListener('click', function() {
        const focusId = 'focus-' + Date.now();
        const focusItem = document.createElement('div');
        focusItem.className = 'focus-item';
        focusItem.innerHTML = `
            <div class="focus-checkbox">
                <input type="checkbox" id="${focusId}">
                <label for="${focusId}"></label>
            </div>
            <div class="focus-content">
                <h4 contenteditable="true">New Focus Item</h4>
                <p contenteditable="true">Priority | Time</p>
            </div>
            <button class="btn-delete-focus">
                <i class="fas fa-times"></i>
            </button>
        `;
        focusContainer.appendChild(focusItem);
        
        // Add delete functionality
        const deleteBtn = focusItem.querySelector('.btn-delete-focus');
        deleteBtn.addEventListener('click', function() {
            focusItem.remove();
        });
    });
    
    // Add delete functionality to existing items
    document.querySelectorAll('.btn-delete-focus').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.focus-item').remove();
        });
    });
}

function setupNetworkContacts() {
    const contactsContainer = document.getElementById('networkContacts');
    const addContactBtn = document.getElementById('addContactBtn'); // Using same button as focus items
    
    // Load saved contacts
    let contacts = JSON.parse(localStorage.getItem('networkContacts')) || [];
    
    // Render existing contacts
    contacts.forEach(contact => {
        renderContact(contact);
    });
    
    // Add new contact
    addContactBtn.addEventListener('click', () => {
        const newContact = {
            id: 'contact-' + Date.now(),
            name: 'New Contact',
            lastContact: 'recently',
            image: 'assets/images/contact-placeholder.jpg'
        };
        
        contacts.push(newContact);
        saveContacts();
        renderContact(newContact);
    });
    
    function renderContact(contact) {
        const contactElement = document.createElement('div');
        contactElement.className = 'network-item';
        contactElement.dataset.contactId = contact.id;
        contactElement.innerHTML = `
            <div class="network-avatar">
                <img src="${contact.image}" alt="${contact.name}" class="contact-image">
                <input type="file" class="contact-image-upload" accept="image/*" style="display: none;">
            </div>
            <div class="network-content">
                <h4 contenteditable="true">${contact.name}</h4>
                <p contenteditable="true">Last contact: ${contact.lastContact}</p>
            </div>
            <div class="network-action">
                <button class="btn-network btn-delete-contact">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        contactsContainer.appendChild(contactElement);
        
        // Setup event listeners
        const imageElement = contactElement.querySelector('.contact-image');
        const imageUpload = contactElement.querySelector('.contact-image-upload');
        const nameElement = contactElement.querySelector('h4');
        const lastContactElement = contactElement.querySelector('p');
        const deleteBtn = contactElement.querySelector('.btn-delete-contact');
        
        // Image upload
        imageElement.addEventListener('click', () => imageUpload.click());
        
        imageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.match('image.*')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    imageElement.src = event.target.result;
                    // Update in memory
                    const contact = contacts.find(c => c.id === contactElement.dataset.contactId);
                    if (contact) {
                        contact.image = event.target.result;
                        saveContacts();
                    }
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Save text changes
        nameElement.addEventListener('blur', () => {
            const contact = contacts.find(c => c.id === contactElement.dataset.contactId);
            if (contact) {
                contact.name = nameElement.textContent;
                saveContacts();
            }
        });
        
        lastContactElement.addEventListener('blur', () => {
            const contact = contacts.find(c => c.id === contactElement.dataset.contactId);
            if (contact) {
                contact.lastContact = lastContactElement.textContent.replace('Last contact: ', '');
                saveContacts();
            }
        });
        
        // Delete contact
        deleteBtn.addEventListener('click', () => {
            if (confirm('Delete this contact permanently?')) {
                contacts = contacts.filter(c => c.id !== contactElement.dataset.contactId);
                saveContacts();
                contactElement.remove();
            }
        });
    }
    
    function saveContacts() {
        localStorage.setItem('networkContacts', JSON.stringify(contacts));
    }
}

function setupUserProfile() {
    const profileImage = document.getElementById('profileImage');
    const profileImageUpload = document.getElementById('profileImageUpload');
    
    // Profile image upload
    profileImage.addEventListener('click', function() {
        profileImageUpload.click();
    });
    
    profileImageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                profileImage.src = event.target.result;
                localStorage.setItem('profileImage', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Load saved profile image
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
        profileImage.src = savedImage;
    }
}

function setupWealthTracker() {
    const wealthValue = document.getElementById('wealthValue');
    const wealthChange = document.getElementById('wealthChange');
    const wealthChangeContainer = document.getElementById('wealthChangeContainer');
    const connectWealthBtn = document.getElementById('connectWealthBtn');
    const wealthModal = document.getElementById('wealthConnectionModal');
    const closeWealthModal = document.getElementById('closeWealthModal');
    const simulateBtn = document.getElementById('simulateSuccessBtn');

    // Check if essential elements exist
    if (!connectWealthBtn || !wealthModal || !closeWealthModal || !simulateBtn) {
        console.error('Essential wealth tracker elements not found in DOM');
        return;
    }

    // Check connection status
    const isConnected = localStorage.getItem('wealthAccountConnected') === 'true';
    
    // Initialize UI
    if (isConnected) {
        try {
            const wealthData = JSON.parse(localStorage.getItem('wealthData')) || {
                value: 100000,
                change: 500,
                percentage: 0.5
            };
            updateWealthDisplay(wealthData);
            connectWealthBtn.textContent = 'View Breakdown';
        } catch (e) {
            console.error('Error parsing wealth data:', e);
            resetWealthData();
        }
    } else {
        resetWealthUI();
    }

    // Modal control functions
    function openModal() {
        try {
            wealthModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        } catch (e) {
            console.error('Error opening modal:', e);
            wealthModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        try {
            wealthModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        } catch (e) {
            console.error('Error closing modal:', e);
            wealthModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    function resetWealthUI() {
        if (wealthValue) wealthValue.textContent = '$0';
        if (wealthChangeContainer) wealthChangeContainer.style.display = 'none';
        if (connectWealthBtn) connectWealthBtn.textContent = 'Connect Account';
    }

    function resetWealthData() {
        localStorage.removeItem('wealthAccountConnected');
        localStorage.removeItem('wealthData');
        resetWealthUI();
    }

    // Event listeners with error handling
    function safeAddEventListener(element, event, handler) {
        if (element && typeof handler === 'function') {
            element.addEventListener(event, handler);
        }
    }

    safeAddEventListener(connectWealthBtn, 'click', function() {
        if (isConnected) {
            alert('This would show your detailed wealth breakdown');
        } else {
            openModal();
        }
    });

    safeAddEventListener(closeWealthModal, 'click', closeModal);
    
    safeAddEventListener(wealthModal, 'click', function(e) {
        if (e.target === wealthModal) {
            closeModal();
        }
    });

    safeAddEventListener(simulateBtn, 'click', function() {
        if (!connectWealthBtn) return;
        
        connectWealthBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        connectWealthBtn.disabled = true;
        
        setTimeout(() => {
            try {
                const initialValue = 250000 + Math.random() * 100000;
                const initialChange = 1000 + Math.random() * 500;
                const initialPercentage = (initialChange / initialValue * 100).toFixed(2);
                
                const wealthData = {
                    value: initialValue,
                    change: initialChange,
                    percentage: initialPercentage
                };
                
                localStorage.setItem('wealthAccountConnected', 'true');
                localStorage.setItem('wealthData', JSON.stringify(wealthData));
                
                updateWealthDisplay(wealthData);
                if (connectWealthBtn) {
                    connectWealthBtn.innerHTML = '<i class="fas fa-chart-pie"></i> View Breakdown';
                    connectWealthBtn.disabled = false;
                }
                
                startLiveUpdates();
                closeModal();
            } catch (e) {
                console.error('Error during connection simulation:', e);
                if (connectWealthBtn) {
                    connectWealthBtn.textContent = 'Connect Account';
                    connectWealthBtn.disabled = false;
                }
                alert('Connection failed. Please try again.');
            }
        }, 1500);
    });

    function updateWealthDisplay(data) {
        if (!wealthValue || !wealthChange || !wealthChangeContainer) return;
        
        wealthValue.textContent = formatCurrency(data.value);
        wealthChange.textContent = `${data.change >= 0 ? '+' : ''}${formatCurrency(data.change)} (${data.percentage}%)`;
        wealthChange.className = data.change >= 0 ? 'change-positive' : 'change-negative';
        wealthChangeContainer.style.display = 'flex';
    }

    function startLiveUpdates() {
        if (window.wealthUpdateInterval) {
            clearInterval(window.wealthUpdateInterval);
        }
        
        window.wealthUpdateInterval = setInterval(() => {
            try {
                const wealthData = JSON.parse(localStorage.getItem('wealthData'));
                if (!wealthData) return;
                
                const fluctuation = (Math.random() - 0.4) * 0.5;
                const change = wealthData.value * fluctuation / 100;
                
                const updatedData = {
                    value: wealthData.value + change,
                    change: change,
                    percentage: fluctuation.toFixed(2)
                };
                
                localStorage.setItem('wealthData', JSON.stringify(updatedData));
                updateWealthDisplay(updatedData);
            } catch (e) {
                console.error('Error during live update:', e);
            }
        }, 5000);
    }

    function formatCurrency(amount) {
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        } catch (e) {
            return '$' + Math.round(amount).toLocaleString();
        }
    }
}

function setupAnimations() {
    const cards = document.querySelectorAll('.card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        cardObserver.observe(card);
    });
}