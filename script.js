const topbar = document.querySelector(".topbar");
const menuToggle = document.querySelector(".menu-toggle");
const topbarNav = document.querySelector("#primary-nav");
const methodCards = document.querySelectorAll(".method");

function setMenuState(isOpen) {
  if (!topbar || !menuToggle || !topbarNav) return;
  topbar.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
}

setMenuState(false);

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  setMenuState(!isOpen);
});

topbarNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 720) setMenuState(false);
});

function setupMethodReveal() {
  if (!methodCards.length) return;

  const mobileViewport = window.matchMedia("(max-width: 719px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  methodCards.forEach((card) => card.classList.remove("method-visible"));

  if (!mobileViewport.matches || reducedMotion.matches || typeof IntersectionObserver === "undefined") {
    methodCards.forEach((card) => card.classList.add("method-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("method-visible");
      instance.unobserve(entry.target);
    });
  }, {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px"
  });

  methodCards.forEach((card, index) => {
    card.style.setProperty("--method-delay", `${index * 45}ms`);
    observer.observe(card);
  });
}

setupMethodReveal();
