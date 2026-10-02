/* =========================================
   NIGERIA INDEPENDENCE — CINEMATIC V3
   RESPONSIVE SCRIPT — FULLY INTEGRATED
   Scroll Engine + Loader + Synchronized Touch Inertia + Timeline + Culture + Canvas
   ========================================= */

const world = document.querySelector(".world");
const track = document.getElementById("track");
const progressBar = document.getElementById("progress");
const chapter = document.getElementById("chapter");
const loader = document.getElementById("loader");

const panels = [...document.querySelectorAll(".panel")];

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const isTouchDevice = window.matchMedia(
  "(hover: none) and (pointer: coarse)"
).matches;


/* =========================================
   SYNCHRONIZED TOUCH MOMENTUM & INERTIA
   ========================================= */

let startY = 0;
let lastY = 0;
let touchVelocity = 0;
let lastTouchTime = 0;
let isDragging = false;
let animationId = null;

window.addEventListener("pointerdown", (e) => {
  if (!isTouchDevice) return;
  isDragging = true;
  startY = e.clientY;
  lastY = e.clientY;
  lastTouchTime = performance.now();
  cancelAnimationFrame(animationId);
}, { passive: true });

window.addEventListener("pointermove", (e) => {
  if (!isDragging || !isTouchDevice) return;
  const currentY = e.clientY;
  const currentTime = performance.now();
  
  const deltaY = currentY - lastY;
  const deltaTime = currentTime - lastTouchTime;
  
  if (deltaTime > 0) {
    // Calculate vertical drag velocity to translate into scroll momentum
    touchVelocity = -deltaY / deltaTime; 
  }
  
  lastY = currentY;
  lastTouchTime = currentTime;

  // Directly scroll the window proportionally to the drag distance
  window.scrollBy({ top: -deltaY * 1.5, behavior: 'auto' });
}, { passive: true });

window.addEventListener("pointerup", () => {
  if (!isTouchDevice || !isDragging) return;
  isDragging = false;

  // Inertia glide loop using vertical window scrolling
  function inertiaScrollStep() {
    if (Math.abs(touchVelocity) < 0.05) return;

    window.scrollBy({ top: touchVelocity * 16, behavior: 'auto' });
    touchVelocity *= 0.92; // Friction damping

    animationId = requestAnimationFrame(inertiaScrollStep);
  }

  animationId = requestAnimationFrame(inertiaScrollStep);
}, { passive: true });


/* =========================================
   LOADER
   ========================================= */

function hideLoader() {
  if (!loader) return;

  loader.classList.add("hidden");
}

window.addEventListener("load", () => {
  setTimeout(hideLoader, 450);
});

/* Safety fallback in case load takes too long */

setTimeout(hideLoader, 1800);


/* =========================================
   HORIZONTAL SCROLL ENGINE
   ========================================= */

let maxHorizontalScroll = 0;
let verticalScrollRange = 1;

let targetX = 0;
let currentX = 0;

let currentProgress = 0;


/* Recalculate measurements */

function calculateDimensions() {
  if (!world || !track) return;

  maxHorizontalScroll =
    Math.max(
      0,
      track.scrollWidth - window.innerWidth
    );

  verticalScrollRange =
    Math.max(
      1,
      world.offsetHeight - window.innerHeight
    );
}


/* Keep numbers inside a range */

function clamp(value, min, max) {
  return Math.min(
    Math.max(value, min),
    max
  );
}


/* Calculate how far through the experience we are */

function getScrollProgress() {
  if (!world) return 0;

  const worldTop = world.offsetTop;

  const travelled =
    window.scrollY - worldTop;

  return clamp(
    travelled / verticalScrollRange,
    0,
    1
  );
}


/* Chapter labels */

const chapterNames = [
  "00 — INDEPENDENCE",
  "01 — BEGINNING",
  "02 — THE ROAD",
  "03 — THE PEOPLE",
  "04 — CULTURE",
  "05 — NEXT",
  "06 — YOUR TURN"
];


/* Update header chapter */

function updateChapter(progress) {
  if (!chapter || panels.length === 0) return;

  const rawIndex =
    progress * panels.length;

  const index = clamp(
    Math.floor(rawIndex),
    0,
    panels.length - 1
  );

  chapter.textContent =
    chapterNames[index] ||
    chapterNames[chapterNames.length - 1];
}


/* Main animation loop */

