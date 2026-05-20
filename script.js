// ============================
// LOADING SCREEN
// ============================
const loader    = document.getElementById("loader");
const loaderBar = document.getElementById("loaderBar");
let loadProgress = 0;

const loadInterval = setInterval(() => {
  loadProgress += Math.random() * 18;
  if (loadProgress >= 100) {
    loadProgress = 100;
    loaderBar.style.width = "100%";
    clearInterval(loadInterval);
    setTimeout(() => {
      loader.classList.add("hide");
      startTyping();
      triggerTransition(() => {});
    }, 400);
  } else {
    loaderBar.style.width = loadProgress + "%";
  }
}, 120);

// ============================
// FOOTER YEAR
// ============================
const footerYear = document.getElementById("footerYear");
if (footerYear) footerYear.textContent = new Date().getFullYear();

// ============================
// PAGE TRANSITION
// ============================
const pageTransition = document.getElementById("pageTransition");

const moodEmoji = {
  cherry: "🌸", midnight: "🌙",
  golden: "🌅", ocean: "🌊", forest: "🌿"
};

let currentMood = "cherry";

function triggerTransition(callback) {
  const petalEl = pageTransition.querySelector(".transition-petal");
  petalEl.textContent = moodEmoji[currentMood] || "🌸";
  petalEl.style.opacity = "";
  petalEl.style.transform = "";

  pageTransition.classList.remove("out");
  pageTransition.classList.add("in");

  setTimeout(() => {
    if (callback) callback();
    setTimeout(() => {
      pageTransition.classList.remove("in");
      pageTransition.classList.add("out");
      setTimeout(() => {
        pageTransition.classList.remove("out");
      }, 550);
    }, 350);
  }, 520);
}

document.querySelectorAll("nav a, .footer-links a").forEach(link => {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    e.preventDefault();
    closeMobileMenu();
    triggerTransition(() => {
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
});

// ============================
// MOBILE HAMBURGER MENU
// ============================
const hamburger          = document.getElementById("hamburger");
const navMenu            = document.getElementById("navMenu");
const mobileMenuOverlay  = document.getElementById("mobileMenuOverlay");

function openMobileMenu() {
  hamburger.classList.add("open");
  navMenu.classList.add("open");
  mobileMenuOverlay.style.display = "block";
  setTimeout(() => mobileMenuOverlay.classList.add("visible"), 10);
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  hamburger.classList.remove("open");
  navMenu.classList.remove("open");
  mobileMenuOverlay.classList.remove("visible");
  setTimeout(() => { mobileMenuOverlay.style.display = "none"; }, 300);
  document.body.style.overflow = "";
}

hamburger.addEventListener("click", (e) => {
  e.stopPropagation();
  navMenu.classList.contains("open") ? closeMobileMenu() : openMobileMenu();
});

mobileMenuOverlay.addEventListener("click", closeMobileMenu);
navMenu.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => closeMobileMenu());
});

// ============================
// MOOD / VIBE TOGGLE
// ============================
const moodToggleBtn = document.getElementById("moodToggleBtn");
const moodPanel     = document.getElementById("moodPanel");
const moodBtns      = document.querySelectorAll(".mood-btn");
const moodClasses   = ["mood-midnight","mood-golden","mood-ocean","mood-forest"];

moodToggleBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  moodPanel.classList.toggle("open");
});

document.addEventListener("click", (e) => {
  if (!moodPanel.contains(e.target) && e.target !== moodToggleBtn) {
    moodPanel.classList.remove("open");
  }
});

moodBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const mood = btn.dataset.mood;
    if (mood === currentMood) return;

    triggerTransition(() => {
      document.body.classList.remove(...moodClasses);
      if (mood !== "cherry") document.body.classList.add("mood-" + mood);
      currentMood = mood;
      moodBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      moodToggleBtn.textContent = moodEmoji[mood] || "🎨";
      moodPanel.classList.remove("open");
      updatePetalColor(mood);
    });
  });
});

// ============================
// PETAL CANVAS
// ============================
const canvas = document.getElementById("petalCanvas");
const ctx    = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const PETALS_COUNT = 26;
const petals = [];

const petalColors = {
  cherry:   ["#ffb6c1","#ff9ecb","#ffc7e3","#ffaad4"],
  midnight: ["#b388ff","#9c6fff","#ce93d8","#d1b3ff"],
  golden:   ["#ffd166","#ffb347","#ffdb85","#f4c542"],
  ocean:    ["#7ecef4","#40b4e5","#b3e5fc","#4fc3f7"],
  forest:   ["#a5d6a7","#66bb6a","#c8e6c9","#81c784"],
};

