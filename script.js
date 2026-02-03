// Mouse-following background effect + creative parallax
const mouseBg = document.querySelector('.mouse-bg');
const root = document.documentElement;
let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;

const updateCursorVars = () => {
  root.style.setProperty('--cursor-x', `${cursorX}px`);
  root.style.setProperty('--cursor-y', `${cursorY}px`);
};

const updateParallax = () => {
  const nx = (cursorX / window.innerWidth) * 2 - 1;
  const ny = (cursorY / window.innerHeight) * 2 - 1;
  root.style.setProperty('--parallax-x', nx.toFixed(3));
  root.style.setProperty('--parallax-y', ny.toFixed(3));
};

const renderMouseEffects = () => {
  updateCursorVars();
  updateParallax();
  if (mouseBg) {
    mouseBg.style.background = `radial-gradient(600px circle at ${cursorX}px ${cursorY}px, var(--glow), transparent 80%)`;
  }
};

document.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  window.requestAnimationFrame(renderMouseEffects);
});
const toggleButton = document.querySelector('.theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (prefersDark) {
  document.body.classList.add('dark');
}

const updateLabel = () => {
  toggleButton.innerHTML = document.body.classList.contains('dark') ? '<span>☀︎</span>' : '<span>◐</span>';
};

updateLabel();

const setStagger = (elements) => {
  elements.forEach((el, index) => {
    el.style.setProperty('--i', index);
  });
};

const wrapWords = (element, startIndex = 0) => {
  let index = startIndex;
  const nodes = Array.from(element.childNodes);
  nodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      const parts = text.split(/(\s+)/);
      const fragment = document.createDocumentFragment();

      parts.forEach((part) => {
        if (!part) return;
        if (/\s+/.test(part)) {
          fragment.appendChild(document.createTextNode(part));
        } else {
          const span = document.createElement('span');
          span.className = 'word';
          span.style.setProperty('--i', index);
          span.textContent = part;
          fragment.appendChild(span);
          index += 1;
        }
      });

      node.replaceWith(fragment);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node;
      el.classList.add('word');
      el.style.setProperty('--i', index);
      index += 1;
    }
  });

  return index;
};

const heroTitle = document.querySelector('.hero-text h1');
const heroLead = document.querySelector('.hero-text .lead');
if (heroTitle && !heroTitle.querySelector('.word')) {
  let wordIndex = wrapWords(heroTitle, 0);
  if (heroLead && !heroLead.querySelector('.word')) {
    wrapWords(heroLead, wordIndex);
  }
}

setStagger(document.querySelectorAll('.nav-links a'));

toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  updateLabel();
});

const revealTargets = document.querySelectorAll('.section, .hero-card, .project-card');
revealTargets.forEach((card) => {
  card.classList.add('fade');
});

const revealInView = () => {
  const viewH = window.innerHeight || document.documentElement.clientHeight;
  revealTargets.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < viewH * 0.85) {
      el.classList.add('reveal');
    }
  });
};

let scrollbar = null;
const scrollContainer = document.querySelector('#scroll-container');
const floatingSocials = document.querySelector('.float-socials');

const updateMessengerVisibility = () => {
  if (!floatingSocials) return;
  const scrollTop = scrollbar ? scrollbar.scrollTop : window.scrollY;
  const shouldShow = scrollTop > 120;
  floatingSocials.classList.toggle('is-visible', shouldShow);
};

const updateScrollProgress = () => {
  const maxScroll = scrollbar ? scrollbar.limit.y : document.documentElement.scrollHeight - window.innerHeight;
  const scrollTop = scrollbar ? scrollbar.scrollTop : window.scrollY;
  const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
  root.style.setProperty('--scroll-progress', progress.toFixed(3));
};

if (window.Scrollbar && scrollContainer) {
  scrollbar = Scrollbar.init(scrollContainer, {
    damping: 0.08,
    thumbMinSize: 30,
    renderByPixels: true,
    alwaysShowTracks: false,
  });

  scrollbar.addListener(() => {
    revealInView();
    updateMessengerVisibility();
    updateScrollProgress();
  });
} else {
  window.addEventListener('scroll', revealInView, { passive: true });
  window.addEventListener('scroll', updateMessengerVisibility, { passive: true });
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
}

revealInView();
updateMessengerVisibility();
updateScrollProgress();
renderMouseEffects();

window.addEventListener('load', () => {
  window.setTimeout(() => {
    document.body.classList.add('is-loaded');
  }, 120);
});

// Smooth anchor scrolling for custom scrollbar
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();

    if (scrollbar) {
      scrollbar.scrollIntoView(target, {
        offsetTop: 0,
        damping: 0.08,
      });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
