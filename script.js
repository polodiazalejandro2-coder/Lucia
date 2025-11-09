// script.js - merged interactivity: smooth scroll, reveal on scroll, gallery modal, year

// Update year
const yearElem = document.getElementById('year');
if (yearElem) yearElem.textContent = new Date().getFullYear();

// Smooth scroll for links with data-scroll
document.querySelectorAll('a[data-scroll]').forEach(a => {
  a.addEventListener('click', function(e){
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// REVEAL ON SCROLL (sutil y elegante)
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      obs.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});

// Elements to reveal
const revealables = document.querySelectorAll('.reveal');
revealables.forEach(el => revealObserver.observe(el));

// GALLERY & MODAL
const gallery = document.getElementById('gallery');
const modal = document.getElementById('img-modal');
const modalImg = document.getElementById('modal-img');
const modalCaption = document.getElementById('modal-caption');
const modalClose = document.getElementById('modal-close');
const modalPrev = document.getElementById('modal-prev');
const modalNext = document.getElementById('modal-next');

let photos = [];
let currentIndex = -1;

function refreshPhotos(){
  photos = Array.from(document.querySelectorAll('#gallery .photo img')).map(img => ({
    src: img.getAttribute('src'),
    alt: img.getAttribute('alt') || '',
    caption: img.dataset.caption || ''
  }));
}
refreshPhotos();

function openModal(index){
  if (index < 0 || index >= photos.length) return;
  currentIndex = index;
  const p = photos[index];
  modalImg.src = p.src;
  modalImg.alt = p.alt;
  modalCaption.textContent = p.caption || '';
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modalClose && modalClose.focus();
}

function closeModal(){
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  modalImg.src = '';
  currentIndex = -1;
}
function showNext(){ openModal((currentIndex + 1) % photos.length); }
function showPrev(){ openModal((currentIndex - 1 + photos.length) % photos.length); }

// Attach click handlers to figures
document.querySelectorAll('#gallery .photo').forEach((figure, idx) => {
  figure.addEventListener('click', () => openModal(idx));
  figure.addEventListener('keydown', (e) => { if (e.key === 'Enter') openModal(idx); });
});

// Modal controls
modalClose && modalClose.addEventListener('click', closeModal);
modalNext && modalNext.addEventListener('click', showNext);
modalPrev && modalPrev.addEventListener('click', showPrev);

// Close clicking outside
modal && modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (modal.getAttribute('aria-hidden') === 'false') {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  }
});

// Lazy-load images
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img').forEach(img => {
    if ('loading' in HTMLImageElement.prototype) img.loading = 'lazy';
  });
});
