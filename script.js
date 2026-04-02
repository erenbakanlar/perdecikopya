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


// Ürün verileri
const products = [
  {
    id: 'PROD-1',
    name: 'Zebra Perde – Beyaz',
    category: 'Zebra Perde',
    price: 299.00,
    image: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=400&h=400&fit=crop'
  },
  {
    id: 'PROD-2',
    name: 'Stor Perde – Gri',
    category: 'Stor Perde',
    price: 249.00,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=400&fit=crop'
  },
  {
    id: 'PROD-3',
    name: 'Karartma Perde – Siyah',
    category: 'Karartma Perde',
    price: 450.00,
    image: 'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=400&h=400&fit=crop'
  },
  {
    id: 'PROD-4',
    name: 'Koyu Gri Ada Fonluk Büzgülü Perde',
    category: 'Fon Perde',
    price: 480.00,
    image: 'https://images.unsplash.com/photo-1585128792304-c8f7e7a65d7f?w=400&h=400&fit=crop'
  },
  {
    id: 'PROD-5',
    name: 'Açık Gri Ada Fonluk Büzgülü Perde',
    category: 'Fon Perde',
    price: 480.00,
    image: 'https://images.unsplash.com/photo-1585128792304-c8f7e7a65d7f?w=400&h=400&fit=crop'
  },
  {
    id: 'PROD-6',
    name: 'Ahşap Jaluzi Perde – Doğal',
    category: 'Ahşap Jaluzi Perde',
    price: 1920.00,
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400&h=400&fit=crop'
  },
  {
    id: 'PROD-7',
    name: 'Beyaz Tül Perde – Klasik',
    category: 'Tül Perde',
    price: 269.00,
    image: 'https://images.unsplash.com/photo-1616594266537-adb2e9a0ae5f?w=400&h=400&fit=crop'
  },
  {
    id: 'PROD-8',
    name: 'Keten Görünümlü Tül Perde',
    category: 'Tül Perde',
    price: 299.00,
    image: 'https://images.unsplash.com/photo-1616594266537-adb2e9a0ae5f?w=400&h=400&fit=crop'
  }
];

// Ürünleri localStorage'a kaydet
if (!localStorage.getItem('products')) {
  localStorage.setItem('products', JSON.stringify(products));
}

// Sepete ekle butonu oluştur
function createAddToCartButton(product) {
  const btn = document.createElement('button');
  btn.className = 'btn btn-primary btn-sm';
  btn.textContent = 'Sepete Ekle';
  btn.style.marginLeft = '10px';
  btn.onclick = (e) => {
    e.preventDefault();
    addToCart(product);
  };
  return btn;
}

// Sayfa yüklendiğinde ürün kartlarına sepete ekle butonu ekle
document.addEventListener('DOMContentLoaded', () => {
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach((card, index) => {
    if (products[index]) {
      const overlay = card.querySelector('.product-overlay');
      if (overlay) {
        const addBtn = createAddToCartButton(products[index]);
        overlay.appendChild(addBtn);
      }
    }
  });
});