function animateHorizontalScroll() {
  currentProgress =
    getScrollProgress();

  targetX =
    currentProgress *
    maxHorizontalScroll;


  /*
     On phones/touch devices we follow the
     scroll more closely.

     This makes the horizontal experience
     feel responsive instead of lagging
     behind the user's finger.
  */

  if (
    isTouchDevice ||
    prefersReducedMotion
  ) {
    currentX = targetX;
  } else {
    currentX +=
      (targetX - currentX) * 0.1;

    if (
      Math.abs(targetX - currentX) < 0.1
    ) {
      currentX = targetX;
    }
  }


  if (track) {
    track.style.transform =
      `translate3d(${- currentX}px, 0, 0)`;
  }


  if (progressBar) {
    progressBar.style.width =
      `${ currentProgress * 100 }% `;
  }


  updateChapter(currentProgress);

  requestAnimationFrame(
    animateHorizontalScroll
  );
}


/* Initial calculations */

calculateDimensions();

requestAnimationFrame(
  animateHorizontalScroll
);


/* =========================================
   ROBUST RESIZE & VIEWPORT HANDLING
   ========================================= */

let resizeTimer;

function handleResize() {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    calculateDimensions();
    initializeCanvases();

    currentProgress = getScrollProgress();
    targetX = currentProgress * maxHorizontalScroll;
    currentX = targetX;

    if (track) {
      track.style.transform = `translate3d(${- currentX}px, 0, 0)`;
    }
  }, 250);
}

window.addEventListener("resize", handleResize, { passive: true });

if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", () => {
    if (window.visualViewport.width !== window.innerWidth) {
      handleResize();
    }
  }, { passive: true });
}


/* =========================================
   TIMELINE
   ========================================= */

const years =
  [...document.querySelectorAll(".year")];

const detailYear =
  document.getElementById("detailYear");

const detailKicker =
  document.getElementById("detailKicker");

const detailTitle =
  document.getElementById("detailTitle");

const detailText =
  document.getElementById("detailText");

const timelineProgress =
  document.querySelector(".time-line i");


const timelineData = {
  "1960": {
    kicker: "INDEPENDENCE",

    title:
      "A beginning of our own.",

  
text:
  "Nigeria became an independent and sovereign nation on October 1."



},

"1963": {
  kicker: "REPUBLIC",

    
title:
  "A new chapter takes shape.",

    
text:
  "A new chapter in Nigeria's constitutional story."



},

"1999": {
  kicker: "FOURTH REPUBLIC",

    
title:
  "Another chapter begins.",

    
text:
  "Another chapter in Nigeria's democratic story."



},

"2026": {
  kicker: "NOW",

    
title:
  "The story continues.",

    
text:
  "The future is still being written."



}
};

function selectYear(yearElement, index) {
  if (!yearElement) return;

  const selectedYear =
    yearElement.dataset.year;

  const data =
    timelineData[selectedYear];

  if (!data) return;

  years.forEach((year) => {
    year.classList.remove("active");
  });

  yearElement.classList.add("active");

  if (detailYear) {
    detailYear.textContent =
      selectedYear;
  }

  if (detailKicker) {
    detailKicker.textContent =
      data.kicker;
  }

  if (detailTitle) {
    detailTitle.innerHTML =
      data.title;
  }

  if (detailText) {
    detailText.textContent =
      data.text;
  }

  if (timelineProgress) {
    const percentage =
      ((index + 1) / years.length) * 100;

    
timelineProgress.style.width =
  `${ percentage }% `;



  }
}

years.forEach((year, index) => {
  year.addEventListener(
    "click",
    () => {
      selectYear(year, index);
    }
  );
});

if (years.length) {
  const activeIndex =
    Math.max(
      0,
      years.findIndex(
        (year) =>
          year.classList.contains("active")
      )
    );

  selectYear(
    years[activeIndex],
    activeIndex
  );
}

/* =========================================
CULTURE INTERACTIONS
========================================= */

const cultureObjects =
  [
    ...document.querySelectorAll(
      ".culture-object"
    )
  ];

const cultureNumber =
  document.getElementById("cultureNum");

const cultureName =
  document.getElementById("cultureName");

const cultureText =
  document.getElementById("cultureText");

const cultureData = {
  MUSIC: {
    text:
      "Rhythm becomes memory."
  },

  LANGUAGE: {
    text:
      "Many voices, one evolving conversation."
  },

  FOOD: {
    text:
      "Memory, gathering and flavour on a plate."
  },

  FASHION: {
    text:
      "Identity worn boldly."
  },

  ART: {
    text:
      "Imagination made visible."
  }
};

