// ===== LİGHTBOX =====
function openLightbox(btn) {
  const card = btn.closest('.product-card');
  const imgDiv = btn.closest('.product-img');
  const current = imgDiv.dataset.current || '1';
  const imgUrl = imgDiv.dataset['img' + current];

  const cat = card.querySelector('.product-cat')?.textContent || '';
  const title = card.querySelector('h3')?.textContent || '';
  const desc = card.dataset.desc || '';
  const waMsg = encodeURIComponent(`Merhaba, "${title}" ürünüyle ilgileniyorum. Daha fazla bilgi alabilir miyim?`);

  document.getElementById('lightboxImg').src = imgUrl;
  document.getElementById('lightboxCat').textContent = cat;
  document.getElementById('lightboxTitle').textContent = title;
  document.getElementById('lightboxDesc').textContent = desc;
  document.getElementById('lightboxWa').href = `https://wa.me/905464057575?text=${waMsg}`;

  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function closeLightboxOnBg(event) {
  if (event.target === document.getElementById('lightbox')) {
    closeLightbox();
  }
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeLightbox();
});

// ===== FOTOĞRAF GEÇİŞ FONKSİYONU =====
function switchPhoto(btn) {
  const imgDiv = btn.closest('.product-img');
  const current = parseInt(imgDiv.dataset.current);
  const next = current === 1 ? 2 : 1;
  const imgInner = imgDiv.querySelector('.product-img-inner');
  imgInner.style.backgroundImage = `url('${imgDiv.dataset['img' + next]}')`;
  imgDiv.dataset.current = next;
  imgDiv.querySelectorAll('.photo-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === next - 1);
  });
}

// ===== FAVORİ SİSTEMİ =====
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

const favHeaderBtn = document.getElementById('favHeaderBtn');
const favHeaderCount = document.getElementById('favHeaderCount');
const favPanel = document.getElementById('favPanel');
const favPanelOverlay = document.getElementById('favPanelOverlay');
const favPanelClose = document.getElementById('favPanelClose');
const favPanelBody = document.getElementById('favPanelBody');

