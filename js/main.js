// --- Hamburger Menu ---
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// --- Up Arrow Logic ---
const upArrow = document.getElementById('up-arrow');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    upArrow.classList.add('show');
  } else {
    upArrow.classList.remove('show');
  }
});

upArrow.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Floating Chat Window Toggle ---
const chatBtn = document.getElementById('open-chat');
const closeChat = document.getElementById('close-chat');
const chatWindow = document.getElementById('chat-window');

chatBtn.addEventListener('click', () => {
  chatWindow.classList.toggle('active');
});

closeChat.addEventListener('click', () => {
  chatWindow.classList.remove('active');
});


// ==========================================
// GSAP & Animations
// ==========================================
gsap.registerPlugin(ScrollTrigger);

// 1. Waving Caricature Swaying Animation (Simulating a wave/move)
gsap.to('#waving-img', {
  rotation: 6,
  transformOrigin: "bottom center",
  duration: 2.5,
  ease: "sine.inOut",
  yoyo: true,
  repeat: -1
});

// 2. Global Section Reveals (her section animation ile acilsin)
const revealElements = document.querySelectorAll('.section-content');
revealElements.forEach((el) => {
  gsap.fromTo(el, 
    { autoAlpha: 0, y: 60 },
    {
      autoAlpha: 1, 
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      }
    }
  );
});

// 3. Staggered reveal for Roadmap Items & Line Fill
gsap.fromTo('.gs-reveal', 
  { autoAlpha: 0, x: -40 },
  {
    autoAlpha: 1,
    x: 0,
    duration: 0.8,
    stagger: 0.3,
    ease: "power2.out",
    scrollTrigger: {
      trigger: '.roadmap-container',
      start: "top 70%"
    }
  }
);

gsap.to('#rm-line-fill', {
  height: '100%',
  ease: "none",
  scrollTrigger: {
    trigger: '.roadmap-container',
    start: "top 70%",
    end: "bottom 70%",
    scrub: 1
  }
});


// 4. Complex Chatbot Dashboard Simulation
// Sequence: 
// 1. User: "Futuristik qırmızı idman ayaqqabısı 3D dizaynı yarat"
// 2. System: "Şəkil Generasiya Olunur..." (spinner)
// 3. Bot: Image response

const tlSim = gsap.timeline({
  scrollTrigger: {
    trigger: ".flat-dashboard",
    start: "top 70%",
    once: true // run once when user reaches the dashboard
  }
});

const thread = document.getElementById('mockup-sim');
const aiGenerating = document.getElementById('ai-generating');

// Step 1: User initial message pops up
tlSim.to('.gs-init', { autoAlpha: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" });

// Step 2: Show AI Generating
tlSim.add(() => {
  aiGenerating.style.display = "flex";
}, "+=0.3");
tlSim.to(aiGenerating, { autoAlpha: 1, duration: 0.3 });

// Step 3: Wait a bit, hide generating, show bot response (Image)
tlSim.to(aiGenerating, { autoAlpha: 0, duration: 0.3, delay: 2.0 });
tlSim.add(() => {
  aiGenerating.style.display = "none";
  // Create and append bot message with image
  const botMsg = document.createElement('div');
  botMsg.className = 'flat-msg bot';
  botMsg.innerHTML = "Budur, istədiyiniz 3D qırmızı idman ayaqqabısı: <img src='assets/ai_generated_sneaker.jpg' class='bot-img-reply' alt='Red Sneaker'>";
  thread.appendChild(botMsg);
  
  // Animate bot message
  gsap.to(botMsg, { autoAlpha: 1, y: 0, duration: 0.6, ease: "back.out(1.2)" });
});


// 5. Outfit Switcher Logic
const outfitCircles = document.querySelectorAll('.outfit-circle');
const heroImg = document.querySelector('.hero-img');

if(outfitCircles.length > 0 && heroImg) {
  outfitCircles.forEach(circle => {
    circle.addEventListener('click', () => {
      // Prevent clicking if already active
      if(circle.classList.contains('active')) return;
      
      outfitCircles.forEach(c => c.classList.remove('active'));
      circle.classList.add('active');
      
      const newSrc = circle.dataset.img;
      
      // Image replacement animation
      gsap.timeline()
        .to(heroImg, { 
          opacity: 0, 
          scale: 0.9,
          duration: 0.3, 
          ease: "power2.in",
          onComplete: () => {
             heroImg.src = newSrc;
          }
        })
        .to(heroImg, { 
          opacity: 1, 
          scale: 1,
          duration: 0.5, 
          ease: "back.out(1.5)" 
        });
    });
  });
}

// ==========================================
// Dark/Light Mode Toggle
// ==========================================
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

// Check LocalStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-theme');
  sunIcon.style.display = 'block';
  moonIcon.style.display = 'none';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  
  if (isDark) {
    localStorage.setItem('theme', 'dark');
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  } else {
    localStorage.setItem('theme', 'light');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  }
});

// ==========================================
// Language Switcher Logic
// ==========================================
const langLinks = document.querySelectorAll('.lang-menu a');
const currentLangText = document.getElementById('current-lang-text');
const currentLangFlag = document.getElementById('current-lang-flag');

// Default lang AZ
let currentLang = localStorage.getItem('lang') || 'az';

function updateLanguage(lang) {
  if (!translations[lang]) return;
  
  // Update texts
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      // Use innerHTML to parse <br> tags properly
      el.innerHTML = translations[lang][key];
    }
  });

  // Update UI button
  currentLangText.textContent = lang.toUpperCase();
  let flagCode = lang;
  if(lang === 'en') flagCode = 'gb';
  currentLangFlag.src = `https://flagcdn.com/w20/${flagCode}.png`;
  
  // Update html lang attribute
  document.documentElement.lang = lang;
}

// Initial load
updateLanguage(currentLang);

langLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const selectedLang = link.getAttribute('data-lang');
    if(selectedLang !== currentLang) {
      currentLang = selectedLang;
      localStorage.setItem('lang', currentLang);
      updateLanguage(currentLang);
    }
  });
});

// ==========================================
// Custom Loader for Auth Navigation
// ==========================================
window.showLoader = function(url) {
  const loader = document.getElementById('global-loader');
  if (loader) {
    loader.style.display = 'flex';
    loader.style.opacity = '0';
    // fade in
    setTimeout(() => { loader.style.opacity = '1'; }, 10);
    
    // wait 5 seconds, then navigate
    setTimeout(() => {
      window.location.href = url;
    }, 5000); // 5 seconds
  } else {
    window.location.href = url;
  }
};

