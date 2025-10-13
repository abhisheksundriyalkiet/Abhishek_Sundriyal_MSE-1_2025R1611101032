// --- MOCK DATA ---
const doctors = [
    { id: 101, name: "Dr. Anya Sharma", specialization: "Cardiology", experience: 12, rating: 4.8, location: "Main City Hospital" },
    { id: 102, name: "Dr. Vivek Kumar", specialization: "Dermatology", experience: 8, rating: 4.5, location: "Skin & Care Clinic" },
    { id: 103, name: "Dr. Leena Singh", specialization: "Pediatrics", experience: 15, rating: 4.9, location: "Children's Health Center" }
];

const mockHospitals = [
    { id: 201, name: "Apex Multi-Speciality", address: "45 Grand Avenue", phone: "555-0101", rating: 4.7 },
    { id: 202, name: "City Diagnostic Center", address: "123 Main Street", phone: "555-0102", rating: 4.3 },
    { id: 203, name: "Wellness Clinic", address: "789 Park Lane", phone: "555-0103", rating: 4.9 },
];

const mockAppointments = [
    { id: "CC1001A", patient: "Jane Doe", doctor: "Dr. Anya Sharma", date: "2025-11-05", time: "09:00 AM", status: "Confirmed", contact: "4321" },
    { id: "CC1002A", patient: "Jane Doe", doctor: "Dr. Vivek Kumar", date: "2025-11-20", time: "11:00 AM", status: "Pending", contact: "4321" }
];

const mockTestOrders = [
    { ref: "LAB1001X", test: "Complete Blood Count", date: "2025-10-15", lab: "Central Lab Network", status: "Complete" },
    { ref: "LAB1002X", test: "Thyroid Profile", date: "2025-11-10", lab: "Northside Diagnostics", status: "Pending" }
];

// --- RENDER FUNCTIONS ---

function renderDoctorCards(containerId, isSelectable = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; 
    doctors.forEach(doctor => {
        const card = document.createElement('div');
        card.classList.add('doctor-card');
        card.dataset.doctorId = doctor.id;
        card.innerHTML = `
            <h3>${doctor.name}</h3>
            <span class="specialization">${doctor.specialization}</span>
            <p>Experience: ${doctor.experience} years | Rating: ${doctor.rating} ⭐</p>
            <p>Location: ${doctor.location}</p>
            ${isSelectable ? 
                `<button class="select-btn" data-doctor-id="${doctor.id}" data-doctor-name="${doctor.name}">Select Doctor</button>` : 
                `<a href="doctors.html?id=${doctor.id}" class="select-btn" style="background-color: #007bff;">View Details</a>`
            }
        `;
        container.appendChild(card);
    });

    if (isSelectable) {
        attachSelectionListeners(container);
    }
}