let activePetalColor = petalColors.cherry;

function updatePetalColor(mood) {
  activePetalColor = petalColors[mood] || petalColors.cherry;
}

function rand(a, b) { return a + Math.random() * (b - a); }

for (let i = 0; i < PETALS_COUNT; i++) {
  petals.push({
    x: rand(0, window.innerWidth),
    y: rand(-200, window.innerHeight),
    size: rand(6, 15),
    speedY: rand(0.3, 0.9),
    speedX: rand(-0.25, 0.25),
    angle: rand(0, Math.PI * 2),
    spin: rand(-0.012, 0.012),
    opacity: rand(0.28, 0.7),
    t: rand(0, 100),
    colorIdx: Math.floor(Math.random() * 4),
  });
}

function drawPetals() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  petals.forEach(p => {
    p.t     += 0.012;
    p.x     += p.speedX + Math.sin(p.t) * 0.35;
    p.y     += p.speedY;
    p.angle += p.spin;
    if (p.y > canvas.height + 30) {
      p.y = -30;
      p.x = rand(0, canvas.width);
    }
    const color = activePetalColor[p.colorIdx % activePetalColor.length];
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = p.opacity * 0.35;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(-p.size * 0.15, -p.size * 0.3, p.size * 0.18, p.size * 0.32, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  requestAnimationFrame(drawPetals);
}
drawPetals();

// ============================
// TYPING ANIMATION
// ============================
const phrases = [
  "2nd Year BSE Student 🌸",
  "Major In Science  ✨",
  "Assessment in Learning EDUM205 N2AM",
  "Always Learning 💻"
];
let phraseIndex = 0, charIndex = 0, isDeleting = false;
const typingEl = document.getElementById("typingText");

function startTyping() {
  if (!typingEl) return;
  typeLoop();
}

function typeLoop() {
  const current = phrases[phraseIndex];
  if (!isDeleting) {
    typingEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    typingEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting  = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, isDeleting ? 58 : 100);
}

// ============================
// CUSTOM CURSOR (desktop only)
// ============================
const cursor      = document.getElementById("cursor");
const cursorTrail = document.getElementById("cursorTrail");
let trailX = 0, trailY = 0, cursorX = 0, cursorY = 0;

if (window.matchMedia("(hover: hover)").matches) {
  document.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursor.style.left = cursorX + "px";
    cursor.style.top  = cursorY + "px";
  });

  function animateTrail() {
    trailX += (cursorX - trailX) * 0.14;
    trailY += (cursorY - trailY) * 0.14;
    cursorTrail.style.left = trailX + "px";
    cursorTrail.style.top  = trailY + "px";
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  document.querySelectorAll("a, button, .stack-card, .gallery-card, .mood-btn").forEach(el => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });
} else {
  if (cursor) cursor.style.display = "none";
  if (cursorTrail) cursorTrail.style.display = "none";
}

// ============================
// EXPLORE BUTTON
// ============================
document.getElementById("exploreBtn").addEventListener("click", () => {
  triggerTransition(() => {
    document.getElementById("about").scrollIntoView({ behavior: "smooth" });
  });
});

// ============================
// SCROLL REVEAL
// ============================
const reveals = document.querySelectorAll(".reveal");
function checkReveal() {
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 70) {
      el.classList.add("active");
    }
  });
}
window.addEventListener("scroll", checkReveal, { passive: true });
checkReveal();

// ============================
// ACTIVE NAV LINK ON SCROLL
// ============================
const navLinks  = document.querySelectorAll("nav a");
const sections  = document.querySelectorAll("section[id], .contact[id]");

function updateActiveNav() {
  let currentId = "";
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top <= 100) currentId = sec.getAttribute("id");
  });
  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
  });
}
window.addEventListener("scroll", updateActiveNav, { passive: true });

// ============================
// NAV BACKGROUND ON SCROLL
// ============================
const navEl = document.getElementById("mainNav");
window.addEventListener("scroll", () => {
  const solidBg = getComputedStyle(document.documentElement).getPropertyValue("--nav-solid").trim();
  const transBg = getComputedStyle(document.documentElement).getPropertyValue("--nav-bg").trim();
  navEl.style.background = window.scrollY > 50 ? solidBg : transBg;
}, { passive: true });

