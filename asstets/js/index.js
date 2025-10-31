
const healthTips = [
  { id: 1, title: 'Hydratation', content: "Buvez 8 verres d'eau par jour.", icon: '💧' },
  { id: 2, title: 'Activité Physique', content: "30 minutes d'exercice modéré.", icon: '🏃' },
  { id: 3, title: 'Sommeil', content: "Dormez 7 à 9 heures par nuit.", icon: '😴' },
  { id: 4, title: 'Alimentation', content: "Mangez des fruits et légumes.", icon: '🍎' },
  { id: 5, title: 'Hydratation Matinale', content: "Commencez la journée avec un verre d'eau.", icon: '🌅💧' },
  { id: 6, title: 'Pause Étirements', content: "Faites des étirements toutes les 2h.", icon: '🧘' },
  { id: 7, title: 'Relaxation', content: "5 minutes de respiration profonde.", icon: '🧖' }
];


const articles = [
  { id: 1, title: 'Bienfaits de la marche', category: 'Exercice', excerpt: '30 minutes de marche chaque jour.' },
  { id: 2, title: 'Nutrition: super-aliments', category: 'Nutrition', excerpt: 'Boostez votre système immunitaire.' },
  { id: 3, title: 'Importance des fibres', category: 'Nutrition', excerpt: 'Consommez 25-30g de fibres par jour.' },
  { id: 4, title: 'Yoga pour débutants', category: 'Exercice', excerpt: 'Séances de 20 min par jour.' },
  { id: 5, title: 'Gestion du stress', category: 'Bien-être', excerpt: 'Techniques de respiration et méditation.' },
  { id: 6, title: 'Sommeil réparateur', category: 'Sommeil', excerpt: 'Établissez un rythme régulier.' }
];



let currentTipIndex = 0;
let searchQuery = '';
let darkMode = false;

const carousel = document.getElementById('carousel');
const carouselIcon = document.getElementById('carouselIcon');
const carouselTitle = document.getElementById('carouselTitle');
const carouselContentText = document.getElementById('carouselContentText');
const carouselIndicators = document.getElementById('carouselIndicators');
const articlesGrid = document.getElementById('articlesGrid');
const healthBoxesGrid = document.getElementById('healthBoxesGrid');
const searchInput = document.getElementById('searchInput');
const searchResultCount = document.getElementById('searchResultCount');
const toggleDark = document.getElementById('toggleDark');
const toggleThumb = document.getElementById('toggleThumb');
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const searchBar = document.getElementById('searchBar');

function renderCarousel() {
  const tip = healthTips[currentTipIndex];

  carousel.classList.add('opacity-0');
  
  setTimeout(() => {
    carouselIcon.textContent = tip.icon;
    carouselTitle.textContent = tip.title;
    carouselContentText.textContent = tip.content;

    carouselIndicators.innerHTML = healthTips.map((_, idx) =>
      `<button data-index="${idx}" class="${idx===currentTipIndex?'w-8 bg-blue-300':'w-3 bg-blue-200'} h-3 rounded-full mx-1 transition-colors duration-500"></button>`
    ).join('');

    carousel.classList.remove('opacity-0');

    document.querySelectorAll('#carouselIndicators button').forEach(btn => {
      btn.addEventListener('click', () => {
        currentTipIndex = parseInt(btn.dataset.index);
        renderCarousel();
      });
    });

    updateColors(); 
  }, 300); 
}


function renderArticles() {
  const filtered = articles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()));
  searchResultCount.textContent = searchQuery ? `${filtered.length} résultat(s)` : '';
  articlesGrid.innerHTML = filtered.map(a => `
    <div class="rounded-lg p-6 shadow-md transition-colors duration-500 cursor-pointer">
      <h3 class="mb-2">${a.title}</h3>
      <p>${a.excerpt}</p>
    </div>
  `).join('');
  updateColors();
}

function renderHealthBoxes() {
  healthBoxesGrid.innerHTML = healthBoxes.map(box => `
    <div class="rounded-lg p-6 shadow-md transition-colors duration-500 cursor-pointer">
      <div class="text-4xl mb-2">${box.icon}</div>
      <h3 class="mb-2">${box.title}</h3>
      <p>${box.content}</p>
    </div>
  `).join('');
  updateColors();
}

function updateColors() {
  let carouselColor, carouselTextColor, footerColor, footerTextColor;

  if(darkMode){
    document.body.classList.add('dark');
    carouselColor = "#1e293b";
    carouselTextColor = "#cbd5e1";
    footerColor = "#1e293b";
    footerTextColor = "#cbd5e1";
    toggleThumb.textContent = "🌙";
    toggleThumb.style.transform = "translateX(100%)";
    navbar.style.backgroundColor = "#1e293b";
    searchBar.style.backgroundColor = "#1e293b";
  } else {
    document.body.classList.remove('dark');
    carouselColor = "#bfdbfe";
    carouselTextColor = "#1e3a8a";
    footerColor = "#e0f2fe"; 
    footerTextColor = "#1e1f2b"; 
    toggleThumb.textContent = "☀️";
    toggleThumb.style.transform = "translateX(0%)";
    navbar.style.backgroundColor = "#ffffff";
    searchBar.style.backgroundColor = "#ffffff";
  }

  carousel.style.backgroundColor = carouselColor;
  carouselTitle.style.color = carouselTextColor;
  carouselContentText.style.color = carouselTextColor;
  carouselIcon.style.color = carouselTextColor;

  articlesGrid.querySelectorAll('div').forEach(d => {
    d.style.backgroundColor = carouselColor;
    d.style.color = carouselTextColor;
  });

  // Footer
  footer.style.backgroundColor = footerColor;
  footer.style.color = footerTextColor;
}

searchInput.addEventListener('input', e => {
  searchQuery = e.target.value;
  renderArticles();
});

toggleDark.addEventListener('click', () => {
  darkMode = !darkMode;
  updateColors();
});

document.getElementById('nextTip').addEventListener('click', () => { 
  currentTipIndex = (currentTipIndex +1) % healthTips.length; 
  renderCarousel();
});
document.getElementById('prevTip').addEventListener('click', () => { 
  currentTipIndex = (currentTipIndex -1 + healthTips.length) % healthTips.length; 
  renderCarousel();
});

mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

renderCarousel();
renderArticles();
renderHealthBoxes();
updateColors();

setInterval(() => {
  currentTipIndex = (currentTipIndex + 1) % healthTips.length;
  renderCarousel();
}, 5000); 
