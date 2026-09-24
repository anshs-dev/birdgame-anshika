/**
 * Anshika's Blossom Flight - Ultra 4K Bougainvillea Edition
 * Specially handcrafted for Anshika
 */

// --- Audio Synthesizer (Zero External Dependencies) ---
class SoundController {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.voiceEnabled = true;
    this.bgmTimer = null;
    this.isBgmPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playFlap() {
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.12);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  playScore() {
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [587.33, 880, 1174.66].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.2, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.06 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.26);
      });
    } catch (e) {}
  }

  playCollectStar() {
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.3, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.36);
      });
    } catch (e) {}
  }

  playHit() {
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.25);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  startBgm() {
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    const chords = [
      [329.63, 392.00, 493.88], // Em
      [261.63, 329.63, 392.00], // C
      [293.66, 369.99, 440.00], // D
      [246.94, 311.13, 369.99]  // Bm
    ];
    let step = 0;

    const playChord = () => {
      if (!this.isBgmPlaying || !this.soundEnabled || !this.ctx) {
        this.bgmTimer = setTimeout(playChord, 1200);
        return;
      }
      try {
        const chord = chords[step % chords.length];
        const now = this.ctx.currentTime;
        chord.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.04, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.2);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 1.25);
        });
        step++;
      } catch (e) {}
      this.bgmTimer = setTimeout(playChord, 1400);
    };
    playChord();
  }

  stopBgm() {
    this.isBgmPlaying = false;
    clearTimeout(this.bgmTimer);
  }
}

// --- Voice & Sassy Quotes Manager ---
const SASSY_QUOTES = [
  { text: "Shut the fuck up..!", exp: "assets/exp_angry.png", pitch: 1.25 },
  { text: "How dare you...!", exp: "assets/exp_angry.png", pitch: 1.2 },
  { text: "I am the best....!", exp: "assets/exp_wink.png", pitch: 1.35 },
  { text: "Huh, has someone ever created something for you like this..?", exp: "assets/exp_cute.png", pitch: 1.3 },
  { text: "Naturally iconic!", exp: "assets/exp_laugh.png", pitch: 1.4 },
  { text: "Look at me glide!", exp: "assets/exp_cute.png", pitch: 1.3 },
  { text: "Out of my way, vines!", exp: "assets/exp_angry.png", pitch: 1.25 },
  { text: "Obsessed with me?", exp: "assets/exp_wink.png", pitch: 1.35 }
];

class VoiceController {
  constructor() {
    this.synth = window.speechSynthesis;
    this.lastQuoteTime = 0;
    this.quoteCooldown = 1600; // ms between voice quotes to prevent overlap
    this.quoteIndex = 0;
  }

  speakRandomQuote(force = false) {
    const now = Date.now();
    if (!force && now - this.lastQuoteTime < this.quoteCooldown) return null;
    this.lastQuoteTime = now;

    // Pick in cycle or random
    const quote = SASSY_QUOTES[this.quoteIndex % SASSY_QUOTES.length];
    this.quoteIndex++;

    if (sound.voiceEnabled && this.synth) {
      try {
        this.synth.cancel(); // Stop any pending speech
        const utterance = new SpeechSynthesisUtterance(quote.text);
        utterance.rate = 1.15;
        utterance.pitch = quote.pitch || 1.3;

        // Try to pick a pleasant female English voice if available
        const voices = this.synth.getVoices();
        const preferred = voices.find(v => (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Google UK English Female')) && v.lang.startsWith('en'));
        if (preferred) utterance.voice = preferred;

        this.synth.speak(utterance);
      } catch (e) {}
    }
    return quote;
  }
}

// Global Audio & Voice Singletons
const sound = new SoundController();
const voice = new VoiceController();

// --- Game Engine ---
class BlossomGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // UI Elements
    this.scoreDisplay = document.getElementById('scoreDisplay');
    this.bestDisplay = document.getElementById('bestDisplay');
    this.startScreen = document.getElementById('startScreen');
    this.gameOverScreen = document.getElementById('gameOverScreen');
    this.loveModal = document.getElementById('loveModal');
    this.speechBubble = document.getElementById('speechBubble');
    this.bubbleText = document.getElementById('bubbleText');
    this.bubbleAvatar = document.getElementById('bubbleAvatar');
    
    this.finalScore = document.getElementById('finalScore');
    this.finalBest = document.getElementById('finalBest');

    // Controls
    this.voiceToggleBtn = document.getElementById('voiceToggleBtn');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.secretMsgBtn = document.getElementById('secretMsgBtn');
    this.startBtn = document.getElementById('startBtn');
    this.restartBtn = document.getElementById('restartBtn');
    this.openLetterBtn = document.getElementById('openLetterBtn');
    this.closeLetterBtn = document.getElementById('closeLetterBtn');
    this.backToGameBtn = document.getElementById('backToGameBtn');

    // State
    this.state = 'START'; // 'START' | 'PLAYING' | 'GAMEOVER'
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem('anshika_best_score') || '0', 10);
    this.bestDisplay.textContent = this.bestScore;

