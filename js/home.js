document.addEventListener('DOMContentLoaded', function() {
    // Navigation button functionality
    const navButtons = document.querySelectorAll('.nav-button');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const targetPage = button.dataset.page;
            console.log(`Navigating to ${targetPage}`);
            // Add your page navigation logic here
        });
    });

    // Animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.tool-card, .benefit-item, .quote, .feedback-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial animation states
    document.querySelectorAll('.tool-card, .benefit-item, .quote, .feedback-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Initial check
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Feedback System
    const feedbackButton = document.querySelector('.feedback-button');
    const feedbackModal = document.getElementById('feedbackModal');
    const closeModal = document.querySelector('.close-modal');
    const stars = document.querySelectorAll('.stars i');
    const ratingText = document.querySelector('.rating-text');
    const feedbackText = document.getElementById('feedbackText');
    const submitBtn = document.getElementById('submitFeedback');
    const feedbackContainer = document.getElementById('feedbackContainer');

    let currentRating = 0;

    // Open Modal
    function openFeedbackModal() {
        feedbackModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Close Modal
    function closeFeedbackModal() {
        feedbackModal.classList.remove('show');
        document.body.style.overflow = '';
        resetForm();
    }

    // Reset Form
    function resetForm() {
        currentRating = 0;
        stars.forEach(star => {
            star.classList.remove('active');
            star.style.color = '';
        });
        ratingText.textContent = 'Click to rate';
        ratingText.style.color = '';
        feedbackText.value = '';
        feedbackText.style.borderColor = '';
    }

    // Star Rating
    stars.forEach(star => {
        star.addEventListener('click', () => {
            currentRating = parseInt(star.getAttribute('data-rating'));
            stars.forEach((s, index) => {
                if (index < currentRating) {
                    s.classList.add('active');
                    s.style.color = '#FFD700';
                } else {
                    s.classList.remove('active');
                    s.style.color = '#ddd';
                }
            });
            
            const ratingTexts = [
                'Poor',
                'Fair',
                'Good',
                'Very Good',
                'Excellent'
            ];
            ratingText.textContent = ratingTexts[currentRating - 1];
        });
        
        star.addEventListener('mouseover', () => {
            const hoverRating = parseInt(star.getAttribute('data-rating'));
            stars.forEach((s, index) => {
                if (index < hoverRating && !s.classList.contains('active')) {
                    s.style.color = '#FFD700';
                }
            });
        });
        
        star.addEventListener('mouseout', () => {
            stars.forEach((s, index) => {
                if (index >= currentRating && !s.classList.contains('active')) {
                    s.style.color = '#ddd';
                }
            });
        });
    });

    // Submit Feedback
    submitBtn.addEventListener('click', () => {
        if (currentRating === 0) {
            ratingText.textContent = 'Please select a rating';
            ratingText.style.color = '#EA4335';
            setTimeout(() => {
                ratingText.style.color = '';
            }, 2000);
            return;
        }
        
        const feedback = feedbackText.value.trim();
        if (!feedback) {
            feedbackText.style.borderColor = '#EA4335';
            setTimeout(() => {
                feedbackText.style.borderColor = '#DADCE0';
            }, 2000);
            return;
        }
        
        saveFeedback(currentRating, feedback);
        closeFeedbackModal();
    });

    // Close modal when clicking outside
    feedbackModal.addEventListener('click', (e) => {
        if (e.target === feedbackModal) {
            closeFeedbackModal();
        }
    });

    closeModal.addEventListener('click', closeFeedbackModal);

    // Save Feedback
    function saveFeedback(rating, text) {
        try {
            // Get existing feedback or initialize empty array if none exists
            const feedbacks = JSON.parse(localStorage.getItem('focusFlowFeedbacks') || []);
            
            const newFeedback = {
                id: Date.now(),
                rating,
                text,
                date: new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                }),
                userInitial: 'U' + Math.floor(Math.random() * 9) // Random user initial
            };
            
            feedbacks.unshift(newFeedback); // Add new feedback at the beginning
            localStorage.setItem('focusFlowFeedbacks', JSON.stringify(feedbacks));
            
            // Update the display
            displayFeedbacks();
        } catch (error) {
            console.error('Error saving feedback:', error);
            // Initialize fresh storage if corrupted
            localStorage.setItem('focusFlowFeedbacks', JSON.stringify([]));
        }
    }

    // Display Feedbacks
    function displayFeedbacks() {
        try {
            // Safely parse the feedbacks with fallback to empty array
            const feedbacks = JSON.parse(localStorage.getItem('focusFlowFeedbacks')) || [];
            feedbackContainer.innerHTML = '';
            
            if (feedbacks.length === 0) {
                feedbackContainer.innerHTML = '<p class="no-feedback">No feedback yet. Be the first to share!</p>';
                return;
            }
            
            feedbacks.forEach((feedback, index) => {
                const feedbackItem = document.createElement('div');
                feedbackItem.className = 'feedback-item';
                feedbackItem.style.opacity = '0';
                feedbackItem.style.transform = 'translateY(20px)';
                feedbackItem.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
                
                // Create stars HTML
                let starsHTML = '';
                for (let i = 1; i <= 5; i++) {
                    starsHTML += `<i class="fas fa-star${i <= feedback.rating ? ' active"' : '"'}" style="color: ${i <= feedback.rating ? '#FFD700' : '#ddd'}"></i>`;
                }
                
                feedbackItem.innerHTML = `
                    <div class="feedback-item-header">
                        <div class="feedback-user">${feedback.userInitial}</div>
                        <div class="feedback-stars">${starsHTML}</div>
                    </div>
                    <div class="feedback-content">${feedback.text}</div>
                    <div class="feedback-date">${feedback.date}</div>
                `;
                
                feedbackContainer.appendChild(feedbackItem);
                
                // Trigger animation
                setTimeout(() => {
                    feedbackItem.style.opacity = '1';
                    feedbackItem.style.transform = 'translateY(0)';
                }, 100);
            });
        } catch (error) {
            console.error('Error displaying feedback:', error);
            feedbackContainer.innerHTML = '<p class="no-feedback">Error loading feedback. Please try refreshing.</p>';
        }
    }

    // Initialize the feedback display
    displayFeedbacks();

    // Feedback button click event
    feedbackButton.addEventListener('click', openFeedbackModal);
});