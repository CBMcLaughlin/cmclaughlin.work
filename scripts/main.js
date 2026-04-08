const scrollBar = document.getElementById("scroll-progress");
const themeToggle = document.getElementById("theme-toggle");
const revealEls = [...document.querySelectorAll(".reveal")];
const filterWrap = document.getElementById("experience-filter");
const timelineItems = [...document.querySelectorAll(".timeline-item")];
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
const isPortraitCoarse = window.matchMedia(
  "(orientation: portrait) and (pointer: coarse)"
);

function updateScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  scrollBar.style.width = `${percent}%`;
}

function scrollPageToTop() {
  window.scrollTo(0, 0);
}

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
scrollPageToTop();
requestAnimationFrame(() => {
  scrollPageToTop();
  requestAnimationFrame(scrollPageToTop);
});
window.addEventListener("load", () => {
  scrollPageToTop();
  setTimeout(scrollPageToTop, 0);
});

function setToggleIcon(isLight) {
  if (!themeToggle) return;
  themeToggle.innerHTML = isLight
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
}

/** Portrait phones: follow OS light/dark; ignore saved site preference. */
function applySystemTheme() {
  const shouldUseLight = !prefersDarkScheme.matches;
  document.body.classList.toggle("light", shouldUseLight);
  setToggleIcon(shouldUseLight);
}

/** Desktop / non-portrait-touch: use manual preference from localStorage. */
function applyStoredDesktopTheme() {
  const storedTheme = localStorage.getItem("cm-theme");
  const shouldUseLight = storedTheme === "light";
  document.body.classList.toggle("light", shouldUseLight);
  setToggleIcon(shouldUseLight);
}

function toggleTheme() {
  if (isPortraitCoarse.matches) return;
  const isLight = document.body.classList.toggle("light");
  localStorage.setItem("cm-theme", isLight ? "light" : "dark");
  setToggleIcon(isLight);
}

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

function setupFilter() {
  if (!filterWrap) return;

  filterWrap.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;

    const filter = button.dataset.filter;
    filterWrap.querySelectorAll("button").forEach((chip) => {
      chip.classList.remove("active");
    });
    button.classList.add("active");

    timelineItems.forEach((item) => {
      const mode = item.dataset.mode;
      const visible = filter === "all" || filter === mode;
      item.classList.toggle("hidden", !visible);
    });
  });
}

function setupTypedLine() {
  if (!window.Typed) return;
  const target = document.getElementById("typed-text");
  if (!target) return;

  new window.Typed(target, {
    strings: [
      "Deskside Support Engineer",
      "Network + Endpoint Troubleshooter",
      "Automation-Focused IT Administrator",
    ],
    typeSpeed: 42,
    backSpeed: 24,
    backDelay: 1400,
    loop: true,
  });
}

if (isPortraitCoarse.matches) {
  applySystemTheme();
} else {
  applyStoredDesktopTheme();
}

isPortraitCoarse.addEventListener("change", () => {
  if (isPortraitCoarse.matches) {
    applySystemTheme();
  } else {
    applyStoredDesktopTheme();
  }
});

prefersDarkScheme.addEventListener("change", () => {
  if (isPortraitCoarse.matches) {
    applySystemTheme();
  }
});

setupReveal();
setupFilter();
setupTypedLine();
updateScrollProgress();

window.addEventListener("scroll", () => {
  updateScrollProgress();
});

themeToggle?.addEventListener("click", toggleTheme);