    // Assets
    this.assets = {
      jump: this.loadImage('assets/player_jump.png'),
      fall: this.loadImage('assets/player_fall.png'),
      hurt: this.loadImage('assets/player_hurt.png'),
      bg: this.loadImage('assets/background.png'),
      topPillar: this.loadImage('assets/bougainvillea_top.png'),
      botPillar: this.loadImage('assets/bougainvillea_bottom.png'),
      petal: this.loadImage('assets/petal.png'),
      star: this.loadImage('assets/star.png')
    };

    // Virtual Game Resolution (Crisp 1920x1080 scaled)
    this.vw = 1920;
    this.vh = 1080;
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;

    // Character Physics (Gentle, floaty & forgiving fairy flight)
    this.player = {
      x: 320,
      y: 500,
      radius: 46,
      vy: 0,
      gravity: 0.25, // Much lighter gravity so she stays in the air longer
      jumpImpulse: -7.0, // Smooth, gentle lift
      maxFallSpeed: 5.5, // Terminal velocity capped so she glides down gracefully
      rotation: 0,
      width: 110,
      height: 150,
      isJumping: false,
      wingTime: 0
    };

    // Obstacles (Bougainvillea Vines)
    this.pillars = [];
    this.pillarSpeed = 2.5; // Relaxed, slower obstacle speed (down from 4.2)
    this.spawnTimer = 0;
    this.spawnInterval = 230; // Spacious distance between pillars
    this.gapSize = 420; // Extra wide, easy gap to fly through effortlessly

    // Collectible Stars
    this.stars = [];

    // Particle Systems
    this.ambientPetals = [];
    this.particles = [];

    // Background Scroll
    this.bgScroll = 0;

    // Bubble timer
    this.bubbleHideTimeout = null;

