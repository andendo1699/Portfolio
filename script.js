const toggleButton = document.querySelector('.theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (prefersDark) {
  document.body.classList.add('dark');
}

const updateLabel = () => {
  toggleButton.innerHTML = document.body.classList.contains('dark') ? '<span>☀︎</span>' : '<span>◐</span>';
};

updateLabel();

toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  updateLabel();
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.section, .hero-card, .project-card').forEach((card) => {
  card.classList.add('fade');
  observer.observe(card);
});
