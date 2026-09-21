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

// Put the two MOV files in the videos folder using these filenames.
const projects = {
  llm: { title: "Local LLM Agentic System", video: "videos/project-llm.mov" },
  molecules: { title: "Molecular Classification Experiment", video: "videos/project-molecules.mov" },
};

const dialog = document.querySelector("#project-dialog");
const video = document.querySelector("#project-video");
const videoStatus = document.querySelector("#video-status");
let projectTrigger;

document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.project;
    const project = projects[key];
    projectTrigger = button;
    document.querySelector("#dialog-title").textContent = project.title;
    document.querySelector("#project-github").href = links[key];
    videoStatus.hidden = true;
    video.setAttribute("aria-label", `${project.title} demonstration video`);
    video.src = project.video;
    video.load();
    dialog.showModal();
    document.body.classList.add("modal-open");
  });
});

video.addEventListener("error", () => {
  if (dialog.open && video.hasAttribute("src")) videoStatus.hidden = false;
});
video.addEventListener("loadeddata", () => { videoStatus.hidden = true; });
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) {
    dialog.close();
  }
});
// Native dialog handles Escape and keeps keyboard focus inside the popup.
dialog.addEventListener("close", () => {
  video.pause();
  video.removeAttribute("src");
  video.load();
  document.body.classList.remove("modal-open");
  projectTrigger?.focus();
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
    const scrollY = Math.max(0, window.scrollY);
    if (scrollY !== lastScrollY) scrollingUp = scrollY < lastScrollY;
    lastScrollY = scrollY;
    document.documentElement.classList.toggle("scrolling-up", scrollingUp);
    revealElements.forEach((element) => {
      const top = element.getBoundingClientRect().top;
      if (top >= window.innerHeight) {
        element.classList.remove("is-visible");
      } else if (scrollingUp || top < window.innerHeight - 48) {
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
