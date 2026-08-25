/**
 * @f6qa — Hello World Minimalist Interactivity (iOS & Mobile Touch Optimized)
 */

document.addEventListener('DOMContentLoaded', () => {
  const bounceBox = document.getElementById('bounce-box');
  const toast = document.getElementById('toast');
  const canvas = document.getElementById('sparkle-canvas');
  let ctx = canvas ? canvas.getContext('2d') : null;

  // Setup Canvas with Retina / High-DPI Support
  let particles = [];
  function resize() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    if (ctx) ctx.scale(dpr, dpr);
  }
  window.addEventListener('resize', resize);
  resize();

  // Click & Touch bounce reaction
  if (bounceBox) {
    const triggerAction = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : (e.clientX || window.innerWidth / 2);
      const clientY = e.touches ? e.touches[0].clientY : (e.clientY || window.innerHeight / 2);
      
      triggerSparkles(clientX, clientY);
      bounceBox.style.animation = 'none';
      void bounceBox.offsetWidth; // Trigger reflow
      bounceBox.style.animation = 'bounceAnim 1.2s cubic-bezier(0.28, 0.84, 0.42, 1)';
      setTimeout(() => {
        bounceBox.style.animation = 'bounceAnim 2.2s cubic-bezier(0.28, 0.84, 0.42, 1) infinite';
      }, 1200);
    };

    bounceBox.addEventListener('pointerdown', triggerAction);
  }

  // Copy to clipboard handlers (Supports iOS Safari)
  document.querySelectorAll('[data-copy]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const text = el.getAttribute('data-copy');
      if (text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            showToast(`Copié : ${text}`);
            triggerSparkles(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2);
          }).catch(() => fallbackCopy(text));
        } else {
          fallbackCopy(text);
        }
      }
    });
  });

  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`Copié : ${text}`);
    } catch (err) {
      showToast(text);
    }
    document.body.removeChild(textArea);
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }

  function triggerSparkles(x, y) {
    if (!ctx) return;
    const colors = ['#ffffff', '#f4f4f5', '#d4d4d8', '#a1a1aa'];
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        size: Math.random() * 3.5 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.03 + 0.02
      });
    }
    if (!animId) renderParticles();
  }

  let animId = null;
  function renderParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15; // gravity
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (particles.length > 0) {
      animId = requestAnimationFrame(renderParticles);
    } else {
      animId = null;
    }
  }
});
