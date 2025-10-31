let darkMode = false;
let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
let editingId = null;

const form = document.getElementById('appointmentForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const dateInput = document.getElementById('date');
const doctorInput = document.getElementById('doctor');
const reasonInput = document.getElementById('reason');
const appointmentsList = document.getElementById('appointmentsList');
const emptyState = document.getElementById('emptyState');
const appointmentCount = document.getElementById('appointmentCount');
const toggleDark = document.getElementById('toggleDark');
const toggleThumb = document.getElementById('toggleThumb');
const navbar = document.getElementById('navbar');
const heroSection = document.getElementById('heroSection');
const formSection = document.getElementById('formSection');
const footer = document.getElementById('footer');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

// Validation en temps réel
nameInput.addEventListener('input', () => validateField('name'));
emailInput.addEventListener('input', () => validateField('email'));
dateInput.addEventListener('input', () => validateField('date'));
doctorInput.addEventListener('change', () => validateField('doctor'));

function validateField(field) {
  const errors = {
    name: document.getElementById('nameError'),
    email: document.getElementById('emailError'),
    date: document.getElementById('dateError'),
    doctor: document.getElementById('doctorError')
  };

  let isValid = true;

  if (field === 'name') {
    if (nameInput.value.trim().length < 3) {
      errors.name.classList.remove('hidden');
      nameInput.classList.add('border-red-500');
      isValid = false;
    } else {
      errors.name.classList.add('hidden');
      nameInput.classList.remove('border-red-500');
    }
  }

  if (field === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
      errors.email.classList.remove('hidden');
      emailInput.classList.add('border-red-500');
      isValid = false;
    } else {
      errors.email.classList.add('hidden');
      emailInput.classList.remove('border-red-500');
    }
  }

  if (field === 'date') {
    const selectedDate = new Date(dateInput.value);
    const now = new Date();
    if (!dateInput.value || selectedDate <= now) {
      errors.date.classList.remove('hidden');
      dateInput.classList.add('border-red-500');
      isValid = false;
    } else {
      errors.date.classList.add('hidden');
      dateInput.classList.remove('border-red-500');
    }
  }

  if (field === 'doctor') {
    if (!doctorInput.value) {
      errors.doctor.classList.remove('hidden');
      doctorInput.classList.add('border-red-500');
      isValid = false;
    } else {
      errors.doctor.classList.add('hidden');
      doctorInput.classList.remove('border-red-500');
    }
  }

  return isValid;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const allValid = ['name', 'email', 'date', 'doctor'].every(field => validateField(field));
  if (!allValid) return;

  const appointment = {
    id: editingId || Date.now(),
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    date: dateInput.value,
    doctor: doctorInput.value,
    reason: reasonInput.value.trim()
  };

  if (editingId) {
    const index = appointments.findIndex(a => a.id === editingId);
    appointments[index] = appointment;
    editingId = null;
  } else {
    appointments.push(appointment);
  }

  localStorage.setItem('appointments', JSON.stringify(appointments));
  form.reset();
  document.querySelectorAll('.error-message').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.form-input').forEach(el => el.classList.remove('border-red-500'));

  renderAppointments();
  formSection.classList.add('success-animation');
  setTimeout(() => formSection.classList.remove('success-animation'), 500);
});

function renderAppointments() {
  appointmentCount.textContent = appointments.length;

  if (appointments.length === 0) {
    emptyState.classList.remove('hidden');
    appointmentsList.innerHTML = '';
    return;
  }

  emptyState.classList.add('hidden');

  appointmentsList.innerHTML = appointments.map(app => {
    const dateObj = new Date(app.date);
    const formattedDate = dateObj.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    return `
      <div class="appointment-card rounded-2xl p-6 shadow-lg">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-xl font-bold text-blue-900 mb-2">${app.name}</h3>
            <p class="text-blue-700 mb-1">👨‍⚕️ ${app.doctor}</p>
            <p class="text-blue-700 mb-1">📅 ${formattedDate}</p>
            <p class="text-blue-700 mb-1">🕐 ${formattedTime}</p>
            ${app.phone ? `<p class="text-blue-700 mb-1">📱 ${app.phone}</p>` : ''}
            ${app.reason ? `<p class="text-blue-700 mt-2 italic">"${app.reason}"</p>` : ''}
          </div>
          <div class="flex gap-2">
            <button onclick="editAppointment(${app.id})" class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium">✏️</button>
            <button onclick="deleteAppointment(${app.id})" class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium">🗑️</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  updateColors();
}

function deleteAppointment(id) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
    appointments = appointments.filter(a => a.id !== id);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    renderAppointments();
  }
}

function editAppointment(id) {
  const app = appointments.find(a => a.id === id);
  if (!app) return;

  editingId = id;
  nameInput.value = app.name;
  emailInput.value = app.email;
  phoneInput.value = app.phone;
  dateInput.value = app.date;
  doctorInput.value = app.doctor;
  reasonInput.value = app.reason;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateColors() {
  if (darkMode) {
    document.body.classList.add('dark');
    toggleThumb.textContent = "🌙";
    toggleThumb.style.transform = "translateX(100%)";
    navbar.style.backgroundColor = "#1e293b";
    formSection.style.backgroundColor = "rgba(30, 41, 59, 0.9)";
    heroSection.style.background = "linear-gradient(135deg, #1e293b 0%, #334155 100%)";
    heroSection.querySelectorAll('h1, p').forEach(el => el.style.color = "#cbd5e1");
    footer.style.backgroundColor = "#1e293b";
    footer.style.color = "#cbd5e1";
  } else {
    document.body.classList.remove('dark');
    toggleThumb.textContent = "☀️";
    toggleThumb.style.transform = "translateX(0%)";
    navbar.style.backgroundColor = "#ffffff";
    formSection.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    heroSection.style.background = "linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%)";
    heroSection.querySelectorAll('h1, p').forEach(el => el.style.color = "#1e3a8a");
    footer.style.backgroundColor = "#f0f9ff";
    footer.style.color = "#1e3a8a";
  }
}

toggleDark.addEventListener('click', () => {
  darkMode = !darkMode;
  updateColors();
});

mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

renderAppointments();
updateColors();