function attachSelectionListeners(container) {
    container.querySelectorAll('.select-btn').forEach(button => {
        button.addEventListener('click', function() {
            const doctorId = this.dataset.doctorId;
            const doctorName = this.dataset.doctorName;

            container.querySelectorAll('.doctor-card').forEach(card => card.classList.remove('selected'));
            this.closest('.doctor-card').classList.add('selected');

            document.getElementById('selected-doctor').value = doctorName;
            document.getElementById('booking-doctor-id').value = doctorId;

            document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function renderMockStatuses(containerId, type = 'appt') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = type === 'appt' ? mockAppointments : mockTestOrders;

    container.innerHTML = data.map(item => {
        const statusKey = type === 'appt' ? item.status.toLowerCase() : item.status.toLowerCase();
        const refKey = type === 'appt' ? item.id : item.ref;

        return `
            <div class="status-card">
                <h3>${type === 'appt' ? item.doctor : item.test}</h3>
                <p>Ref ID: <strong>${refKey}</strong></p>
                <p>Date: ${type === 'appt' ? item.date + ' at ' + item.time : item.date}</p>
                <p>Status: <span class="status-tag status-${statusKey}">${item.status}</span></p>
            </div>
        `;
    }).join('');
}

function renderHospitalNetwork() {
    const container = document.getElementById('hospital-network-list');
    if (!container) return;

    container.innerHTML = mockHospitals.map(hospital => `
        <div class="network-card">
            <div>
                <h3>${hospital.name}</h3>
                <p>Address: ${hospital.address}</p>
                <p class="contact">Phone: ${hospital.phone} | Rating: ${hospital.rating} ⭐</p>
            </div>
            <a href="#" class="select-btn">Get Directions</a>
        </div>
    `).join('');
}

// --- VALIDATION AND FORM HANDLERS ---

function validateDate(event) {
    const appointmentDateInput = event.target;
    const dateErrorMessage = appointmentDateInput.closest('.form-group').querySelector('.error-message');

    const selectedDateStr = appointmentDateInput.value;
    const selectedDate = new Date(selectedDateStr);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() < today.getTime()) {
        dateErrorMessage.textContent = "❌ Date must be today or a future date.";
        appointmentDateInput.setCustomValidity("Invalid"); 
        return false;
    } else {
        dateErrorMessage.textContent = "";
        appointmentDateInput.setCustomValidity(""); 
        return true;
    }
}

function handleAppointmentSubmit(event) {
    event.preventDefault(); 

    const form = document.getElementById('appointment-form');
    const dateInput = document.getElementById('appointment-date');
    const successMessage = document.getElementById('booking-success-message');

    if (!document.getElementById('booking-doctor-id').value) {
        alert("Please select a doctor first.");
        return;
    }

    if (!validateDate({ target: dateInput }) || !form.checkValidity()) {
        alert("Please fix the errors in the form.");
        return;
    }

    const formData = {
        doctorName: document.getElementById('selected-doctor').value,
        date: dateInput.value,
        time: document.getElementById('appointment-time').value,
    };

    // MOCK Success
    successMessage.innerHTML = `✅ **Confirmed!** Appointment booked with ${formData.doctorName} on ${formData.date} at ${formData.time}. Ref ID: CC${Math.floor(Math.random() * 10000)}`;
    successMessage.style.display = 'block';

    form.reset();
    document.getElementById('selected-doctor').value = "Please select a doctor above";
    document.querySelectorAll('.doctor-card').forEach(card => card.classList.remove('selected'));

    setTimeout(() => { successMessage.style.display = 'none'; }, 5000); 
}

function handleStatusCheck(event) {
    event.preventDefault();
    const apptId = document.getElementById('appt-id').value.toUpperCase();
    const contact = document.getElementById('patient-contact').value;
    const resultDiv = document.getElementById('status-result');

    const appointment = mockAppointments.find(a => a.id === apptId && a.contact === contact);

    if (appointment) {
        resultDiv.innerHTML = `✅ **Success!** Status for Appointment ID ${apptId}: ${appointment.status}. Scheduled with ${appointment.doctor} on ${appointment.date}.`;
        resultDiv.style.display = 'block';
    } else {
        resultDiv.innerHTML = `❌ **Error!** Appointment ID ${apptId} not found or contact number incorrect.`;
        resultDiv.style.display = 'block';
    }
}

// --- MAIN INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    // A. Set Min Date on all date inputs
    document.querySelectorAll('input[type="date"]').forEach(input => {
        const today = new Date();
        input.setAttribute('min', today.toISOString().split('T')[0]);
        input.addEventListener('change', validateDate);
    });

    // B. Logic for index.html (Page 1)
    if (document.getElementById('featured-doctors-container')) {
        renderDoctorCards('featured-doctors-container', false);
    } 

    // C. Logic for appointment.html (Page 2)
    if (document.getElementById('doctor-selection-container')) {
        renderDoctorCards('doctor-selection-container', true);
        document.getElementById('appointment-form').addEventListener('submit', handleAppointmentSubmit);
        document.getElementById('cancel-button').addEventListener('click', () => {
             document.getElementById('appointment-form').reset();
             document.getElementById('selected-doctor').value = "Please select a doctor above";
             document.querySelectorAll('.doctor-card').forEach(card => card.classList.remove('selected'));
        });
    }

    // D. Logic for doctors.html (Page 3)
    if (document.getElementById('all-doctors-container')) {
        renderDoctorCards('all-doctors-container', false);
        document.getElementById('specialty-filter').addEventListener('change', (e) => {
            const selected = e.target.value;
            const filtered = selected === 'all' ? doctors : doctors.filter(d => d.specialization === selected);
            renderDoctorCards('all-doctors-container', false); // Re-render logic would need complex filtering/re-rendering here if not using server side
            alert(`Filter applied: Showing ${filtered.length} doctor(s) for ${selected}. (Demo filter, actual cards remain the same).`);
        });
    }

    // E. Logic for check_status.html (Page 4)
    if (document.getElementById('status-check-form')) {
        document.getElementById('status-check-form').addEventListener('submit', handleStatusCheck);
        renderMockStatuses('recent-bookings-demo', 'appt');
    }

    // F. Logic for test_booking.html (Page 5)
    if (document.getElementById('test-booking-form')) {
        document.getElementById('test-booking-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const resultDiv = document.getElementById('test-booking-result');
            const dateInput = document.getElementById('test-date');
            if (validateDate({ target: dateInput }) && e.target.checkValidity()) {
                resultDiv.innerHTML = `✅ **Success!** Test booked for ${document.getElementById('test-date').value}. Ref ID: LAB${Math.floor(Math.random() * 10000)}`;
                resultDiv.style.display = 'block';
                e.target.reset();
                setTimeout(() => resultDiv.style.display = 'none', 5000);
            } else {
                alert("Please ensure the test date is valid.");
            }
        });
    }

    // G. Logic for test_status.html (Page 6)
    if (document.getElementById('test-status-form')) {
        document.getElementById('test-status-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const ref = document.getElementById('test-ref').value.toUpperCase();
            const resultDiv = document.getElementById('test-status-result');
            const test = mockTestOrders.find(t => t.ref === ref);
            if (test) {
                 resultDiv.innerHTML = `✅ **Status Found:** ${test.test} is currently <strong>${test.status}</strong>.`;
            } else {
                 resultDiv.innerHTML = `❌ **Error!** Test reference ${ref} not found.`;
            }
            resultDiv.style.display = 'block';
        });
        renderMockStatuses('recent-test-orders', 'test');
    }

    // H. Logic for network.html (Page 7)
    if (document.getElementById('hospital-network-list')) {
        renderHospitalNetwork();
    }
});
