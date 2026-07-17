const root = document.documentElement;
const header = document.querySelector('.site-header');
const themeToggle = document.querySelector('.theme-toggle');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');
const researchDropdown = document.querySelector('.nav-dropdown');
const year = document.querySelector('#year');

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  root.dataset.theme = 'dark';
}

themeToggle?.addEventListener('click', () => {
  const dark = root.dataset.theme === 'dark';
  if (dark) {
    delete root.dataset.theme;
    localStorage.setItem('theme', 'light');
  } else {
    root.dataset.theme = 'dark';
    localStorage.setItem('theme', 'dark');
  }
});

function closeMobileNavigation() {
  nav?.classList.remove('open');
  document.body.classList.remove('nav-open');
  navToggle?.setAttribute('aria-expanded', 'false');
  navToggle?.setAttribute('aria-label', 'Open navigation');
}

function closeResearchDropdown() {
  researchDropdown?.removeAttribute('open');
}

navToggle?.addEventListener('click', () => {
  const open = nav?.classList.toggle('open');
  document.body.classList.toggle('nav-open', Boolean(open));
  navToggle.setAttribute('aria-expanded', String(Boolean(open)));
  navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    closeResearchDropdown();
    closeMobileNavigation();
  });
});

document.addEventListener('click', (event) => {
  if (researchDropdown?.open && !researchDropdown.contains(event.target)) {
    closeResearchDropdown();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const summary = researchDropdown?.querySelector('summary');
    const dropdownWasOpen = Boolean(researchDropdown?.open);
    closeResearchDropdown();
    closeMobileNavigation();
    if (dropdownWasOpen) summary?.focus();
  }
});

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
if (year) year.textContent = new Date().getFullYear();
