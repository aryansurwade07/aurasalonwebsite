// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Set minimum date for the date picker (prevents past bookings) ---
    const dateInput = document.getElementById('wa-date');
    if (dateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateInput.setAttribute('min', `${year}-${month}-${day}`);
    }

    // --- 2. Set current year in footer ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- 3. Mobile Hamburger Menu Toggle ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });

        // Close the menu when a link is clicked (better UX)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
            });
        });
    }

    // --- 4. WhatsApp Booking Form Handler ---
    const bookingForm = document.getElementById('whatsapp-booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Stop page reload

            // --- IMPORTANT: Your Salon's WhatsApp Number ---
            // Must be digits only (country code + number, no spaces, no +)
            const salonPhoneNumber = "918408825462"; 

            // Get form values
            const name = document.getElementById('wa-name').value.trim();
            const email = document.getElementById('wa-email').value.trim();
            const phone = document.getElementById('wa-phone').value.trim();
            const service = document.getElementById('wa-service').value;
            const date = document.getElementById('wa-date').value;
            const rawTime = document.getElementById('wa-time').value;
            const notes = document.getElementById('wa-notes').value.trim();

            // --- Basic validation to ensure everything is filled ---
            if (!name || !email || !phone || !service || !date || !rawTime) {
                alert('Please fill in all required fields before booking.');
                return;
            }

            // Convert 24-hour time to 12-hour AM/PM format
            let timeParts = rawTime.split(':');
            let hours = parseInt(timeParts[0]);
            let minutes = timeParts[1];
            let ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // hour '0' should be '12'
            let formattedTime = hours + ':' + minutes + ' ' + ampm;

            // Build the WhatsApp message (URL encoded)
            let message = `*New Appointment Request - AURA Salon*%0A%0A`;
            message += `*Name:* ${name}%0A`;
            message += `*Email:* ${email}%0A`;
            message += `*Phone:* ${phone}%0A`;
            message += `*Service:* ${service}%0A`;
            message += `*Date:* ${date}%0A`;
            message += `*Time:* ${formattedTime}%0A`; 
            
            if (notes) {
                message += `*Special Notes:* ${notes}%0A`;
            }
            
            message += `%0A_Please reply to confirm this appointment._`;

            // Create the WhatsApp URL and redirect
            const whatsappURL = `https://wa.me/${salonPhoneNumber}?text=${message}`;
            
            // Use window.location.href to avoid popup blockers
            window.location.href = whatsappURL;
        });
    }
});