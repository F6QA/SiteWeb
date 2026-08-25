/**
 * @f6qa — Modern Interactive Portfolio & About Me
 * High-performance Vanilla JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all core subsystems
  initSpotlightEffect();
  initTypingEffect();
  initLiveClock();
  init3DTilt();
  initAudioSystem();
  initToastAndCopy();
  initProjectFilters();
  initSkillTabs();
  initTerminal();
  initContactModal();
  initScrollSpy();
  initConfetti();
});

/* ==========================================================================
   1. Dynamic Spotlight Effect on Cards
   ========================================================================== */
function initSpotlightEffect() {
  const cards = document.querySelectorAll('.spotlight-card');
  
  window.addEventListener('mousemove', (e) => {
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   2. Subtitle Typing Effect
   ========================================================================== */
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const words = [
    'Full-Stack Developer',
    'UI / UX Enthusiast',
    'Bot & Automation Architect',
    'Open Source Contributor',
    'Clean Code Artisan'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2200; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400; // Short pause before starting new word
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 800);
}

/* ==========================================================================
   3. Live Clock (Paris Timezone UTC+1/UTC+2)
   ========================================================================== */
function initLiveClock() {
  const clockElement = document.getElementById('live-time-val');
  if (!clockElement) return;

  function updateClock() {
    const now = new Date();
    const options = {
      timeZone: 'Europe/Paris',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    clockElement.textContent = now.toLocaleTimeString('fr-FR', options);
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   4. 3D Tilt Effect on Hero Profile Card
   ========================================================================== */
function init3DTilt() {
  const heroCard = document.getElementById('hero-tilt-card');
  if (!heroCard) return;

  let isHovered = false;

  heroCard.addEventListener('mouseenter', () => {
    isHovered = true;
  });

  heroCard.addEventListener('mousemove', (e) => {
    if (!isHovered) return;
    const rect = heroCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -4.5;
    const rotateY = ((x - centerX) / centerX) * 4.5;

    heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  heroCard.addEventListener('mouseleave', () => {
    isHovered = false;
    heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  });
}

/* ==========================================================================
   5. Web Audio API Futuristic Sound Effects (Toggleable)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudioSystem() {
  const toggleBtn = document.getElementById('audio-toggle-btn');
  const iconOn = document.getElementById('sound-icon-on');
  const iconOff = document.getElementById('sound-icon-off');

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      iconOn.style.display = 'block';
      iconOff.style.display = 'none';
      playBeep(880, 0.08, 'sine');
      showToast('🔊 Effets sonores activés');
    } else {
      iconOn.style.display = 'none';
      iconOff.style.display = 'block';
      showToast('🔇 Effets sonores désactivés');
    }
  });

  // Attach sound to interactive buttons
  document.querySelectorAll('button, .nav-link, .project-link-btn, .social-card').forEach((el) => {
    el.addEventListener('click', () => {
      if (soundEnabled) playClickSound();
    });
  });
}

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playBeep(freq = 440, duration = 0.05, type = 'sine') {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // AudioContext blocked or unsupported
  }
}

function playClickSound() {
  playBeep(620, 0.04, 'triangle');
}

/* ==========================================================================
   6. Toast Notifications & Copy to Clipboard
   ========================================================================== */
function showToast(message, duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
    <span class="toast-text">${message}</span>
    <div class="toast-progress-bar" style="animation-duration: ${duration}ms;"></div>
  `;

  container.appendChild(toast);
  playBeep(900, 0.08, 'sine');

  setTimeout(() => {
    toast.classList.add('toast-hide');
    setTimeout(() => {
      toast.remove();
    }, 350);
  }, duration);
}

function initToastAndCopy() {
  // Elements with data-copy attribute
  document.querySelectorAll('[data-copy]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = el.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copié dans le presse-papier : ${textToCopy}`);
          triggerConfettiBurst(e.clientX, e.clientY);
        }).catch(() => {
          showToast(`Copié : ${textToCopy}`);
        });
      }
    });
  });

  // External URL cards
  document.querySelectorAll('[data-url]').forEach((el) => {
    el.addEventListener('click', () => {
      const url = el.getAttribute('data-url');
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  });
}

/* ==========================================================================
   7. Filter Projects
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const type = card.getAttribute('data-project-type');
        if (filter === 'all' || type === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   8. Filter Skills Tabs
   ========================================================================== */
function initSkillTabs() {
  const tabBtns = document.querySelectorAll('.stack-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');

      skillCards.forEach((card) => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   9. Interactive CLI Terminal
   ========================================================================== */
function initTerminal() {
  const terminalInput = document.getElementById('terminal-input');
  const terminalScreen = document.getElementById('terminal-screen');
  const quickBtns = document.querySelectorAll('.t-quick-btn');

  if (!terminalInput || !terminalScreen) return;

  const commandHistory = [];
  let historyIndex = -1;

  const commands = {
    help: () => `
      <div class="t-line t-output brand">Commandes disponibles :</div>
      <div class="t-line t-output"><span class="t-prompt">whoami</span>       - Informations sur @f6qa</div>
      <div class="t-line t-output"><span class="t-prompt">about</span>        - Vision et parcours</div>
      <div class="t-line t-output"><span class="t-prompt">skills</span>       - Technologies & compétences</div>
      <div class="t-line t-output"><span class="t-prompt">projects</span>     - Liste des projets majeurs</div>
      <div class="t-line t-output"><span class="t-prompt">contact</span>      - Moyen de contact direct</div>
      <div class="t-line t-output"><span class="t-prompt">socials</span>      - Liens vers GitHub, X, Discord</div>
      <div class="t-line t-output"><span class="t-prompt">matrix</span>       - Effet Matrix instantané</div>
      <div class="t-line t-output"><span class="t-prompt">date</span>         - Heure locale du serveur</div>
      <div class="t-line t-output"><span class="t-prompt">echo &lt;text&gt;</span>   - Affiche le texte passé en argument</div>
      <div class="t-line t-output"><span class="t-prompt">sudo</span>         - Tentative d'accès privilégié</div>
      <div class="t-line t-output"><span class="t-prompt">easteregg</span>    - Petite surprise interactive 🎉</div>
      <div class="t-line t-output"><span class="t-prompt">clear</span>        - Nettoie l'écran du terminal</div>
    `,
    whoami: () => `
      <div class="t-line t-output brand">👤 Profil de @f6qa :</div>
      <div class="t-line t-output">Nom     : F6 (@f6qa)</div>
      <div class="t-line t-output">Rôle    : Full-Stack Developer & Tech Creator</div>
      <div class="t-line t-output">Statut  : 🟢 En ligne, ouvert aux projets & collaborations</div>
      <div class="t-line t-output">Local   : Paris, France (UTC+1)</div>
    `,
    about: () => `
      <div class="t-line t-output">
        Développeur passionné par la vitesse, le design soigné et les architectures modulaires.
        Plus de 5 ans d'expérience dans la création d'applications web, d'APIs et de bots.
      </div>
    `,
    skills: () => `
      <div class="t-line t-output brand">⚡ Stack Principale :</div>
      <div class="t-line t-output">• Frontend : TypeScript, Next.js, React, Vanilla CSS3, Web Components</div>
      <div class="t-line t-output">• Backend  : Node.js, Express, Python, PostgreSQL, Redis, REST/GraphQL</div>
      <div class="t-line t-output">• DevOps   : Docker, Linux, Git, GitHub Actions, NGINX, Cloudflare</div>
    `,
    projects: () => `
      <div class="t-line t-output brand">🚀 Projets Phares :</div>
      <div class="t-line t-output">1. [Nexus]   - Analytics Engine temps réel (Next.js & WebSockets)</div>
      <div class="t-line t-output">2. [Aura]    - Bot Discord modulaire haute performance (Redis & Node)</div>
      <div class="t-line t-output">3. [Glow UI] - Kit de composants graphiques glassmorphism</div>
    `,
    contact: () => {
      setTimeout(() => {
        openContactModal();
      }, 500);
      return `
        <div class="t-line t-output success">✓ Ouverture de la boîte de contact...</div>
        <div class="t-line t-output">Discord: @f6qa | Email: contact@f6qa.dev</div>
      `;
    },
    socials: () => `
      <div class="t-line t-output brand">🌐 Réseaux de @f6qa :</div>
      <div class="t-line t-output">• GitHub  : https://github.com/f6qa</div>
      <div class="t-line t-output">• Discord : @f6qa</div>
      <div class="t-line t-output">• X       : @f6qa</div>
      <div class="t-line t-output">• Email   : contact@f6qa.dev</div>
    `,
    matrix: () => {
      triggerConfettiBurst(window.innerWidth / 2, window.innerHeight / 2);
      return `
        <div class="t-line t-output success">
          01000110 00110110 01110001 01100001<br>
          Wake up, Neo... The Matrix has you. @f6qa is watching. 🐇
        </div>
      `;
    },
    date: () => `
      <div class="t-line t-output">${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })} (Europe/Paris)</div>
    `,
    sudo: () => `
      <div class="t-line t-output error">❌ Erreur 403 : Permission refusée. Vous n'avez pas les droits root sur @f6qa ! 😉</div>
    `,
    easteregg: () => {
      triggerConfettiBurst(window.innerWidth / 2, window.innerHeight / 3);
      return `
        <div class="t-line t-output success">
          🎉 Félicitations ! Vous avez débloqué le mode secret de @f6qa.
          Merci d'avoir pris le temps d'explorer ce site !
        </div>
      `;
    }
  };

  function executeCommand(rawCmd) {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    commandHistory.push(trimmed);
    historyIndex = commandHistory.length;

    // Create prompt line
    const userLine = document.createElement('div');
    userLine.className = 't-line';
    userLine.innerHTML = `<span class="t-user">guest@f6qa</span><span class="t-prompt">:~$</span> <span class="t-cmd">${escapeHtml(trimmed)}</span>`;
    
    // Insert before the input line
    const inputContainer = terminalScreen.querySelector('.t-command-line-input');
    terminalScreen.insertBefore(userLine, inputContainer);

    const parts = trimmed.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    if (mainCmd === 'clear') {
      const outputLines = terminalScreen.querySelectorAll('.t-line');
      outputLines.forEach(l => l.remove());
    } else if (mainCmd === 'echo') {
      const outLine = document.createElement('div');
      outLine.className = 't-line t-output';
      outLine.textContent = args || '';
      terminalScreen.insertBefore(outLine, inputContainer);
    } else if (commands[mainCmd]) {
      const result = commands[mainCmd]();
      if (result) {
        const outBox = document.createElement('div');
        outBox.innerHTML = result;
        terminalScreen.insertBefore(outBox, inputContainer);
      }
    } else {
      const errLine = document.createElement('div');
      errLine.className = 't-line t-output error';
      errLine.innerHTML = `Commande introuvable : '${escapeHtml(mainCmd)}'. Tapez <span class="t-prompt">'help'</span> pour la liste.`;
      terminalScreen.insertBefore(errLine, inputContainer);
    }

    terminalScreen.scrollTop = terminalScreen.scrollHeight;
    terminalInput.value = '';
    playBeep(750, 0.04, 'sine');
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(terminalInput.value);
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex] || '';
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
    }
  });

  quickBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
      }
    });
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