// ============================
// PROGRESS BAR
// ============================
window.addEventListener("scroll", () => {
  const scrollTop    = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = scrollHeight > 0 ? (scrollTop / scrollHeight * 100) : 0;
  document.getElementById("progressBar").style.width = pct + "%";
}, { passive: true });

// ============================
// BACK TO TOP BUTTON
// ============================
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 400);
}, { passive: true });

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ============================
// SECTION HEADING UNDERLINE
// ============================
document.querySelectorAll(".section-heading").forEach(heading => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) heading.classList.add("active");
    });
  }, { threshold: 0.4 });
  obs.observe(heading);
});

// ============================
// DETAIL MODAL — with IG-style image gallery
// ============================
const detailView  = document.getElementById("detailView");
const detailTitle = document.getElementById("detailTitle");
const detailDesc  = document.getElementById("detailDesc");
const closeDetail = document.getElementById("closeDetail");

(function buildModalGallery() {
  const oldImg = document.getElementById("detailImg");
  if (oldImg) oldImg.remove();

  const galleryHTML = `
    <div class="modal-gallery" id="modalGallery">
      <div class="modal-gallery-track" id="modalGalleryTrack"></div>
      <button class="modal-gal-arrow modal-gal-prev" id="modalGalPrev" aria-label="Previous image">&#8249;</button>
      <button class="modal-gal-arrow modal-gal-next" id="modalGalNext" aria-label="Next image">&#8250;</button>
      <div class="modal-gal-dots" id="modalGalDots"></div>
      <div class="modal-gal-counter" id="modalGalCounter"></div>
    </div>
  `;
  closeDetail.insertAdjacentHTML("afterend", galleryHTML);
})();

// Per-artifact image arrays
const artifactImages = {
  0: [
    "images/artifact1a.jpg",
    "images/artifact1b.jpg",
    "images/artifact1c.jpg",
    "images/artifact1d.jpg",
    "images/artifact1e.jpg",
    "images/artifact1f.jpg",
    "images/artifact1g.jpg",
    "images/artifact1h.jpg",
    "images/artifact1i.jpg"
  ],
  1: ["images/artifact2.jpg"],
  2: ["images/artifact3.jpg"],
  3: ["images/artifact4a.jpg", "images/artifact4b.jpg"],
  4: ["images/artifact5a.jpg", "images/artifact5b.jpg"],
  5: ["images/artifact6.jpg"],
  6: ["images/artifact7.jpg"],
};

let galCurrent = 0;
let galImages  = [];
let galTouchX  = 0;

const galTrack   = document.getElementById("modalGalleryTrack");
const galPrev    = document.getElementById("modalGalPrev");
const galNext    = document.getElementById("modalGalNext");
const galDots    = document.getElementById("modalGalDots");
const galCounter = document.getElementById("modalGalCounter");

function buildGallery(images) {
  galImages  = images;
  galCurrent = 0;

  galTrack.innerHTML = "";
  images.forEach((src, i) => {
    const slide = document.createElement("div");
    slide.className = "modal-gal-slide";
    const img = document.createElement("img");
    img.src = src;
    img.alt = "Artifact image " + (i + 1);
    slide.appendChild(img);
    galTrack.appendChild(slide);
  });

  galDots.innerHTML = "";
  images.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = "modal-gal-dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => goToGalSlide(i));
    galDots.appendChild(dot);
  });

  updateGallery();
}

function updateGallery() {
  galTrack.style.transform = "translateX(" + (-galCurrent * 100) + "%)";
  document.querySelectorAll(".modal-gal-dot").forEach((d, i) => {
    d.classList.toggle("active", i === galCurrent);
  });
  galCounter.textContent = (galCurrent + 1) + " / " + galImages.length;
  galPrev.style.opacity  = galCurrent === 0 ? "0.3" : "1";
  galNext.style.opacity  = galCurrent === galImages.length - 1 ? "0.3" : "1";
  galPrev.disabled       = galCurrent === 0;
  galNext.disabled       = galCurrent === galImages.length - 1;

  const single = galImages.length === 1;
  galPrev.style.display    = single ? "none" : "flex";
  galNext.style.display    = single ? "none" : "flex";
  galDots.style.display    = single ? "none" : "flex";
  galCounter.style.display = single ? "none" : "block";
}

function goToGalSlide(index) {
  galCurrent = Math.max(0, Math.min(index, galImages.length - 1));
  updateGallery();
}

galPrev.addEventListener("click", () => goToGalSlide(galCurrent - 1));
galNext.addEventListener("click", () => goToGalSlide(galCurrent + 1));