function saveFavorites() {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function updateFavCount() {
  if (!favHeaderCount) return;
  if (favorites.length > 0) {
    favHeaderCount.textContent = favorites.length;
    favHeaderCount.style.display = 'flex';
  } else {
    favHeaderCount.style.display = 'none';
  }
}

function getProductData(card) {
  const imgEl = card.querySelector('.product-img-inner');
  const imgStyle = imgEl ? imgEl.style.backgroundImage : '';
  const imgUrl = imgStyle.replace(/url\(['"]?|['"]?\)/g, '');
  return {
    id: card.dataset.favId,
    name: card.querySelector('h3')?.textContent || '',
    cat: card.querySelector('.product-cat')?.textContent || '',
    img: imgUrl,
  };
}

function renderFavPanel() {
  if (!favPanelBody) return;
  if (favorites.length === 0) {
    favPanelBody.innerHTML = `
      <div class="fav-empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
        <p>Henüz favori ürün eklemediniz.</p>
      </div>`;
    return;
  }
  favPanelBody.innerHTML = favorites.map(f => `
    <div class="fav-item" data-fav-id="${f.id}">
      <div class="fav-item-img" style="background-image: url('${f.img}')"></div>
      <div class="fav-item-info">
        <div class="fav-item-cat">${f.cat}</div>
        <div class="fav-item-name">${f.name}</div>
      </div>
      <button class="fav-item-remove" data-remove-id="${f.id}" aria-label="Kaldır">&#x2715;</button>
    </div>`).join('');
}

function openFavPanel() {
  renderFavPanel();
  favPanel && favPanel.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeFavPanel() {
  favPanel && favPanel.classList.remove('open');
  document.body.style.overflow = '';
}

favHeaderBtn && favHeaderBtn.addEventListener('click', openFavPanel);
favPanelClose && favPanelClose.addEventListener('click', closeFavPanel);
favPanelOverlay && favPanelOverlay.addEventListener('click', closeFavPanel);

// Panel içinden favori kaldırma
favPanelBody && favPanelBody.addEventListener('click', e => {
  const removeBtn = e.target.closest('.fav-item-remove');
  if (!removeBtn) return;
  const id = removeBtn.dataset.removeId;
  favorites = favorites.filter(f => f.id !== id);
  saveFavorites();
  updateFavCount();
  // Karttaki butonu da güncelle
  const card = document.querySelector(`.product-card[data-fav-id="${id}"]`);
  if (card) {
    const btn = card.querySelector('.fav-btn');
    if (btn) {
      btn.classList.remove('active');
      btn.querySelector('svg').setAttribute('fill', 'none');
    }
  }
  renderFavPanel();
});

// Ürün kartlarına id ata ve sayfa yüklenince mevcut favorileri yansıt
document.querySelectorAll('.product-card').forEach((card, i) => {
  card.dataset.favId = 'prod-' + i;
});

function syncFavButtons() {
  document.querySelectorAll('.product-card').forEach(card => {
    const btn = card.querySelector('.fav-btn');
    if (!btn) return;
    const isFav = favorites.some(f => f.id === card.dataset.favId);
    btn.classList.toggle('active', isFav);
    btn.querySelector('svg').setAttribute('fill', isFav ? 'currentColor' : 'none');
  });
}
syncFavButtons();
updateFavCount();

// Ürün kartı fav butonu tıklama
document.addEventListener('click', e => {
  const btn = e.target.closest('.fav-btn');
  if (!btn) return;
  const card = btn.closest('.product-card');
  if (!card) return;
  const id = card.dataset.favId;
  const isActive = btn.classList.contains('active');

  if (isActive) {
    favorites = favorites.filter(f => f.id !== id);
    btn.classList.remove('active');
    btn.querySelector('svg').setAttribute('fill', 'none');
  } else {
    favorites.push(getProductData(card));
    btn.classList.add('active');
    btn.querySelector('svg').setAttribute('fill', 'currentColor');
  }
  saveFavorites();
  updateFavCount();
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileNavClose = document.getElementById('mobileNavClose');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');

function openMobileNav() {
  if (!mobileNav) return;
  mobileNav.classList.add('open');
  hamburger && hamburger.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  if (!mobileNav) return;
  mobileNav.classList.remove('open');
  hamburger && hamburger.classList.remove('active');
  document.body.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', openMobileNav);
if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMobileNav);

// Menüdeki linklere tıklanınca menüyü kapat
if (mobileNav) {
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });
}

// ===== HERO SLIDER =====
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let current = 0;
let autoSlide;
let isTransitioning = false;

function goTo(i) {
  if (isTransitioning) return;
  isTransitioning = true;
  
  const oldSlide = slides[current];
  
  dots[current].classList.remove('active');
  current = (i + slides.length) % slides.length;
  dots[current].classList.add('active');
  
  const newSlide = slides[current];
  
  // Yeni slide'ı göster ve fade in yap
  newSlide.style.display = 'block';
  newSlide.style.opacity = '0';
  newSlide.style.zIndex = '2';
  
  // Eski slide üstte kalacak
  oldSlide.style.zIndex = '3';
  
  setTimeout(() => {
    // Yeni slide fade in
    newSlide.style.transition = 'opacity 1s ease-in-out';
    newSlide.style.opacity = '1';
    
    // Eski slide fade out
    oldSlide.style.transition = 'opacity 1s ease-in-out';
    oldSlide.style.opacity = '0';
    
    setTimeout(() => {
      oldSlide.classList.remove('active');
      oldSlide.style.display = 'none';
      oldSlide.style.opacity = '';
      oldSlide.style.transition = '';
      oldSlide.style.zIndex = '';
      
      newSlide.classList.add('active');
      newSlide.style.transition = '';
      newSlide.style.zIndex = '';
      
      isTransitioning = false;
    }, 1000);
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
  const header = document.getElementById('header');
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
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

// Sayfa yüklendiğinde WhatsApp bilgi butonlarına ürün adını ekle
document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_NUMBER = '905367071323';
  document.querySelectorAll('.product-card').forEach(card => {
    const productName = card.querySelector('h3')?.textContent || 'perde';
    const message = encodeURIComponent(`Merhaba, "${productName}" ürünüyle ilgileniyorum. Daha fazla bilgi alabilir miyim?`);
    const btn = card.querySelector('.whatsapp-info-btn');
    if (btn) btn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  });
});
