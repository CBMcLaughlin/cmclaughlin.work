const scrollBar = document.getElementById("scroll-progress");
const themeToggle = document.getElementById("theme-toggle");
const navLinks = [...document.querySelectorAll(".top-nav nav a")];
const sections = [...document.querySelectorAll("main section[id]")];
const revealEls = [...document.querySelectorAll(".reveal")];
const filterWrap = document.getElementById("experience-filter");
const timelineItems = [...document.querySelectorAll(".timeline-item")];

function updateScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  scrollBar.style.width = `${percent}%`;
}

function updateActiveNav() {
  const offset = window.scrollY + 120;
  let activeId = sections[0]?.id ?? "";

  sections.forEach((section) => {
    if (offset >= section.offsetTop) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const target = link.getAttribute("href")?.replace("#", "");
    link.classList.toggle("active", target === activeId);
  });
}

function restoreTheme() {
  const storedTheme = localStorage.getItem("cm-theme");
  if (storedTheme === "light") {
    document.body.classList.add("light");
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
}

function toggleTheme() {
  const isLight = document.body.classList.toggle("light");
  localStorage.setItem("cm-theme", isLight ? "light" : "dark");
  themeToggle.innerHTML = isLight
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
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

restoreTheme();
setupReveal();
setupFilter();
setupTypedLine();
updateScrollProgress();
updateActiveNav();

window.addEventListener("scroll", () => {
  updateScrollProgress();
  updateActiveNav();
});

themeToggle?.addEventListener("click", toggleTheme);
