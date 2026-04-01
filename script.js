// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// ===== HERO SLIDER =====
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let current = 0;
let autoSlide;
let isTransitioning = false;

function goTo(i) {
  if (isTransitioning) return;
  isTransitioning = true;
  
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  
  current = (i + slides.length) % slides.length;
  
  // Kısa gecikme ile smooth geçiş
  setTimeout(() => {
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    setTimeout(() => { isTransitioning = false; }, 800);
  }, 50);
}

function startAuto() {
  autoSlide = setInterval(() => goTo(current + 1), 5000);
}

document.getElementById('sliderNext').addEventListener('click', () => { 
  clearInterval(autoSlide); 
  goTo(current + 1); 
  startAuto(); 
});

document.getElementById('sliderPrev').addEventListener('click', () => { 
  clearInterval(autoSlide); 
  goTo(current - 1); 
  startAuto(); 
});

dots.forEach(d => d.addEventListener('click', () => { 
  clearInterval(autoSlide); 
  goTo(+d.dataset.i); 
  startAuto(); 
}));

startAuto();

// ===== PRODUCT FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    productCards.forEach(card => {
      if (filter === 'hepsi' || card.dataset.cat === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  btn.textContent = 'Gönderildi ✓';
  btn.disabled = true;
  btn.style.background = '#4caf50';
  setTimeout(() => {
    btn.textContent = 'Gönder';
    btn.disabled = false;
    btn.style.background = '';
    this.reset();
  }, 3000);
});

// ===== STICKY HEADER =====
window.addEventListener('scroll', () => {
  document.getElementById('header').style.boxShadow =
    window.scrollY > 10 ? '0 4px 20px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)';
});
