// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// ===== Hero neural-network canvas =====
const canvas = document.getElementById('netCanvas');
const ctx = canvas.getContext('2d');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let width, height, nodes;
const NODE_COUNT_BASE = 60;

function resize() {
  width = canvas.width = canvas.offsetWidth * devicePixelRatio;
  height = canvas.height = canvas.offsetHeight * devicePixelRatio;
}

function initNodes() {
  const count = Math.min(NODE_COUNT_BASE, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 18000));
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.35 * devicePixelRatio,
    vy: (Math.random() - 0.5) * 0.35 * devicePixelRatio,
    r: (Math.random() * 1.4 + 0.8) * devicePixelRatio
  }));
}

const colors = ['34,211,238', '167,139,250', '251,191,36'];

function draw() {
  ctx.clearRect(0, 0, width, height);
  const linkDist = 140 * devicePixelRatio;

  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    a.x += a.vx;
    a.y += a.vy;
    if (a.x < 0 || a.x > width) a.vx *= -1;
    if (a.y < 0 || a.y > height) a.vy *= -1;

    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < linkDist) {
        const alpha = (1 - dist / linkDist) * 0.35;
        ctx.strokeStyle = `rgba(${colors[i % colors.length]},${alpha})`;
        ctx.lineWidth = devicePixelRatio * 0.6;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    ctx.fillStyle = `rgba(${colors[i % colors.length]},0.85)`;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fill();
  }

  if (!prefersReducedMotion) requestAnimationFrame(draw);
}

function setupCanvas() {
  resize();
  initNodes();
  ctx.clearRect(0, 0, width, height);
  draw();
}

if (canvas) {
  setupCanvas();
  window.addEventListener('resize', () => {
    resize();
    initNodes();
  });
}

// ===== Navbar background on scroll =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.style.borderBottomColor = 'rgba(34,211,238,0.25)';
  } else {
    navbar.style.borderBottomColor = '';
  }
});

// ===== Close mobile menu after clicking a link =====
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});
