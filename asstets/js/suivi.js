let darkMode = false;
let measures = JSON.parse(localStorage.getItem('healthMeasures')) || [];

const form = document.getElementById('healthForm');
const dateInput = document.getElementById('date');
const weightInput = document.getElementById('weight');
const systolicInput = document.getElementById('systolic');
const diastolicInput = document.getElementById('diastolic');
const glucoseInput = document.getElementById('glucose');
const notesInput = document.getElementById('notes');
const measuresList = document.getElementById('measuresList');
const emptyState = document.getElementById('emptyState');
const measureCount = document.getElementById('measureCount');
const avgWeight = document.getElementById('avgWeight');
const avgPressure = document.getElementById('avgPressure');
const avgGlucose = document.getElementById('avgGlucose');
const healthIcon = document.getElementById('healthIcon');
const healthStatus = document.getElementById('healthStatus');
const healthMessage = document.getElementById('healthMessage');
const toggleDark = document.getElementById('toggleDark');
const toggleThumb = document.getElementById('toggleThumb');
const navbar = document.getElementById('navbar');
const heroSection = document.getElementById('heroSection');
const formSection = document.getElementById('formSection');
const footer = document.getElementById('footer');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const healthIndicator = document.getElementById('healthIndicator');
const globalStats = document.getElementById('globalStats');
const globalStats2 = document.getElementById('globalStats2');
const globalStats3 = document.getElementById('globalStats3');

// Date par défaut
dateInput.valueAsDate = new Date();

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const measure = {
    id: Date.now(),
    date: dateInput.value,
    weight: weightInput.value ? parseFloat(weightInput.value) : null,
    systolic: systolicInput.value ? parseInt(systolicInput.value) : null,
    diastolic: diastolicInput.value ? parseInt(diastolicInput.value) : null,
    glucose: glucoseInput.value ? parseFloat(glucoseInput.value) : null,
    notes: notesInput.value.trim()
  };

  measures.unshift(measure);
  localStorage.setItem('healthMeasures', JSON.stringify(measures));
  
  form.reset();
  dateInput.valueAsDate = new Date();
  
  renderMeasures();
  calculateStats();
});

function renderMeasures() {
  measureCount.textContent = measures.length;

  if (measures.length === 0) {
    emptyState.classList.remove('hidden');
    measuresList.innerHTML = '';
    return;
  }

  emptyState.classList.add('hidden');
  
  measuresList.innerHTML = measures.map(m => {
    const dateObj = new Date(m.date);
    const formattedDate = dateObj.toLocaleDateString('fr-FR', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });

    return `
      <div class="metric-card rounded-2xl p-6 shadow-lg">
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <p class="text-blue-900 font-bold text-lg mb-3">📅 ${formattedDate}</p>
            <div class="space-y-2">
              ${m.weight ? `<p class="text-blue-700">⚖️ Poids: <span class="font-semibold">${m.weight} kg</span></p>` : ''}
              ${m.systolic && m.diastolic ? `<p class="text-blue-700">❤️ Tension: <span class="font-semibold">${m.systolic}/${m.diastolic} mmHg</span></p>` : ''}
              ${m.glucose ? `<p class="text-blue-700">🩸 Glycémie: <span class="font-semibold">${m.glucose} g/L</span></p>` : ''}
              ${m.notes ? `<p class="text-blue-600 italic mt-2">"${m.notes}"</p>` : ''}
            </div>
          </div>
          <button onclick="deleteMeasure(${m.id})" class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium">🗑️</button>
        </div>
      </div>
    `;
  }).join('');

  updateColors();
}

function deleteMeasure(id) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette mesure ?')) {
    measures = measures.filter(m => m.id !== id);
    localStorage.setItem('healthMeasures', JSON.stringify(measures));
    renderMeasures();
    calculateStats();
  }
}