/* ==========================================================================
   10. Contact Modal
   ========================================================================== */
function openContactModal() {
  const modal = document.getElementById('contact-modal');
  if (!modal) return;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeContactModal() {
  const modal = document.getElementById('contact-modal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function initContactModal() {
  const modal = document.getElementById('contact-modal');
  const openBtn = document.getElementById('open-contact-btn');
  const heroTrigger = document.getElementById('hero-contact-trigger');
  const closeBtn = document.getElementById('modal-close-btn');
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('btn-submit-msg');

  if (openBtn) openBtn.addEventListener('click', openContactModal);
  if (heroTrigger) heroTrigger.addEventListener('click', openContactModal);
  if (closeBtn) closeBtn.addEventListener('click', closeContactModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeContactModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeContactModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const msg = document.getElementById('contact-message').value;

      if (!name || !email || !msg) return;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Envoi en cours...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Envoyer le message</span>`;
        form.reset();
        closeContactModal();
        showToast(`Message envoyé ! Merci ${name}, je vous répondrai très vite.`);
        triggerConfettiBurst(window.innerWidth / 2, window.innerHeight / 2);
      }, 900);
    });
  }
}

/* ==========================================================================
   11. Scroll Spy & Smooth Scroll Navigation
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   12. Confetti Particle Engine
   ========================================================================== */
let confettiParticles = [];
let confettiCtx = null;
let animFrameId = null;

function initConfetti() {
  const canvas = document.getElementById('fx-canvas');
  if (!canvas) return;

  confettiCtx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
}

function triggerConfettiBurst(originX, originY) {
  if (!confettiCtx) return;

  const count = 45;
  const colors = ['#6366f1', '#a855f7', '#06b6d4', '#ec4899', '#38bdf8', '#ffffff'];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 3;

    confettiParticles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.02 + 0.015,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10
    });
  }

  if (!animFrameId) {
    renderConfetti();
  }
}

function renderConfetti() {
  if (!confettiCtx) return;

  confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.25; // gravity
    p.alpha -= p.decay;
    p.rotation += p.rotSpeed;

    if (p.alpha <= 0) {
      confettiParticles.splice(i, 1);
      continue;
    }

    confettiCtx.save();
    confettiCtx.globalAlpha = p.alpha;
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate((p.rotation * Math.PI) / 180);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    confettiCtx.restore();
  }

  if (confettiParticles.length > 0) {
    animFrameId = requestAnimationFrame(renderConfetti);
  } else {
    animFrameId = null;
  }
}
