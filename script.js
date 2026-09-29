/* ============================================
   ANNIVERSARY WEBSITE — SCRIPT.JS
   High-performance, mobile-optimized romantic experience
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ========== ELEMENTS ========== */
  const startScreen    = document.getElementById('start-screen');
  const startBtn       = document.getElementById('start-btn');
  const mainContent    = document.getElementById('main-content');
  const audio          = document.getElementById('bg-music');
  const musicToggle    = document.getElementById('music-toggle');
  const scrollProgress = document.getElementById('scroll-progress');
  const heartsCanvas   = document.getElementById('hearts-canvas');
  const ctx            = heartsCanvas.getContext('2d');

  /* ========== CONFIG ========== */
  // ★ RELATIONSHIP START DATE: March 30, 2026 (6 Months Anniversary on Sept 30) ★
  const RELATIONSHIP_START = new Date('2026-03-30T00:00:00');

  const LOVE_MESSAGES = [
    'I love you 💜', 'You are my everything ❤️', 'Forever together 💕',
    'My heart is yours 💖', 'I adore you 🥰', 'You are gorgeous ✨',
    'My love 🌸', 'Endlessly yours 💫', 'You are my happiness 🦋', 'Love beyond words 🌹'
  ];

  /* ========== STATE ========== */
  let isPlaying = false;
  let hearts = [];

  /* ========== DOUBLE CLICK / TAP LOVE POPUP ========== */
  document.addEventListener('dblclick', (e) => {
    const msg = LOVE_MESSAGES[Math.floor(Math.random() * LOVE_MESSAGES.length)];
    const popup = document.createElement('div');
    popup.className = 'love-popup';
    popup.textContent = msg;
    popup.style.left = e.clientX + 'px';
    popup.style.top = e.clientY + 'px';
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2200);
  });

  /* ========== LIGHTBOX ========== */
  function initLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close">✕</button>
      <img class="lightbox-img" src="" alt="Photo" />
    `;
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('.lightbox-img');
    const lbClose = lightbox.querySelector('.lightbox-close');

    document.querySelectorAll('.photo-grid-item img').forEach(img => {
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        lbImg.src = img.src;
        lightbox.classList.add('active');
      });
    });

    lbClose.addEventListener('click', (e) => {
      e.stopPropagation();
      lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        e.stopPropagation();
        lightbox.classList.remove('active');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') lightbox.classList.remove('active');
    });
  }

  /* ========== VIDEO AUTOPLAY ON SCROLL ========== */
  function initVideoAutoplay() {
    const videos = document.querySelectorAll('.story-video[data-autoplay]');

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        const overlay = video.parentElement.querySelector('.video-play-overlay');
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          video.play().then(() => {
            if (overlay) overlay.classList.add('hidden');
          }).catch(() => {});
        } else {
          video.pause();
          if (overlay) overlay.classList.remove('hidden');
        }
      });
    }, { threshold: [0.25] });

    document.querySelectorAll('.video-play-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        e.stopPropagation();
        const video = overlay.parentElement.querySelector('video');
        if (!video) return;
        if (video.paused) {
          video.play().then(() => overlay.classList.add('hidden')).catch(() => {});
        } else {
          video.pause();
          overlay.classList.remove('hidden');
        }
      });
    });

    videos.forEach(video => {
      video.addEventListener('click', (e) => {
        e.stopPropagation();
        const overlay = video.parentElement.querySelector('.video-play-overlay');
        if (!video.paused) {
          video.pause();
          if (overlay) overlay.classList.remove('hidden');
        } else {
          video.play().then(() => { if (overlay) overlay.classList.add('hidden'); }).catch(() => {});
        }
      });

      const trimEnd = parseFloat(video.dataset.trimEnd);
      if (trimEnd > 0) {
        video.addEventListener('timeupdate', () => {
          if (video.duration && video.currentTime >= video.duration - trimEnd) {
            video.currentTime = 0;
          }
        });
      }

      videoObserver.observe(video);
    });
  }

  /* ========== LETTER ANIMATION ========== */
  function initLetterAnimation() {
    document.querySelectorAll('.section-title').forEach(title => {
      const text = title.textContent;
      title.innerHTML = '';
      let ci = 0;
      for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
        span.style.animationDelay = (0.3 + ci * 0.02) + 's';
        if (text[i] !== ' ') ci++;
        title.appendChild(span);
      }
    });
  }

  /* ========== PRELOAD ALL MEDIA + LOADING SCREEN ========== */
  const loadingScreen  = document.getElementById('loading-screen');
  const loadingBar     = document.getElementById('loading-bar');
  const loadingPercent = document.getElementById('loading-percent');

  function preloadAllMedia(onComplete) {
    const imageSrcs = [
      'assets/images/hero_main.jpeg',
      'assets/images/first_moments_1.jpg',
      'assets/images/first_moments_2.jpg',
      'assets/images/first_moments_3.jpg',
      'assets/images/happy_moments_1.jpg',
      'assets/images/happy_moments_2.jpg',
      'assets/images/happy_moments_3.jpg',
      'assets/images/happy_moments_4.jpg',
      'assets/images/warm_memories_1.jpg',
      'assets/images/warm_memories_2.jpg',
      'assets/images/warm_memories_3.jpg',
      'assets/images/every_moment_1.jpg',
      'assets/images/every_moment_2.jpg',
      'assets/images/every_moment_3.jpg',
      'assets/images/finale_us_now.jpg'
    ];
    const videoEls = Array.from(document.querySelectorAll('.story-video'));

    const total = imageSrcs.length + videoEls.length;
    let loaded = 0;

    function tick() {
      loaded++;
      const pct = Math.round((loaded / total) * 100);
      loadingBar.style.width = pct + '%';
      loadingPercent.textContent = pct + '%';
      if (loaded >= total) {
        setTimeout(() => {
          loadingScreen.classList.add('fade-out');
          setTimeout(() => {
            loadingScreen.classList.remove('active', 'fade-out');
            loadingScreen.style.display = 'none';
            onComplete();
          }, 500);
        }, 200);
      }
    }

    imageSrcs.forEach(src => {
      const img = new Image();
      img.onload  = tick;
      img.onerror = tick;
      img.src = src;
    });

    videoEls.forEach(video => {
      video.preload = 'auto';
      if (video.readyState >= 3) {
        tick();
        return;
      }
      const onReady = () => {
        video.removeEventListener('canplaythrough', onReady);
        video.removeEventListener('error', onReady);
        tick();
      };
      video.addEventListener('canplaythrough', onReady, { once: true });
      video.addEventListener('error', onReady, { once: true });
      video.load();
    });
  }

  /* ========== START BUTTON ========== */
  startBtn.addEventListener('click', (e) => {
    e.stopPropagation();

    startScreen.classList.add('hidden');
    setTimeout(() => { startScreen.style.display = 'none'; }, 600);

    loadingScreen.classList.add('active');

    preloadAllMedia(() => {
      mainContent.classList.add('visible');
      playMusic();
      musicToggle.classList.add('visible');
      initScrollObserver();
      initHeartsCanvas();
      updateTimer();
      setInterval(updateTimer, 1000);
      initLetterAnimation();
      initLightbox();
      initVideoAutoplay();
      initSpinWheel();
    });
  });

  /* ========== MUSIC ========== */
  function playMusic() {
    audio.volume = 0.35;
    audio.play().then(() => {
      isPlaying = true;
      musicToggle.classList.add('playing');
    }).catch(err => console.log('Auto-play blocked:', err));
  }

  musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
      audio.pause(); isPlaying = false;
      musicToggle.classList.remove('playing');
    } else {
      audio.play(); isPlaying = true;
      musicToggle.classList.add('playing');
    }
  });


  /* ========== SCROLL PROGRESS ========== */
  window.addEventListener('scroll', () => {
    const progress = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (progress > 0 ? (window.scrollY / progress) * 100 : 0) + '%';
  }, { passive: true });

  /* ========== SCROLL OBSERVER ========== */
  function initScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay;
          if (delay) {
            setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
          } else {
            entry.target.classList.add('visible');
          }

          if (entry.target.id === 'section-changes' || entry.target.closest('#section-changes')) {
            startJourneyTypewriter();
          }
        }
      });
    }, { root: null, rootMargin: '0px 0px -30px 0px', threshold: 0.1 });

    document.querySelectorAll(
      '.story-card, #section-changes, .photo-grid-title, .photo-grid-item, .video-card, .timer-title, .timer-container, .spin-card, .final-content, .final-photo-wrapper'
    ).forEach(el => observer.observe(el));
  }

  /* ========== JOURNEY TYPEWRITER EFFECT ========== */
  let journeyTyped = false;
  function startJourneyTypewriter() {
    if (journeyTyped) return;
    journeyTyped = true;

    const el = document.getElementById('journey-text');
    if (!el) return;

    const lines = [
      { text: "We’ve grown so much together.", pauseAfter: 400 },
      { text: "We fought through your past, our long distance, and your father’s loss.", pauseAfter: 450 },
      { text: "We fought through my job and all my problems… and then here we are.", pauseAfter: 450 },
      { text: "Thank you for being with me through so much. 🤍", highlight: true, pauseAfter: 0 }
    ];

    el.innerHTML = '<span id="journey-typed-content"></span><span class="typewriter-cursor" id="journey-cursor"></span>';
    const contentEl = document.getElementById('journey-typed-content');
    const cursorEl = document.getElementById('journey-cursor');

    let currentLineIndex = 0;
    let currentCharIndex = 0;
    let currentSpan = null;

    setTimeout(() => {
      typeNextChar();
    }, 400);

    function typeNextChar() {
      if (currentLineIndex >= lines.length) {
        setTimeout(() => {
          if (cursorEl) cursorEl.classList.add('hidden');
        }, 2000);
        return;
      }

      const line = lines[currentLineIndex];

      if (currentCharIndex === 0) {
        currentSpan = document.createElement('span');
        if (line.highlight) {
          currentSpan.className = 'typewriter-highlight';
        }
        contentEl.appendChild(currentSpan);
      }

      if (currentCharIndex < line.text.length) {
        currentSpan.textContent += line.text.charAt(currentCharIndex);
        currentCharIndex++;
        const speed = 25 + Math.random() * 15;
        setTimeout(typeNextChar, speed);
      } else {
        currentLineIndex++;
        currentCharIndex = 0;
        if (currentLineIndex < lines.length) {
          contentEl.appendChild(document.createElement('br'));
          contentEl.appendChild(document.createElement('br'));
          setTimeout(typeNextChar, line.pauseAfter);
        } else {
          typeNextChar();
        }
      }
    }
  }

  /* ========== TIMER ========== */
  function updateTimer() {
    const diff = Date.now() - RELATIONSHIP_START.getTime();
    if (diff < 0) return;
    const ts = Math.floor(diff / 1000);
    animateTimerValue('timer-days',  Math.floor(ts / 86400));
    animateTimerValue('timer-hours', Math.floor((ts % 86400) / 3600));
    animateTimerValue('timer-mins',  Math.floor((ts % 3600) / 60));
    animateTimerValue('timer-secs',  ts % 60);
  }

  function animateTimerValue(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    const s = String(val);
    if (el.textContent !== s) {
      el.textContent = s;
      el.classList.remove('tick');
      void el.offsetWidth;
      el.classList.add('tick');
    }
  }

  /* ========== HEARTS CANVAS (High Performance) ========== */
  function initHeartsCanvas() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    setInterval(spawnHeart, 1500);
    animateHeartsLoop();
  }

  function resizeCanvas() {
    heartsCanvas.width = window.innerWidth;
    heartsCanvas.height = window.innerHeight;
  }

  function spawnHeart() {
    if (hearts.length > 18) return;
    hearts.push({
      x: Math.random() * heartsCanvas.width,
      y: heartsCanvas.height + 20,
      size: 10 + Math.random() * 16,
      speedY: 0.4 + Math.random() * 0.8,
      speedX: (Math.random()-0.5) * 0.4,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.02,
      wobbleAmp: 0.3 + Math.random() * 0.5,
      opacity: 0.2 + Math.random() * 0.25,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random()-0.5) * 0.015,
      color: ['#e8457a','#b388eb','#f2a6c9','#c084fc','#fda4af'][Math.floor(Math.random()*5)]
    });
  }

  function drawHeart(x, y, size, rotation, color, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.beginPath();
    const s = size / 15;
    ctx.moveTo(0, -s*3);
    ctx.bezierCurveTo(-s*7.5, -s*12, -s*15, -s*1.5, 0, s*9);
    ctx.bezierCurveTo(s*15, -s*1.5, s*7.5, -s*12, 0, -s*3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function animateHeartsLoop() {
    ctx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);
    hearts = hearts.filter(h => {
      h.y -= h.speedY;
      h.wobble += h.wobbleSpeed;
      h.x += h.speedX + Math.sin(h.wobble) * h.wobbleAmp;
      h.rotation += h.rotSpeed;
      h.opacity -= 0.0006;
      if (h.y < -40 || h.opacity <= 0) return false;
      drawHeart(h.x, h.y, h.size, h.rotation, h.color, h.opacity);
      return true;
    });
    requestAnimationFrame(animateHeartsLoop);
  }

  /* ========== SPIN TO WIN WHEEL ========== */
  function initSpinWheel() {
    const canvas = document.getElementById('wheel-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const spinnerBox = document.getElementById('wheel-spinner-box');
    const spinBtn = document.getElementById('spin-btn');
    const pointer = document.getElementById('wheel-pointer');
    const modal = document.getElementById('prize-modal');
    const prizeNameEl = document.getElementById('prize-name');
    const prizeDescEl = document.getElementById('prize-desc');
    const prizeEmojiEl = document.getElementById('prize-emoji');
    const claimBtn = document.getElementById('prize-claim-btn');
    const againBtn = document.getElementById('prize-again-btn');

    const prizes = [
      {
        label: "Kiss Coupon",
        color: "#6e3fa3",
        emoji: "💋",
        desc: "Valid forever! Redeemable anytime anywhere with unlimited hugs! 😘"
      },
      {
        label: "Love Letter",
        color: "#8f5889",
        emoji: "💌",
        desc: "A special handwritten heartfelt love note just for you! 📝💖"
      },
      {
        label: "Movie Night",
        color: "#be5379",
        emoji: "🎬",
        desc: "Your choice of movie, endless cozy cuddles, favorite snacks, and all my love! 🍿🛋️"
      },
      {
        label: "Massage Session",
        color: "#46b3b5",
        emoji: "💆‍♀️",
        desc: "A relaxing head & shoulder massage to melt all your stress away! ✨💆"
      },
      {
        label: "Passionate Kiss",
        color: "#b97e85",
        emoji: "💖",
        desc: "A long, unforgettable romantic kiss just for you! 💕"
      },
      {
        label: "Chocolate Box!",
        color: "#f7d354",
        emoji: "🍫",
        desc: "Sweet chocolates for the sweetest person in the entire world! 🍬😋"
      },
      {
        label: "A big hug",
        color: "#7ad8a9",
        emoji: "🫂",
        desc: "A tight, warm, 60-second hug in my arms to remind you how loved you are. 🌸🤗"
      }
    ];

    const totalSlices = prizes.length;
    const sliceAngle = (Math.PI * 2) / totalSlices;
    const sliceDeg = 360 / totalSlices;

    function drawWheel() {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Start from 12 o'clock (-PI / 2)
      const startAngle = -Math.PI / 2;

      // 1. Draw Slices
      for (let i = 0; i < totalSlices; i++) {
        const angle = startAngle + i * sliceAngle;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, 210, angle, angle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = prizes[i].color;
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Draw Sector Text
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle + sliceAngle / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 4;
        ctx.font = "bold 16.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

        const text = prizes[i].label;
        if (text === "A big hug") {
          ctx.fillText("A big", 130, -9);
          ctx.fillText("hug", 130, 11);
        } else if (text === "Chocolate Box!") {
          ctx.fillText("Chocolate", 130, -9);
          ctx.fillText("Box!", 130, 11);
        } else if (text === "Massage Session") {
          ctx.fillText("Massage", 130, -9);
          ctx.fillText("Session", 130, 11);
        } else if (text === "Passionate Kiss") {
          ctx.fillText("Passionate", 130, -9);
          ctx.fillText("Kiss", 130, 11);
        } else if (text === "Kiss Coupon") {
          ctx.fillText("Kiss", 130, -9);
          ctx.fillText("Coupon", 130, 11);
        } else if (text === "Love Letter") {
          ctx.fillText("Love", 130, -9);
          ctx.fillText("Letter", 130, 11);
        } else if (text === "Movie Night") {
          ctx.fillText("Movie", 130, -9);
          ctx.fillText("Night", 130, 11);
        } else {
          ctx.fillText(text, 130, 0);
        }
        ctx.restore();
      }

      // 2. Outer Rim Ring (Burgundy)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 246, 0, Math.PI * 2);
      ctx.arc(cx, cy, 210, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = '#881538';
      ctx.fill();

      // Inner white rim border
      ctx.beginPath();
      ctx.arc(cx, cy, 210, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Outer rim edge
      ctx.beginPath();
      ctx.arc(cx, cy, 246, 0, Math.PI * 2);
      ctx.strokeStyle = '#6f0f2b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 14 Light Bulbs
      const numBulbs = 14;
      for (let b = 0; b < numBulbs; b++) {
        const bAngle = (b * (Math.PI * 2)) / numBulbs;
        const bx = cx + Math.cos(bAngle) * 228;
        const by = cy + Math.sin(bAngle) * 228;

        ctx.beginPath();
        ctx.arc(bx, by, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowBlur = 6;
        ctx.fill();
      }
      ctx.restore();

      // 3. Center Hub
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 38, 0, Math.PI * 2);
      ctx.fillStyle = '#881538';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = 8;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 38, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('♥', cx, cy + 1);
      ctx.restore();
    }

    drawWheel();

    let isSpinning = false;
    let currentRotation = 0;
    let tickInterval = null;

    function spin() {
      if (isSpinning) return;
      isSpinning = true;
      spinBtn.disabled = true;
      spinBtn.textContent = 'Spinning… ✨';

      // Pick a random winning slice
      const winningIndex = Math.floor(Math.random() * totalSlices);
      const winner = prizes[winningIndex];

      // Calculate target angle to place center of winner directly under 12 o'clock pointer
      const targetModulo = (360 - (winningIndex + 0.5) * sliceDeg + 360) % 360;
      const currentModulo = currentRotation % 360;
      const additionalDeg = (targetModulo - currentModulo + 360) % 360;
      const fullRotations = 5 * 360;
      const totalNewRotation = currentRotation + fullRotations + additionalDeg;

      currentRotation = totalNewRotation;
      spinnerBox.style.transform = `rotate(${currentRotation}deg)`;

      // Animate pointer wiggle while spinning
      if (pointer) {
        let tickCount = 0;
        tickInterval = setInterval(() => {
          pointer.classList.remove('ticking');
          void pointer.offsetWidth;
          pointer.classList.add('ticking');
          tickCount++;
          if (tickCount > 24) clearInterval(tickInterval);
        }, 160);
      }

      // When spin finishes
      setTimeout(() => {
        if (tickInterval) clearInterval(tickInterval);
        isSpinning = false;
        spinBtn.disabled = false;
        spinBtn.textContent = 'Push here';

        playWinChime();
        showPrizeModal(winner);
      }, 4600);
    }

    function showPrizeModal(winner) {
      if (!modal) return;
      prizeNameEl.textContent = winner.label;
      prizeNameEl.style.color = winner.color;
      prizeNameEl.style.borderColor = winner.color;
      prizeDescEl.textContent = winner.desc;
      prizeEmojiEl.textContent = winner.emoji;

      // Spawn celebratory confetti hearts inside modal
      const confettiBox = document.getElementById('prize-confetti');
      if (confettiBox) {
        confettiBox.innerHTML = '';
        const emojis = ['💕', '💖', '✨', '🌸', '💋', '🍫', '🎉'];
        for (let i = 0; i < 24; i++) {
          const c = document.createElement('span');
          c.className = 'confetti-heart';
          c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
          c.style.left = '50%';
          c.style.top = '40%';
          const cx = (Math.random() - 0.5) * 320 + 'px';
          const cy = (Math.random() - 0.5) * 300 + 'px';
          const cr = (Math.random() - 0.5) * 720 + 'deg';
          c.style.setProperty('--cx', cx);
          c.style.setProperty('--cy', cy);
          c.style.setProperty('--cr', cr);
          c.style.fontSize = (14 + Math.random() * 18) + 'px';
          confettiBox.appendChild(c);
        }
      }

      modal.classList.add('active');
    }

    function closeModal() {
      if (modal) modal.classList.remove('active');
    }

    spinBtn.addEventListener('click', spin);
    spinnerBox.addEventListener('click', spin);

    if (claimBtn) {
      claimBtn.addEventListener('click', () => {
        closeModal();
        for (let i = 0; i < 8; i++) {
          const heart = document.createElement('div');
          heart.className = 'love-popup';
          heart.textContent = '💖';
          heart.style.left = (window.innerWidth / 2 + (Math.random() - 0.5) * 200) + 'px';
          heart.style.top = (window.innerHeight / 2 + (Math.random() - 0.5) * 150) + 'px';
          document.body.appendChild(heart);
          setTimeout(() => heart.remove(), 2200);
        }
      });
    }

    if (againBtn) {
      againBtn.addEventListener('click', () => {
        closeModal();
        setTimeout(spin, 300);
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  function playWinChime() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0, audioCtx.currentTime + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.12 + 0.85);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.12);
        osc.stop(audioCtx.currentTime + idx * 0.12 + 0.85);
      });
    } catch (e) {}
  }
});