function selectCulture(
  cultureObject,
  index
) {
  if (!cultureObject) return;

  const name =
    cultureObject.dataset.name;

  const data =
    cultureData[name];

  if (!data) return;

  cultureObjects.forEach((item) => {
    item.classList.remove("active");
  });

  cultureObject.classList.add(
    "active"
  );

  if (cultureNumber) {
    cultureNumber.textContent =
      String(index + 1).padStart(
        2,
        "0"
      );
  }

  if (cultureName) {
    cultureName.textContent = name;
  }

  if (cultureText) {
    cultureText.textContent =
      data.text;
  }
}

cultureObjects.forEach(
  (cultureObject, index) => {
    cultureObject.addEventListener(
      "click",
      () => {
        selectCulture(
          cultureObject,
          index
        );
      }
    );
  }
);

if (cultureObjects.length) {
  selectCulture(
    cultureObjects[0],
    0
  );
}

/* =========================================
MESSAGE FORM
========================================= */

const form =
  document.getElementById("form");

const nameInput =
  document.getElementById("name");

const messageInput =
  document.getElementById("message");

const messageOut =
  document.getElementById("messageOut");

const STORAGE_KEY =
  "nigeria-independence-message";

function displayMessage(name, message) {
  if (!messageOut) return;

  messageOut.textContent =
    `\({name.toUpperCase()} — “\){message}”`;
}

function loadSavedMessage() {
  try {
    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    
if (!saved) return;

const data =
  JSON.parse(saved);

if (
  data &&
  data.name &&
  data.message
) {
  displayMessage(
    data.name,
    data.message
  );
}



  } catch (error) {
    console.warn(
      "Saved message could not be loaded."
    );
  }
}

loadSavedMessage();

if (form) {
  form.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      
  const name =
    nameInput?.value.trim();

  const message =
    messageInput?.value.trim();


  if (!name || !message) {
    return;
  }


  const entry = {
    name,
    message,
    createdAt:
      new Date().toISOString()
  };


  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(entry)
    );
  } catch (error) {
    console.warn(
      "Message could not be saved."
    );
  }


  displayMessage(
    name,
    message
  );


  form.reset();
}



);
}

/* =========================================
CANVAS HELPERS
========================================= */

const particleCanvas =
  document.getElementById("particles");

const futureCanvas =
  document.getElementById("future");

const particleContext =
  particleCanvas?.getContext("2d");

const futureContext =
  futureCanvas?.getContext("2d");

function getPixelRatio() {
  return Math.min(
    window.devicePixelRatio || 1,
    1.5
  );
}

function resizeCanvas(
  canvas,
  context
) {
  if (!canvas || !context) {
    return;
  }

  const rect =
    canvas.getBoundingClientRect();

  const ratio =
    getPixelRatio();

  canvas.width =
    Math.max(
      1,
      Math.floor(
        rect.width * ratio
      )
    );

  canvas.height =
    Math.max(
      1,
      Math.floor(
        rect.height * ratio
      )
    );

  context.setTransform(
    ratio,
    0,
    0,
    ratio,
    0,
    0
  );
}

/* =========================================
HERO PARTICLES
========================================= */

let particles = [];

function getParticleCount() {
  if (prefersReducedMotion) {
    return 12;
  }

  if (
    window.innerWidth <= 600 ||
    isTouchDevice
  ) {
    return 24;
  }

  return 55;
}

function createParticles() {
  if (!particleCanvas) {
    return;
  }

  particles = [];

  const width =
    particleCanvas.clientWidth;

  const height =
    particleCanvas.clientHeight;

  const count =
    getParticleCount();

  for (
    let i = 0;
    i < count;
    i++
  ) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.4,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.18,
      opacity: Math.random() * 0.5 + 0.15
    });
  }
}

function drawParticles() {
  if (
    !particleCanvas ||
    !particleContext
  ) {
    return;
  }

  const width =
    particleCanvas.clientWidth;

  const height =
    particleCanvas.clientHeight;

  particleContext.clearRect(
    0,
    0,
    width,
    height
  );

  for (const particle of particles) {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    
if (particle.x < 0) particle.x = width;
if (particle.x > width) particle.x = 0;
if (particle.y < 0) particle.y = height;
if (particle.y > height) particle.y = 0;

particleContext.beginPath();
particleContext.arc(
  particle.x,
  particle.y,
  particle.radius,
  0,
  Math.PI * 2
);
particleContext.fillStyle =
  `rgba(0, 184, 107, ${ particle.opacity })`;
particleContext.fill();



  }
}