function calculateStats() {
  if (measures.length === 0) {
    avgWeight.textContent = '-';
    avgPressure.textContent = '-';
    avgGlucose.textContent = '-';
    updateHealthIndicator('neutral');
    return;
  }

  const weights = measures.filter(m => m.weight).map(m => m.weight);
  const systolics = measures.filter(m => m.systolic).map(m => m.systolic);
  const diastolics = measures.filter(m => m.diastolic).map(m => m.diastolic);
  const glucoses = measures.filter(m => m.glucose).map(m => m.glucose);

  if (weights.length > 0) avgWeight.textContent = (weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1);
  if (systolics.length > 0 && diastolics.length > 0) {
    avgPressure.textContent = `${Math.round(systolics.reduce((a, b) => a + b, 0) / systolics.length)}/${Math.round(diastolics.reduce((a, b) => a + b, 0) / diastolics.length)}`;
  }
  if (glucoses.length > 0) avgGlucose.textContent = (glucoses.reduce((a, b) => a + b, 0) / glucoses.length).toFixed(2);

  let healthScore = 0, factors = 0;
  if (systolics.length > 0) { const avgSys = systolics.reduce((a, b) => a + b, 0) / systolics.length; if (avgSys >= 90 && avgSys <= 130) healthScore++; else if (avgSys > 140) healthScore--; factors++; }
  if (glucoses.length > 0) { const avgGlu = glucoses.reduce((a, b) => a + b, 0) / glucoses.length; if (avgGlu >= 0.7 && avgGlu <= 1.1) healthScore++; else if (avgGlu > 1.26) healthScore--; factors++; }
  if (factors > 0) {
    const normalizedScore = healthScore / factors;
    if (normalizedScore >= 0.5) updateHealthIndicator('good');
    else if (normalizedScore >= -0.5) updateHealthIndicator('medium');
    else updateHealthIndicator('bad');
  } else updateHealthIndicator('neutral');
}

function updateHealthIndicator(status) {
  const configs = {
    good: { icon: '😊', color: 'bg-green-100', status: 'Excellent état', message: 'Vos indicateurs sont dans les normes. Continuez !', statusColor: 'text-green-600' },
    medium: { icon: '😐', color: 'bg-orange-100', status: 'État moyen', message: 'Certains indicateurs nécessitent attention.', statusColor: 'text-orange-600' },
    bad: { icon: '😟', color: 'bg-red-100', status: 'État préoccupant', message: 'Consultez un professionnel de santé.', statusColor: 'text-red-600' },
    neutral: { icon: '📊', color: 'bg-blue-100', status: 'En attente de données', message: 'Ajoutez des mesures pour voir votre état.', statusColor: 'text-blue-600' }
  };
  const config = configs[status];
  healthIcon.textContent = config.icon;
  healthIcon.className = `w-32 h-32 rounded-full flex items-center justify-center text-5xl shadow-2xl ${config.color}`;
  healthStatus.textContent = config.status;
  healthStatus.className = `text-3xl font-bold mb-2 ${config.statusColor}`;
  healthMessage.textContent = config.message;
}

function updateColors() {
  if(darkMode){
    document.body.classList.add('dark'); toggleThumb.textContent="🌙"; toggleThumb.style.transform="translateX(100%)";
    navbar.style.backgroundColor="#1e293b"; formSection.style.backgroundColor="rgba(30, 41, 59, 0.9)";
    heroSection.style.background="linear-gradient(135deg, #1e293b 0%, #334155 100%)";
    heroSection.querySelectorAll('h1, p').forEach(el=>el.style.color="#cbd5e1");
    footer.style.backgroundColor="#1e293b"; footer.style.color="#cbd5e1";
    healthIndicator.style.backgroundColor="rgba(30, 41, 59, 0.9)";
    globalStats.style.backgroundColor="rgba(30, 41, 59, 0.9)";
    globalStats2.style.backgroundColor="rgba(30, 41, 59, 0.9)";
    globalStats3.style.backgroundColor="rgba(30, 41, 59, 0.9)";
  } else {
    document.body.classList.remove('dark'); toggleThumb.textContent="☀️"; toggleThumb.style.transform="translateX(0%)";
    navbar.style.backgroundColor="#ffffff"; formSection.style.backgroundColor="rgba(255, 255, 255, 0.9)";
    heroSection.style.background="linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%)";
    heroSection.querySelectorAll('h1').forEach(el=>el.style.color="#1e3a8a");
    heroSection.querySelectorAll('p').forEach(el=>el.style.color="#1e40af");
    footer.style.backgroundColor="#e0f2fe"; footer.style.color="#1e3a8a";
    healthIndicator.style.backgroundColor="rgba(255, 255, 255, 0.9)";
    globalStats.style.backgroundColor="rgba(255, 255, 255, 0.9)";
    globalStats2.style.backgroundColor="rgba(255, 255, 255, 0.9)";
    globalStats3.style.backgroundColor="rgba(255, 255, 255, 0.9)";
  }
}

toggleDark.addEventListener('click', ()=>{darkMode=!darkMode; updateColors();});
mobileMenuBtn.addEventListener('click', ()=>{mobileMenu.classList.toggle('hidden');});

renderMeasures();
calculateStats();
updateColors();
