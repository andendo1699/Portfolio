// Mouse-following background effect + creative parallax
const mouseBg = document.querySelector('.mouse-bg');
const customCursor = document.querySelector('.custom-cursor');
const cursorTrail = document.querySelector('.cursor-trail');
const root = document.documentElement;
let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;
let trailX = cursorX;
let trailY = cursorY;

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

// Custom Cursor
const updateCustomCursor = () => {
  if (customCursor) {
    customCursor.style.left = `${cursorX}px`;
    customCursor.style.top = `${cursorY}px`;
  }
  
  // Smooth trail
  trailX += (cursorX - trailX) * 0.15;
  trailY += (cursorY - trailY) * 0.15;
  
  if (cursorTrail) {
    cursorTrail.style.left = `${trailX}px`;
    cursorTrail.style.top = `${trailY}px`;
  }
  
  requestAnimationFrame(updateCustomCursor);
};

updateCustomCursor();

document.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  window.requestAnimationFrame(renderMouseEffects);
});

// Cursor expand on hover
const expandCursorElements = document.querySelectorAll('a, button, .btn, .magnetic-card');
expandCursorElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (customCursor) customCursor.classList.add('expand');
  });
  el.addEventListener('mouseleave', () => {
    if (customCursor) customCursor.classList.remove('expand');
  });
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

// Particles Canvas Animation
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 50;

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }

    draw() {
      ctx.fillStyle = `rgba(63, 140, 60, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      
      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          ctx.strokeStyle = `rgba(63, 140, 60, ${0.2 * (1 - distance / 150)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Magnetic Effect for Cards and Buttons
const magneticElements = document.querySelectorAll('.magnetic-card, .btn');
magneticElements.forEach(element => {
  element.addEventListener('mousemove', (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const moveX = x * 0.15;
    const moveY = y * 0.15;
    
    element.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
  });
  
  element.addEventListener('mouseleave', () => {
    element.style.transform = 'translate(0, 0) scale(1)';
  });
});

// 3D Tilt Effect on Cards
const tiltCards = document.querySelectorAll('.project-card, .about-card, .skill-card');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.01)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
  });
});

// Counter Animation
const counters = document.querySelectorAll('.counter');
let countersAnimated = false;

const animateCounters = () => {
  if (countersAnimated) return;
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    updateCounter();
  });
  
  countersAnimated = true;
};

// Check if counters are in view
const checkCounters = () => {
  const counterSection = document.querySelector('.hero-highlights');
  if (counterSection) {
    const rect = counterSection.getBoundingClientRect();
    const viewHeight = window.innerHeight || document.documentElement.clientHeight;
    
    if (rect.top < viewHeight * 0.8 && rect.bottom > 0) {
      animateCounters();
    }
  }
};

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
    checkCounters();
  });
} else {
  window.addEventListener('scroll', revealInView, { passive: true });
  window.addEventListener('scroll', updateMessengerVisibility, { passive: true });
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('scroll', checkCounters, { passive: true });
}

revealInView();
updateMessengerVisibility();
updateScrollProgress();
checkCounters();
renderMouseEffects();

window.addEventListener('load', () => {
  const loader = document.querySelector('.page-loader');
  
  // Wait for loader animation to complete
  setTimeout(() => {
    if (loader) {
      loader.classList.add('loaded');
    }
    
    // Then trigger page animations
    setTimeout(() => {
      document.body.classList.add('is-loaded');
    }, 300);
  }, 2200);
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

// Text Scramble Effect for Section Titles
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Apply scramble effect on section titles when they come into view
const sectionTitles = document.querySelectorAll('.section-title h2');
const scrambledTitles = new Set();

const scrambleOnView = () => {
  const viewH = window.innerHeight || document.documentElement.clientHeight;
  
  sectionTitles.forEach((title) => {
    if (scrambledTitles.has(title)) return;
    
    const rect = title.getBoundingClientRect();
    if (rect.top < viewH * 0.85) {
      scrambledTitles.add(title);
      const originalText = title.innerText;
      const fx = new TextScramble(title);
      fx.setText(originalText);
    }
  });
};

if (scrollbar) {
  scrollbar.addListener(scrambleOnView);
} else {
  window.addEventListener('scroll', scrambleOnView, { passive: true });
}

scrambleOnView();