    this.init();
  }

  loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Init Ambient Petals (Bougainvillea flower storm)
    for (let i = 0; i < 45; i++) {
      this.ambientPetals.push({
        x: Math.random() * this.vw,
        y: Math.random() * this.vh,
        size: Math.random() * 22 + 14,
        speedX: -(Math.random() * 2.2 + 1.2),
        speedY: Math.random() * 1.4 + 0.6,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.05,
        opacity: Math.random() * 0.6 + 0.4,
        swayPhase: Math.random() * Math.PI * 2
      });
    }

    // Input Listeners
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        this.handleAction();
      }
    });

    this.canvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.handleAction();
    });

    this.startBtn.addEventListener('click', () => {
      sound.init();
      this.startGame();
    });

    this.restartBtn.addEventListener('click', () => {
      sound.init();
      this.startGame();
    });

    this.secretMsgBtn.addEventListener('click', () => this.showLoveModal());
    this.openLetterBtn.addEventListener('click', () => this.showLoveModal());
    this.closeLetterBtn.addEventListener('click', () => this.hideLoveModal());
    this.backToGameBtn.addEventListener('click', () => this.hideLoveModal());

    // Audio & Voice Toggles
    this.voiceToggleBtn.addEventListener('click', () => {
      sound.voiceEnabled = !sound.voiceEnabled;
      this.voiceToggleBtn.innerHTML = sound.voiceEnabled ? '<span>🔊</span> Voice: ON' : '<span>🔇</span> Voice: OFF';
    });

    this.soundToggleBtn.addEventListener('click', () => {
      sound.soundEnabled = !sound.soundEnabled;
      this.soundToggleBtn.innerHTML = sound.soundEnabled ? '<span>🎵</span> Sound: ON' : '<span>🔇</span> Sound: OFF';
      if (!sound.soundEnabled) sound.stopBgm();
      else if (this.state === 'PLAYING') sound.startBgm();
    });

    // Start loop
    requestAnimationFrame((t) => this.loop(t));
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = w * window.devicePixelRatio;
    this.canvas.height = h * window.devicePixelRatio;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;

    // Calculate virtual scale keeping 16:9 aspect or cover
    const scaleX = w / this.vw;
    const scaleY = h / this.vh;
    this.scale = Math.max(scaleX, scaleY);
    this.offsetX = (w - this.vw * this.scale) / 2;
    this.offsetY = (h - this.vh * this.scale) / 2;
  }

  handleAction() {
    sound.init();
    if (this.state === 'START') {
      this.startGame();
    } else if (this.state === 'PLAYING') {
      this.flap();
    } else if (this.state === 'GAMEOVER') {
      // If clicking outside modal or quick restart
      this.startGame();
    }
  }

  startGame() {
    this.state = 'PLAYING';
    this.score = 0;
    this.scoreDisplay.textContent = '0';
    this.player.y = 480;
    this.player.vy = -3;
    this.player.rotation = 0;
    this.pillars = [];
    this.stars = [];
    this.particles = [];
    this.spawnTimer = -60; // Extra warmup time before first bougainvillea vine appears

    this.startScreen.classList.add('hidden');
    this.gameOverScreen.classList.add('hidden');
    this.loveModal.classList.add('hidden');

    sound.startBgm();
    this.flap();
  }

  flap() {
    this.player.vy = this.player.jumpImpulse;
    sound.playFlap();

    // Trigger dialogue and speech bubble
    const quote = voice.speakRandomQuote();
    if (quote) {
      this.showSpeechBubble(quote.text, quote.exp);
    }

    // Sparkle burst particles on flap
    for (let i = 0; i < 9; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      this.particles.push({
        x: this.player.x - 20,
        y: this.player.y + 20,
        vx: Math.cos(angle) * speed - 2,
        vy: Math.sin(angle) * speed + 1,
        size: Math.random() * 12 + 6,
        color: Math.random() > 0.4 ? '#ff66b2' : '#ffffff',
        life: 1,
        decay: Math.random() * 0.04 + 0.03,
        type: 'sparkle'
      });
    }
  }

  showSpeechBubble(text, avatarSrc) {
    this.bubbleText.textContent = text;
    this.bubbleAvatar.src = avatarSrc || 'assets/exp_angry.png';
    this.speechBubble.classList.remove('hidden');

    // Position speech bubble above player relative to screen
    const screenX = this.offsetX + (this.player.x + 60) * this.scale;
    const screenY = this.offsetY + (this.player.y - 85) * this.scale;
    this.speechBubble.style.left = `${Math.min(Math.max(20, screenX), window.innerWidth - 320)}px`;
    this.speechBubble.style.top = `${Math.max(70, screenY)}px`;

    clearTimeout(this.bubbleHideTimeout);
    this.bubbleHideTimeout = setTimeout(() => {
      this.speechBubble.classList.add('hidden');
    }, 1800);
  }

  triggerGameOver() {
    if (this.state === 'GAMEOVER') return;
    this.state = 'GAMEOVER';
    sound.playHit();
    sound.stopBgm();

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('anshika_best_score', this.bestScore);
      this.bestDisplay.textContent = this.bestScore;
    }

    this.finalScore.textContent = this.score;
    this.finalBest.textContent = this.bestScore;
    this.gameOverScreen.classList.remove('hidden');

    // Create celebratory or dramatic particle burst
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      this.particles.push({
        x: this.player.x,
        y: this.player.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 18 + 8,
        color: ['#ff1493', '#ff69b4', '#ffd700', '#ffffff'][Math.floor(Math.random() * 4)],
        life: 1,
        decay: Math.random() * 0.02 + 0.015,
        type: 'petal'
      });
    }
  }

  showLoveModal() {
    this.loveModal.classList.remove('hidden');
    // Spawn floating heart particles on love note
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        x: Math.random() * this.vw,
        y: this.vh + 50,
        vx: (Math.random() - 0.5) * 2,
        vy: -(Math.random() * 3 + 2),
        size: Math.random() * 20 + 10,
        color: '#ff3399',
        life: 1,
        decay: 0.008,
        type: 'heart'
      });
    }
  }

  hideLoveModal() {
    this.loveModal.classList.add('hidden');
  }

  spawnPillars() {
    // Variable heights for bougainvillea vines
    const minHeight = 120;
    const maxHeight = this.vh - this.gapSize - minHeight - 60;
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
    const bottomY = topHeight + this.gapSize;
    const bottomHeight = this.vh - bottomY;

    this.pillars.push({
      x: this.vw + 120,
      width: 140,
      topHeight: topHeight,
      bottomY: bottomY,
      bottomHeight: bottomHeight,
      passed: false
    });

    // 45% chance of spawning a glowing collectible star in the center of the gap
    if (Math.random() < 0.45) {
      this.stars.push({
        x: this.vw + 120 + 70,
        y: topHeight + this.gapSize / 2 + (Math.random() * 60 - 30),
        size: 50,
        collected: false,
        pulse: Math.random() * Math.PI
      });
    }
  }

  update() {
    // Update Ambient Petals
    this.ambientPetals.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.angle += p.rotSpeed;
      p.swayPhase += 0.03;
      p.x += Math.sin(p.swayPhase) * 0.8;

      if (p.x < -60) p.x = this.vw + 60;
      if (p.y > this.vh + 60) p.y = -40;
    });

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life -= pt.decay;
      if (pt.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    if (this.state !== 'PLAYING') return;

    // Background slow scroll
    this.bgScroll = (this.bgScroll + 0.8) % this.vw;

    // Physics - Gentle, floaty glide
    this.player.vy += this.player.gravity;
    if (this.player.vy > this.player.maxFallSpeed) {
      this.player.vy = this.player.maxFallSpeed;
    }
    this.player.y += this.player.vy;

    // Smooth tilt rotation
    if (this.player.vy < 0) {
      this.player.rotation = Math.max(-0.35, this.player.vy * 0.04);
    } else {
      this.player.rotation = Math.min(0.5, this.player.vy * 0.035);
    }

    // Trailing pink fairy dust behind Anshika
    if (Math.random() < 0.8) {
      this.particles.push({
        x: this.player.x - 30 + Math.random() * 10,
        y: this.player.y + Math.random() * 20 - 10,
        vx: -(Math.random() * 2 + 1),
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 9 + 4,
        color: Math.random() > 0.3 ? '#ff80bf' : '#ffffff',
        life: 0.9,
        decay: 0.035,
        type: 'sparkle'
      });
    }

    // Ceiling & Floor Collision
    if (this.player.y - this.player.radius <= 0) {
      this.player.y = this.player.radius;
      this.player.vy = 0;
    }
    if (this.player.y + this.player.radius >= this.vh) {
      this.triggerGameOver();
    }

    // Spawn Pillars
    this.spawnTimer++;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnPillars();
    }

    // Update Pillars & Collision
    for (let i = this.pillars.length - 1; i >= 0; i--) {
      const p = this.pillars[i];
      p.x -= this.pillarSpeed;

      // Score check
      if (!p.passed && p.x + p.width < this.player.x) {
        p.passed = true;
        this.score++;
        this.scoreDisplay.textContent = this.score;
        sound.playScore();
      }

      // Hitbox Collision (Very forgiving bounding box for easy, delightful crossing)
      const hitMargin = 32;
      const playerLeft = this.player.x - this.player.radius + hitMargin;
      const playerRight = this.player.x + this.player.radius - hitMargin;
      const playerTop = this.player.y - this.player.radius + hitMargin;
      const playerBottom = this.player.y + this.player.radius - hitMargin;

      const pillarLeft = p.x;
      const pillarRight = p.x + p.width;

      if (playerRight > pillarLeft && playerLeft < pillarRight) {
        // Collided with top hanging bougainvillea
        if (playerTop < p.topHeight) {
          this.triggerGameOver();
        }
        // Collided with bottom rising bougainvillea
        if (playerBottom > p.bottomY) {
          this.triggerGameOver();
        }
      }

      // Remove offscreen
      if (p.x + p.width < -100) {
        this.pillars.splice(i, 1);
      }
    }

    // Update Stars
    for (let i = this.stars.length - 1; i >= 0; i--) {
      const s = this.stars[i];
      s.x -= this.pillarSpeed;
      s.pulse += 0.08;

      // Check pickup
      const dx = this.player.x - s.x;
      const dy = this.player.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (!s.collected && dist < this.player.radius + s.size / 2) {
        s.collected = true;
        this.score += 2; // Bonus points!
        this.scoreDisplay.textContent = this.score;
        sound.playCollectStar();

        // Starburst particles
        for (let k = 0; k < 18; k++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = Math.random() * 6 + 2;
          this.particles.push({
            x: s.x,
            y: s.y,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            size: Math.random() * 12 + 6,
            color: '#ffd700',
            life: 1,
            decay: 0.04,
            type: 'sparkle'
          });
        }
        this.stars.splice(i, 1);
      } else if (s.x < -60) {
        this.stars.splice(i, 1);
      }
    }
  }

  draw() {
    const ctx = this.ctx;
    const dpr = window.devicePixelRatio || 1;

    ctx.save();
    ctx.scale(dpr, dpr);

    // Virtual viewport transform
    ctx.translate(this.offsetX, this.offsetY);
    ctx.scale(this.scale, this.scale);

    // 1. Draw Background Parallax
    if (this.assets.bg.complete && this.assets.bg.naturalWidth > 0) {
      // Seamless panoramic draw
      ctx.drawImage(this.assets.bg, -this.bgScroll, 0, this.vw, this.vh);
      ctx.drawImage(this.assets.bg, this.vw - this.bgScroll, 0, this.vw, this.vh);
    } else {
      // Fallback aesthetic gradient
      const grad = ctx.createLinearGradient(0, 0, 0, this.vh);
      grad.addColorStop(0, '#2d1237');
      grad.addColorStop(0.5, '#b44678');
      grad.addColorStop(1, '#ffa8b8');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.vw, this.vh);
    }

    // 2. Draw Ambient Pink Bougainvillea Petals
    this.ambientPetals.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = p.opacity;

      if (this.assets.petal.complete && this.assets.petal.naturalWidth > 0) {
        ctx.drawImage(this.assets.petal, -p.size / 2, -p.size / 2, p.size, p.size);
      } else {
        ctx.fillStyle = '#ff66b2';
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.7, p.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // 3. Draw Collectible Stars
    this.stars.forEach(s => {
      ctx.save();
      ctx.translate(s.x, s.y);
      const scaleEffect = 1 + Math.sin(s.pulse) * 0.15;
      ctx.scale(scaleEffect, scaleEffect);

      // Glowing aura
      const aura = ctx.createRadialGradient(0, 0, 5, 0, 0, s.size);
      aura.addColorStop(0, 'rgba(255, 235, 120, 0.9)');
      aura.addColorStop(0.6, 'rgba(255, 180, 50, 0.4)');
      aura.addColorStop(1, 'rgba(255, 100, 150, 0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(0, 0, s.size, 0, Math.PI * 2);
      ctx.fill();

      if (this.assets.star.complete && this.assets.star.naturalWidth > 0) {
        ctx.drawImage(this.assets.star, -s.size / 2, -s.size / 2, s.size, s.size);
      } else {
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(0, 0, s.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // 4. Draw Bougainvillea Obstacle Pillars (Top & Bottom)
    this.pillars.forEach(p => {
      // Top Hanging Pillar
      if (this.assets.topPillar.complete && this.assets.topPillar.naturalWidth > 0) {
        // Draw top pillar scaled to p.topHeight
        ctx.drawImage(
          this.assets.topPillar,
          0, this.assets.topPillar.naturalHeight - p.topHeight,
          this.assets.topPillar.naturalWidth, p.topHeight,
          p.x, 0,
          p.width, p.topHeight
        );
      } else {
        ctx.fillStyle = '#e60073';
        ctx.fillRect(p.x, 0, p.width, p.topHeight);
      }

      // Bottom Rising Pillar
      if (this.assets.botPillar.complete && this.assets.botPillar.naturalWidth > 0) {
        ctx.drawImage(
          this.assets.botPillar,
          0, 0,
          this.assets.botPillar.naturalWidth, p.bottomHeight,
          p.x, p.bottomY,
          p.width, p.bottomHeight
        );
      } else {
        ctx.fillStyle = '#e60073';
        ctx.fillRect(p.x, p.bottomY, p.width, p.bottomHeight);
      }

      // Additional Bougainvillea Floral Glow on Vine Tips
      ctx.save();
      const glowTop = ctx.createRadialGradient(p.x + p.width/2, p.topHeight, 0, p.x + p.width/2, p.topHeight, 55);
      glowTop.addColorStop(0, 'rgba(255, 77, 166, 0.4)');
      glowTop.addColorStop(1, 'rgba(255, 77, 166, 0)');
      ctx.fillStyle = glowTop;
      ctx.beginPath();
      ctx.arc(p.x + p.width/2, p.topHeight, 55, 0, Math.PI * 2);
      ctx.fill();

      const glowBot = ctx.createRadialGradient(p.x + p.width/2, p.bottomY, 0, p.x + p.width/2, p.bottomY, 55);
      glowBot.addColorStop(0, 'rgba(255, 77, 166, 0.4)');
      glowBot.addColorStop(1, 'rgba(255, 77, 166, 0)');
      ctx.fillStyle = glowBot;
      ctx.beginPath();
      ctx.arc(p.x + p.width/2, p.bottomY, 55, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 5. Draw Particle Layer (Sparkles & Exploding Petals)
    this.particles.forEach(pt => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, pt.life);
      if (pt.type === 'heart') {
        ctx.fillStyle = pt.color;
        ctx.font = `${pt.size}px Outfit, sans-serif`;
        ctx.fillText('💖', pt.x, pt.y);
      } else if (pt.type === 'sparkle') {
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = pt.color;
        ctx.shadowBlur = 12;
      } else {
        // Petal shape
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.ellipse(pt.x, pt.y, pt.size * 0.7, pt.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // 6. Draw Player (Anshika Sprite)
    ctx.save();
    ctx.translate(this.player.x, this.player.y);
    ctx.rotate(this.player.rotation);

    // Glowing pink fairy aura around Anshika
    const aura = ctx.createRadialGradient(0, 0, 20, 0, 0, 85);
    aura.addColorStop(0, 'rgba(255, 105, 180, 0.6)');
    aura.addColorStop(0.5, 'rgba(255, 46, 147, 0.25)');
    aura.addColorStop(1, 'rgba(255, 46, 147, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, 0, 85, 0, Math.PI * 2);
    ctx.fill();

    // Select sprite based on state
    let currentSprite = this.assets.jump;
    if (this.state === 'GAMEOVER') {
      currentSprite = this.assets.hurt;
    } else if (this.player.vy > 2.5) {
      currentSprite = this.assets.fall;
    }

    if (currentSprite.complete && currentSprite.naturalWidth > 0) {
      // Draw character centered
      const drawW = this.player.width;
      const drawH = this.player.height;
      ctx.drawImage(currentSprite, -drawW / 2, -drawH / 2, drawW, drawH);
    } else {
      // Fallback
      ctx.fillStyle = '#ff66b2';
      ctx.beginPath();
      ctx.arc(0, 0, this.player.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.restore();
  }

  loop(timestamp) {
    this.update();
    this.draw();
    requestAnimationFrame((t) => this.loop(t));
  }
}

// Start game instance on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  window.blossomGame = new BlossomGame();
});