galTrack.addEventListener("touchstart", e => {
  galTouchX = e.touches[0].clientX;
}, { passive: true });

galTrack.addEventListener("touchend", e => {
  const diff = galTouchX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    goToGalSlide(diff > 0 ? galCurrent + 1 : galCurrent - 1);
  }
}, { passive: true });

document.addEventListener("keydown", e => {
  if (!detailView.classList.contains("open")) return;
  if (e.key === "ArrowLeft")  goToGalSlide(galCurrent - 1);
  if (e.key === "ArrowRight") goToGalSlide(galCurrent + 1);
  if (e.key === "Escape")     closeDetailModal();
});

// ============================
// FORMAT DESC — Draft / Goal / Reflection
// ============================
function formatDesc(raw) {
  // First, convert any URLs into a clickable "View Document" link
  const linkedText = raw.replace(
    /(https?:\/\/[^\s"<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:var(--accent);font-weight:600;text-decoration:underline;">View Document 📄</a>'
  );

  // Then bold and space the section labels
  const formatted = linkedText
    .replace(/(Draft:)/g,      '<strong style="color:var(--accent)">$1</strong>')
    .replace(/(Goal:)/g,       '<br><br><strong style="color:var(--accent)">$1</strong>')
    .replace(/(Reflection:)/g, '<br><br><strong style="color:var(--accent)">$1</strong>');

  return formatted;
}

function openDetail(artifactIndex, title, desc) {
  const images = artifactImages[artifactIndex] || ["https://picsum.photos/800/500"];
  buildGallery(images);
  detailTitle.textContent = title;
  detailDesc.innerHTML    = formatDesc(desc);
  detailView.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDetailModal() {
  detailView.classList.remove("open");
  document.body.style.overflow = "";
}

document.addEventListener("click", function(e) {
  const galleryCard = e.target.closest(".gallery-card");
  if (galleryCard) {
    const img = galleryCard.dataset.img || "https://picsum.photos/800/500";
    buildGallery([img]);
    detailTitle.textContent = galleryCard.dataset.title || "";
    detailDesc.textContent  = galleryCard.dataset.desc  || "";
    detailView.classList.add("open");
    document.body.style.overflow = "hidden";
    return;
  }
  if (e.target.classList.contains("detail-backdrop")) {
    closeDetailModal();
  }
});

closeDetail.addEventListener("click", closeDetailModal);

// ============================
// INSTAGRAM GALLERY SCROLL
// ============================
const instaScroll = document.getElementById("instaScroll");
const dots        = document.querySelectorAll(".dot");
let currentIndex  = 0;

function goToSlide(index) {
  currentIndex = Math.max(0, Math.min(index, dots.length - 1));
  instaScroll.scrollTo({ left: currentIndex * instaScroll.offsetWidth, behavior: "smooth" });
  dots.forEach((d, i) => d.classList.toggle("active", i === currentIndex));
}

document.getElementById("instaLeft").addEventListener("click",  () => goToSlide(currentIndex - 1));
document.getElementById("instaRight").addEventListener("click", () => goToSlide(currentIndex + 1));

dots.forEach((dot, i) => dot.addEventListener("click", () => goToSlide(i)));

let scrollTimer;
instaScroll.addEventListener("scroll", () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    const index = Math.round(instaScroll.scrollLeft / instaScroll.offsetWidth);
    currentIndex = index;
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }, 80);
}, { passive: true });

let touchStartX = 0;
instaScroll.addEventListener("touchstart", e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
instaScroll.addEventListener("touchend", e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    goToSlide(diff > 0 ? currentIndex + 1 : currentIndex - 1);
  }
}, { passive: true });

// ============================
// ACTIVITIES STACK — SMOOTH SLIDE + HOVER POP-OUT
// ============================
const stackVP      = document.getElementById("stackVP");
const stackTrack   = document.getElementById("stackScroll");
const stackCards   = [...document.querySelectorAll(".stack-card")];
const stackDotsEl  = [...document.querySelectorAll("#stackDots .sdot")];
const stackCtr     = document.getElementById("stackCounter");
const btnSL        = document.getElementById("stackLeft");
const btnSR        = document.getElementById("stackRight");

let SCARD_W = 0;
let SGAP = 12;

let sCur       = 0;
const sTotal   = stackCards.length;
let sDragging  = false;
let sDragDelta = 0;
let sBase      = 0;
let sTouchX    = 0;