/* =========================================
FUTURE NETWORK
========================================= */

let futureNodes = [];

function getFutureNodeCount() {
  if (prefersReducedMotion) {
    return 8;
  }

  if (
    window.innerWidth <= 600 ||
    isTouchDevice
  ) {
    return 14;
  }

  return 30;
}

function createFutureNodes() {
  if (!futureCanvas) {
    return;
  }

  futureNodes = [];

  const width =
    futureCanvas.clientWidth;

  const height =
    futureCanvas.clientHeight;

  const count =
    getFutureNodeCount();

  for (
    let i = 0;
    i < count;
    i++
  ) {
    futureNodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      radius: Math.random() * 1.4 + 0.6
    });
  }
}

function drawFutureNetwork() {
  if (
    !futureCanvas ||
    !futureContext
  ) {
    return;
  }

  const width =
    futureCanvas.clientWidth;

  const height =
    futureCanvas.clientHeight;

  futureContext.clearRect(
    0,
    0,
    width,
    height
  );

  futureNodes.forEach(
    (node) => {
      node.x += node.vx;
      node.y += node.vy;

      
  if (node.x <= 0 || node.x >= width) node.vx *= -1;
  if (node.y <= 0 || node.y >= height) node.vy *= -1;

  node.x = clamp(node.x, 0, width);
  node.y = clamp(node.y, 0, height);
}



);

  const connectionDistance =
    window.innerWidth <= 600
      ? 105
      : 150;

  for (
    let i = 0;
    i < futureNodes.length;
    i++
  ) {
    for (
      let j = i + 1;
      j < futureNodes.length;
      j++
    ) {
      const first = futureNodes[i];
      const second = futureNodes[j];

      
  const dx = first.x - second.x;
  const dy = first.y - second.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < connectionDistance) {
    const opacity =
      (1 - distance / connectionDistance) * 0.18;

    futureContext.beginPath();
    futureContext.moveTo(first.x, first.y);
    futureContext.lineTo(second.x, second.y);
    futureContext.strokeStyle =
      `rgba(0, 184, 107, ${ opacity })`;
    futureContext.lineWidth = 0.7;
    futureContext.stroke();
  }
}



    }

    futureNodes.forEach(
      (node) => {
        futureContext.beginPath();
        futureContext.arc(
          node.x,
          node.y,
          node.radius,
          0,
          Math.PI * 2
        );
        futureContext.fillStyle =
          "rgba(0, 184, 107, 0.55)";
        futureContext.fill();
      }
    );
  }

  /* =========================================
  CANVAS INITIALIZATION & LOOP
  ========================================= */

  function initializeCanvases() {
    resizeCanvas(particleCanvas, particleContext);
    resizeCanvas(futureCanvas, futureContext);
    createParticles();
    createFutureNodes();
  }

  initializeCanvases();

  let pageVisible = true;

  document.addEventListener(
    "visibilitychange",
    () => {
      pageVisible = !document.hidden;
    }
  );

  function animateCanvases() {
    if (pageVisible) {
      drawParticles();
      drawFutureNetwork();
    }

    requestAnimationFrame(
      animateCanvases
    );
  }

  requestAnimationFrame(
    animateCanvases
  );

  let canvasResizeTimer;

  function handleCanvasResize() {
    clearTimeout(canvasResizeTimer);
    canvasResizeTimer = setTimeout(() => {
      initializeCanvases();
    }, 180);
  }

  window.addEventListener("resize", handleCanvasResize);

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", handleCanvasResize);
  }

  /* =========================================
  MOUSE PARALLAX (NON-TOUCH)
  ========================================= */

  if (!isTouchDevice) {
    const orbit = document.querySelector(".cursor-orbit");

    if (orbit) {
      let pointerX = 0;
      let pointerY = 0;

      
window.addEventListener(
  "pointermove",
  (event) => {
    pointerX =
      (event.clientX / window.innerWidth - 0.5) * 18;
    pointerY =
      (event.clientY / window.innerHeight - 0.5) * 18;

    orbit.style.transform =
      `translate(\({ pointerX }px, calc(-50 % +\){ pointerY }px))`;
  },
  { passive: true }
);



    }
  }

  /* =========================================
  INITIAL PAGE SYNC
  ========================================= */

  window.addEventListener(
    "load",
    () => {
      setTimeout(
        () => {
          calculateDimensions();
          initializeCanvases();
        },
        250
      );
    }
  );

  

