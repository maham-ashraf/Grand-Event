// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(26, 26, 46, 0.98)';
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(26, 26, 46, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Availability Checker Function
function checkAvailability() {
    const date = document.getElementById('check-date').value;
    const time = document.getElementById('check-time').value;
    const eventType = document.getElementById('event-type')?.value || '';
    const guests = document.getElementById('guests')?.value || '';
    const resultDiv = document.getElementById('availability-result');

    if (!date || !time) {
        showAvailabilityResult('Please select both date and time to check availability.', 'unavailable');
        return;
    }

    // Simulate availability checking with predefined data
    const availableSlots = getAvailableSlots(date, time, eventType, guests);
    
    if (availableSlots.available) {
        showAvailabilityResult(
            `✅ Great! ${availableSlots.message} Selected time slot is available for booking.`,
            'available'
        );
    } else {
        showAvailabilityResult(
            `❌ Sorry! ${availableSlots.message} This time slot is already booked. Please select another date or time.`,
            'unavailable'
        );
    }
}

function getAvailableSlots(date, time, eventType, guests) {
    // Pakistan-specific unavailable dates
    const unavailableDates = [
        '2024-03-23', // Pakistan Day
        '2024-08-14', // Independence Day
        '2024-12-25', // Quaid-e-Azam Day
        '2024-06-15', // Eid-ul-Fitr (approximate)
        '2024-06-20', // Eid-ul-Azha (approximate)
    ];

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    
    // Weekend (Friday, Saturday) premium pricing and limited availability
    if (dayOfWeek === 5 || dayOfWeek === 6) { // Friday or Saturday
        if (Math.random() > 0.2) { // 80% chance of being unavailable on weekends
            return {
                available: false,
                message: 'Weekend slots fill up quickly.'
            };
        }
    }

    // Check if date is in unavailable list
    if (unavailableDates.includes(date)) {
        return {
            available: false,
            message: 'This date is fully booked due to high demand.'
        };
    }

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
        return {
            available: false,
            message: 'Cannot book events in the past.'
        };
    }

    // Random availability for demonstration
    const isAvailable = Math.random() > 0.3; // 70% chance of being available
    
    if (isAvailable) {
        const timeMessages = {
            'morning': 'Morning events have a fresh, energetic atmosphere!',
            'afternoon': 'Afternoon slots are perfect for daytime celebrations!',
            'evening': 'Evening events create magical memories!',
            'fullday': 'Full day bookings offer the complete Grand Events experience!'
        };
        
        return {
            available: true,
            message: timeMessages[time] || 'This time slot is perfect for your event!'
        };
    } else {
        return {
            available: false,
            message: 'This time slot is already booked.'
        };
    }
}

function showAvailabilityResult(message, type) {
    const resultDiv = document.getElementById('availability-result');
    resultDiv.innerHTML = `<p>${message}</p>`;
    resultDiv.className = `availability-result ${type}`;
    resultDiv.style.display = 'block';
    
    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Booking Form Handler
document.getElementById('booking-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        fullName: document.getElementById('full-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        eventType: document.getElementById('event-type').value,
        eventDate: document.getElementById('event-date').value,
        eventTime: document.getElementById('event-time').value,
        guests: document.getElementById('guests').value,
        message: document.getElementById('message').value
    };

    // Validate form data
    if (!validateBookingForm(formData)) {
        return;
    }

    // Show success message
    showBookingSuccess(formData);
    
    // Reset form
    this.reset();
});

function validateBookingForm(data) {
    // Basic validation
    if (!data.fullName || !data.email || !data.phone || !data.eventType || !data.eventDate || !data.eventTime) {
        alert('Please fill in all required fields marked with *');
        return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address');
        return false;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(data.phone)) {
        alert('Please enter a valid phone number');
        return false;
    }

    // Date validation (not in the past)
    const selectedDate = new Date(data.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        alert('Event date cannot be in the past');
        return false;
    }

    return true;
}

function showBookingSuccess(formData) {
    const eventTypeNames = {
        'wedding': 'Wedding Event',
        'corporate': 'Corporate Event',
        'birthday': 'Birthday Party',
        'conference': 'Conference',
        'mehndi': 'Mehndi Event',
        'engagement': 'Engagement Ceremony',
        'social': 'Social Gathering',
        'other': 'Other Event'
    };

    const successMessage = `
🎉 BOOKING REQUEST SUBMITTED SUCCESSFULLY! 🎉

Thank you, ${formData.fullName}!

Your booking request has been received for:
• Event Type: ${eventTypeNames[formData.eventType]}
• Date: ${formatDate(formData.eventDate)}
• Time: ${formData.eventTime}
${formData.guests ? `• Guests: ${formData.guests}` : ''}

Our team will contact you within 24 hours at:
📧 Email: ${formData.email}
📞 Phone: ${formData.phone}

What happens next:
1. You'll receive a confirmation email shortly
2. Our event coordinator will call you to discuss details
3. We'll send you a detailed proposal within 48 hours

For immediate assistance, call us at +92 300 1234567

Grand Events Team
Making your moments memorable! ✨
    `;

    // Create a modal-like alert with better formatting
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        animation: slideIn 0.3s ease;
    `;

    modalContent.innerHTML = `
        <h2 style="color: #1a1a2e; margin-bottom: 20px;">Booking Confirmation</h2>
        <pre style="white-space: pre-wrap; font-family: 'Poppins', sans-serif; line-height: 1.6; color: #2c3e50;">${successMessage}</pre>
        <button onclick="this.parentElement.parentElement.remove()" style="
            background: #f39c12;
            color: #1a1a2e;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 20px;
            font-size: 16px;
        ">Close</button>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (modal.parentElement) {
            modal.remove();
        }
    }, 10000);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Gallery lightbox effect
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        const lightbox = document.createElement('div');
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: pointer;
        `;

        const lightboxImg = document.createElement('img');
        lightboxImg.src = img.src;
        lightboxImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 10px;
            animation: zoomIn 0.3s ease;
        `;

        lightbox.appendChild(lightboxImg);
        document.body.appendChild(lightbox);

        lightbox.addEventListener('click', function() {
            this.remove();
        });
    });
});

// Add zoom animation
const zoomStyle = document.createElement('style');
zoomStyle.textContent = `
    @keyframes zoomIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(zoomStyle);

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .gallery-item, .about-text, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
});

// Set minimum date for date inputs to today
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.setAttribute('min', today);
    });
});

// Add loading state for buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
        if (!this.classList.contains('no-loading')) {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
            }, 2000);
        }
    });
});

// Form field animations
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
    field.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    field.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Service cards hover effect enhancement
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) rotateX(5deg)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotateX(0)';
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '');
    }, 16);
}

// Initialize counter animations when stats are visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const stats = entry.target.querySelectorAll('.stat h3');
            stats.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (!isNaN(number)) {
                    animateCounter(stat, number);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe about stats section
document.addEventListener('DOMContentLoaded', () => {
    const aboutStats = document.querySelector('.about-stats');
    if (aboutStats) {
        statsObserver.observe(aboutStats);
    }
});
