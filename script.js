const sectionMenu = document.querySelector(".section-menu");
sectionMenu.querySelectorAll("nav a").forEach((anchor) => {
  anchor.addEventListener("click", () => {
    sectionMenu.open = false;
    document.querySelector(anchor.hash).focus({ preventScroll: true });
  });
});
document.addEventListener("click", (event) => {
  if (!sectionMenu.contains(event.target)) sectionMenu.open = false;
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && sectionMenu.open) {
    sectionMenu.open = false;
    sectionMenu.querySelector("summary").focus();
  }
});

// Paste your full profile and project URLs between the quotation marks.
const links = {
  github: "https://github.com/yusuf-s-ahmed",
  linkedin: "https://www.linkedin.com/in/yusuf-s-ahmed",
  llm: "https://github.com/yusuf-s-ahmed/local-llm-agentic-system",
  molecules: "https://github.com/yusuf-s-ahmed/molecular-classification-experiment",
};

document.querySelectorAll("[data-link]").forEach((anchor) => {
  const url = links[anchor.dataset.link];
  if (url) {
    anchor.href = url;
    anchor.removeAttribute("aria-disabled");
  } else {
    anchor.title = "Link not added yet";
  }
});

// Discourage saving the portrait through the browser's image menu.
document.querySelectorAll(".portrait").forEach((portrait) => {
  portrait.addEventListener("contextmenu", (event) => event.preventDefault());
  portrait.addEventListener("dragstart", (event) => event.preventDefault());
});

// Native inline players handle playback, seeking, volume and fullscreen.
const projectVideos = document.querySelectorAll('.project-video');
projectVideos.forEach((video) => {
  const status = video.parentElement.querySelector('.video-status');
  video.addEventListener('error', () => { status.hidden = false; });
  video.addEventListener('playing', () => { status.hidden = true; });
  video.addEventListener('play', () => {
    projectVideos.forEach((other) => { if (other !== video) other.pause(); });
  });
});

// Keep the layout tidy until you add your three image files.
document.querySelectorAll(".image-slot img").forEach((img) => {
  const update = () => {
    img.parentElement.classList.toggle("is-missing", img.naturalWidth === 0);
  };
  img.addEventListener("load", update);
  img.addEventListener("error", update);
  if (img.complete) update();
});

// A tapered ink underline follows the currently active section heading.
const highlightedSections = [...document.querySelectorAll('main > section[id]')];
highlightedSections.forEach((section) => {
  const heading = section.querySelector('h2');
  heading.classList.add('section-heading');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'heading-highlight');
  svg.setAttribute('viewBox', '0 0 200 12');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M2 7 C42 3 78 4 113 5 C145 6 174 4 198 3 C177 7 147 9 113 8 C76 7 40 6 2 7 Z');
  svg.appendChild(path);
  heading.appendChild(svg);
});
const updateActiveSection = () => {
  let next = highlightedSections[0];
  highlightedSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= window.innerHeight * 0.4) next = section;
  });
  const pageHeight = document.documentElement.scrollHeight;
  if (pageHeight > window.innerHeight && window.scrollY + window.innerHeight >= pageHeight - 4) {
    next = highlightedSections[highlightedSections.length - 1];
  }
  highlightedSections.forEach((section) => {
    const heading = section.querySelector('h2');
    const bounds = heading.getBoundingClientRect();
    const inView = bounds.bottom > 0 && bounds.top < window.innerHeight;
    heading.classList.toggle('is-offscreen', !inView);
    heading.classList.toggle('is-active', section === next && inView);
  });
};
updateActiveSection();

// Reveal on downward scroll; upward scroll shows content immediately.
{
  const revealElements = document.querySelectorAll(
    ".intro > div, .about > *, .portfolio > h2, .project, .experience > h2, .role, .education > h2, .qualification, footer > *"
  );
  let lastScrollY = Math.max(0, window.scrollY);
  let scrollingUp = false;
  let framePending = false;
  revealElements.forEach((element) => {
    element.classList.toggle("is-visible", element.getBoundingClientRect().top < window.innerHeight);
    element.classList.add("scroll-reveal");
  });

  const updateReveals = () => {
    framePending = false;
    updateActiveSection();
    const scrollY = Math.max(0, window.scrollY);
    if (scrollY !== lastScrollY) scrollingUp = scrollY < lastScrollY;
    lastScrollY = scrollY;
    document.documentElement.classList.toggle("scrolling-up", scrollingUp);
    revealElements.forEach((element) => {
      const top = element.getBoundingClientRect().top;
      if (top >= window.innerHeight) {
        element.classList.remove("is-visible");
      } else {
        element.classList.add("is-visible");
      }
    });
  };
  const scheduleReveals = () => {
    if (!framePending) {
      framePending = true;
      window.requestAnimationFrame(updateReveals);
    }
  };
  window.addEventListener("scroll", scheduleReveals, { passive: true });
  window.addEventListener("resize", scheduleReveals);
}
