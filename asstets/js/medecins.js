const doctors = [
  { id: 1, name: 'Dr. Sarah Alami', specialty: 'cardiologie', photo: '👩‍⚕️', available: true, experience: '15 ans', rating: 4.8 },
  { id: 2, name: 'Dr. Ahmed Benali', specialty: 'dermatologie', photo: '👨‍⚕️', available: true, experience: '10 ans', rating: 4.6 },
  { id: 3, name: 'Dr. Fatima Idrissi', specialty: 'pédiatrie', photo: '👩‍⚕️', available: false, experience: '12 ans', rating: 4.9 },
  { id: 4, name: 'Dr. Karim Tazi', specialty: 'cardiologie', photo: '👨‍⚕️', available: true, experience: '20 ans', rating: 4.7 },
  { id: 5, name: 'Dr. Nadia Bennis', specialty: 'orthopédie', photo: '👩‍⚕️', available: true, experience: '8 ans', rating: 4.5 },
  { id: 6, name: 'Dr. Youssef Ziani', specialty: 'dermatologie', photo: '👨‍⚕️', available: false, experience: '18 ans', rating: 4.8 },
  { id: 7, name: 'Dr. Amina Slaoui', specialty: 'pédiatrie', photo: '👩‍⚕️', available: true, experience: '14 ans', rating: 4.9 },
  { id: 8, name: 'Dr. Omar Fassi', specialty: 'orthopédie', photo: '👨‍⚕️', available: true, experience: '11 ans', rating: 4.4 }
];

let currentFilter = 'all';
let darkMode = false;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let showingFavoritesOnly = false;

const doctorsGrid = document.getElementById('doctorsGrid');
const resultCount = document.getElementById('resultCount');
const toggleDark = document.getElementById('toggleDark');
const toggleThumb = document.getElementById('toggleThumb');
const navbar = document.getElementById('navbar');
const filterSection = document.getElementById('filterSection');
const heroSection = document.getElementById('heroSection');
const footer = document.getElementById('footer');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const showFavorites = document.getElementById('showFavorites');
const favoriteCount = document.getElementById('favoriteCount');

function renderDoctors() {
  let filtered = doctors;
  
  if (showingFavoritesOnly) {
    filtered = doctors.filter(d => favorites.includes(d.id));
    resultCount.textContent = `${filtered.length} médecin(s) favori(s)`;
  } else {
    if (currentFilter !== 'all') {
      filtered = doctors.filter(d => d.specialty === currentFilter);
    }
    resultCount.textContent = currentFilter !== 'all' ? `${filtered.length} médecin(s) en ${currentFilter}` : `${filtered.length} médecin(s) au total`;
  }

  doctorsGrid.innerHTML = filtered.map(d => `
    <div class="doctor-card rounded-2xl p-8 shadow-xl">
      <div class="flex justify-between items-start mb-6">
        <div class="text-7xl">${d.photo}</div>
        <button onclick="toggleFavorite(${d.id})" class="text-4xl transition-all duration-300 hover:scale-125 active:scale-110">
          ${favorites.includes(d.id) ? '❤️' : '🤍'}
        </button>
      </div>
      <h3 class="text-2xl font-bold mb-3 text-blue-900">${d.name}</h3>
      <div class="space-y-2 mb-4">
        <p class="text-blue-700"><span class="font-semibold">Spécialité:</span> ${d.specialty.charAt(0).toUpperCase() + d.specialty.slice(1)}</p>
        <p class="text-blue-700"><span class="font-semibold">Expérience:</span> ${d.experience}</p>
        <div class="flex items-center gap-2">
          <span class="text-yellow-500">⭐</span>
          <span class="font-semibold text-blue-900">${d.rating}/5</span>
        </div>
      </div>
      <div class="flex items-center gap-3 pt-4 border-t border-blue-100">
        <span class="w-4 h-4 rounded-full ${d.available ? 'bg-green-500' : 'bg-red-500'} shadow-lg"></span>
        <span class="font-medium ${d.available ? 'text-green-600' : 'text-red-600'}">${d.available ? '✓ Disponible' : '✗ Non disponible'}</span>
      </div>
    </div>
  `).join('');
  
  updateColors();
  updateFavoriteCount();
}

function toggleFavorite(doctorId) {
  if (favorites.includes(doctorId)) {
    favorites = favorites.filter(id => id !== doctorId);
  } else {
    favorites.push(doctorId);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderDoctors();
}

function updateFavoriteCount() {
  favoriteCount.textContent = favorites.length;
}

function updateColors() {
  if(darkMode){
    document.body.classList.add('dark');
    toggleThumb.textContent = "🌙";
    toggleThumb.style.transform = "translateX(100%)";
    navbar.style.backgroundColor = "#1e293b";
    navbar.style.color = "#cbd5e1";
    filterSection.style.backgroundColor = "rgba(30, 41, 59, 0.8)";
    heroSection.style.background = "linear-gradient(135deg, #1e293b 0%, #334155 100%)";
    heroSection.querySelectorAll('h1, p').forEach(el => el.style.color = "#cbd5e1");
    footer.style.backgroundColor = "#1e293b";
    footer.style.color = "#cbd5e1";
  } else {
    document.body.classList.remove('dark');
    toggleThumb.textContent = "☀️";
    toggleThumb.style.transform = "translateX(0%)";
    navbar.style.backgroundColor = "#ffffff";
    navbar.style.color = "#1e3a8a";
    filterSection.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    heroSection.style.background = "linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%)";
    heroSection.querySelectorAll('h1').forEach(el => el.style.color = "#1e3a8a");
    heroSection.querySelectorAll('p').forEach(el => el.style.color = "#1e40af");
    footer.style.backgroundColor = "#e0f2fe";
    footer.style.color = "#1e3a8a";
  }
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.specialty;
    showingFavoritesOnly = false;
    
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('bg-gradient-to-r', 'from-blue-600', 'to-blue-500', 'text-white');
      b.classList.add('bg-blue-50', 'text-blue-700');
    });
    btn.classList.remove('bg-blue-50', 'text-blue-700');
    btn.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-blue-500', 'text-white');
    
    renderDoctors();
  });
});

showFavorites.addEventListener('click', () => {
  showingFavoritesOnly = !showingFavoritesOnly;
  
  if (showingFavoritesOnly) {
    showFavorites.classList.remove('from-red-100', 'to-pink-100', 'text-red-600');
    showFavorites.classList.add('bg-gradient-to-r', 'from-red-500', 'to-pink-500', 'text-white');
  } else {
    showFavorites.classList.remove('bg-gradient-to-r', 'from-red-500', 'to-pink-500', 'text-white');
    showFavorites.classList.add('from-red-100', 'to-pink-100', 'text-red-600');
  }
  
  renderDoctors();
});

toggleDark.addEventListener('click', () => {
  darkMode = !darkMode;
  updateColors();
});

mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

renderDoctors();
updateColors();
