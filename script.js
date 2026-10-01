/* =========================================
   NIGERIA INDEPENDENCE — CINEMATIC V3
   RESPONSIVE SCRIPT — PART 1/2
   Scroll Engine + Loader + Timeline + Culture
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
      `translate3d(${-currentX}px, 0, 0)`;
  }


  if (progressBar) {
    progressBar.style.width =
      `${currentProgress * 100}%`;
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
   RESIZE HANDLING
   ========================================= */

let resizeTimer;

function handleResize() {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    calculateDimensions();

    currentProgress =
      getScrollProgress();

    targetX =
      currentProgress *
      maxHorizontalScroll;

    currentX = targetX;

    if (track) {
      track.style.transform =
        `translate3d(${-currentX}px, 0, 0)`;
    }
  }, 120);
}

window.addEventListener(
  "resize",
  handleResize
);


/*
  Mobile browsers resize the visual viewport
  when their address bar appears/disappears.
*/

if (window.visualViewport) {
  window.visualViewport.addEventListener(
    "resize",
    handleResize
  );
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


/*
  Content shown when a year is selected.
*/

const timelineData = {
  "1960": {
    kicker: "INDEPENDENCE",

    title:
      "A beginning<br>of our own.",

    text:
      "Nigeria became an independent and sovereign nation on October 1."
  },

  "1963": {
    kicker: "REPUBLIC",

    title:
      "A new chapter<br>takes shape.",

    text:
      "A new chapter in Nigeria's constitutional story."
  },

  "1999": {
    kicker: "FOURTH REPUBLIC",

    title:
      "Another chapter<br>begins.",

    text:
      "Another chapter in Nigeria's democratic story."
  },

  "2026": {
    kicker: "NOW",

    title:
      "The story<br>continues.",

    text:
      "The future is still being written."
  }
};


/* Change timeline content */

function selectYear(yearElement, index) {
  if (!yearElement) return;

  const selectedYear =
    yearElement.dataset.year;

  const data =
    timelineData[selectedYear];

  if (!data) return;


  /* Remove old active state */

  years.forEach((year) => {
    year.classList.remove("active");
  });


  /* Activate selected year */

  yearElement.classList.add("active");


  /* Update text */

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


  /* Update timeline green line */

  if (timelineProgress) {
    const percentage =
      ((index + 1) / years.length) * 100;

    timelineProgress.style.width =
      `${percentage}%`;
  }
}


/* Add interaction */

years.forEach((year, index) => {

  year.addEventListener(
    "click",
    () => {
      selectYear(year, index);
    }
  );

});


/* Set initial timeline state */

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


/* Select culture object */

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


/* Add click/touch interaction */

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


/* Set first culture object as active */

if (cultureObjects.length) {
  selectCulture(
    cultureObjects[0],
    0
  );
}