function sGetOffset(i) {
  const activeCard = stackCards[0];
  SCARD_W = activeCard.offsetWidth;
  const vpW = stackVP.offsetWidth;
  return -(i * (SCARD_W + SGAP)) + ((vpW - SCARD_W) / 2);
}

function sGo(i, animate) {
  if (animate === undefined) animate = true;
  sCur = Math.max(0, Math.min(i, sTotal - 1));

  if (!animate) {
    stackTrack.style.transition = "none";
  } else {
    stackTrack.style.transition = "transform .45s cubic-bezier(0.25,0.46,0.45,0.94)";
  }

  sBase = sGetOffset(sCur);
  stackTrack.style.transform = "translateX(" + sBase + "px)";

  stackCards.forEach(function(c, j) {
    c.classList.toggle("active", j === sCur);
    const dist = Math.abs(j - sCur);

    if (dist > 2) {
      c.style.opacity = "0.45";
    } else if (dist === 2) {
      c.style.opacity = "0.7";
    } else if (dist === 1) {
      c.style.opacity = "0.88";
    } else {
      c.style.opacity = "1";
    }

    if (j !== sCur) {
      const dir = j < sCur ? 1 : -1;
      const scale = dist === 1 ? 0.96 : 0.92;
      c.style.transform = "perspective(600px) rotateY(" + (dir * 8) + "deg) scale(" + scale + ")";
    } else {
      c.style.transform = "perspective(600px) rotateY(0deg) scale(1)";
    }
  });

  stackDotsEl.forEach(function(d, j) {
    d.classList.toggle("active", j === sCur);
  });

  stackCtr.textContent = (sCur + 1) + " / " + sTotal;
  btnSL.disabled = sCur === 0;
  btnSR.disabled = sCur === sTotal - 1;
}

btnSL.addEventListener("click", function() { sGo(sCur - 1); });
btnSR.addEventListener("click", function() { sGo(sCur + 1); });

stackDotsEl.forEach(function(d, i) {
  d.addEventListener("click", function() { sGo(i); });
});

stackCards.forEach(function(c, i) {
  c.addEventListener("click", function() {
    if (sDragging) return;
    if (i !== sCur) {
      sGo(i);
    } else {
      openDetail(i, c.dataset.title, c.dataset.desc);
    }
  });
});

stackVP.addEventListener("mousedown", function(e) {
  sDragging = false;
  sDragDelta = 0;
  sTouchX = e.clientX;
  stackTrack.style.transition = "none";
  document.addEventListener("mousemove", sDragMove);
  document.addEventListener("mouseup", sDragUp);
});

function sDragMove(e) {
  sDragDelta = e.clientX - sTouchX;
  if (Math.abs(sDragDelta) > 5) sDragging = true;
  stackTrack.style.transform = "translateX(" + (sBase + sDragDelta) + "px)";
}

function sDragUp() {
  document.removeEventListener("mousemove", sDragMove);
  document.removeEventListener("mouseup", sDragUp);
  if (Math.abs(sDragDelta) > 60) {
    sGo(sDragDelta < 0 ? sCur + 1 : sCur - 1);
  } else {
    sGo(sCur);
  }
  sDragDelta = 0;
  setTimeout(function() { sDragging = false; }, 10);
}

stackVP.addEventListener("touchstart", function(e) {
  sTouchX = e.touches[0].clientX;
  stackTrack.style.transition = "none";
}, { passive: true });

stackVP.addEventListener("touchmove", function(e) {
  const delta = e.touches[0].clientX - sTouchX;
  stackTrack.style.transform = "translateX(" + (sBase + delta) + "px)";
}, { passive: true });

stackVP.addEventListener("touchend", function(e) {
  const diff = sTouchX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    sGo(diff > 0 ? sCur + 1 : sCur - 1);
  } else {
    sGo(sCur);
  }
}, { passive: true });

window.addEventListener("resize", function() { sGo(sCur, false); });

sGo(0, false);

// ============================
// BACKGROUND MUSIC
// ============================
const music = document.getElementById("bgMusic");
const btn   = document.getElementById("musicBtn");

let isPlaying = false;

function startMusic() {
  if (!isPlaying) {
    music.play().then(() => {
      isPlaying = true;
      btn.textContent = "🔇";
    }).catch(() => {
      console.log("Autoplay blocked until user interacts");
    });
  }
}

btn.addEventListener("click", () => {
  if (!isPlaying) {
    music.play();
    btn.textContent = "🔇";
  } else {
    music.pause();
    btn.textContent = "🔊";
  }
  isPlaying = !isPlaying;
});

document.addEventListener("click", startMusic, { once: true });
