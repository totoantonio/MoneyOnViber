const topbar = document.querySelector(".topbar");
const menuToggle = document.querySelector(".menu-toggle");
const topbarNav = document.querySelector("#primary-nav");
const methodCards = document.querySelectorAll(".method");
const designRevealTargets = document.querySelectorAll([
  ".narrative-card",
  ".audience-card",
  ".details-grid > *",
  ".chapter-row",
  ".credibility-product",
  ".credibility-card",
  ".offer-copy",
  ".buy-choice",
  ".payment-options",
  ".faq-item"
].join(","));
const gumroadLinks = document.querySelectorAll('a[href*="gumroad"]');
const copyEmailButton = document.querySelector("[data-copy-email]");

function trackMetaEvent(eventName, parameters = {}) {
  if (typeof window.fbq !== "function") return;
  window.fbq("trackCustom", eventName, parameters);
}

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

function setupDesignReveal() {
  if (!designRevealTargets.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  designRevealTargets.forEach((element, index) => {
    element.classList.add("design-reveal");
    element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 55}ms`);
  });

  if (reducedMotion.matches || typeof IntersectionObserver === "undefined") {
    designRevealTargets.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      instance.unobserve(entry.target);
    });
  }, {
    threshold: 0.14,
    rootMargin: "0px 0px -10% 0px"
  });

  designRevealTargets.forEach((element) => observer.observe(element));
}

setupDesignReveal();

gumroadLinks.forEach((link) => {
  link.addEventListener("click", () => {
    trackMetaEvent("GumroadClick", {
      destination: "gumroad",
      product: "money-on-viber"
    });
    trackMetaEvent("InitiateCheckout", {
      currency: "PHP",
      value: 199
    });
  });
});

copyEmailButton?.addEventListener("click", async () => {
  const email = copyEmailButton.getAttribute("data-copy-email");
  if (!email || !navigator.clipboard?.writeText) return;

  try {
    await navigator.clipboard.writeText(email);
    copyEmailButton.textContent = "Copied";
    trackMetaEvent("EmailCopied", {
      destination: "manual-payment-email",
      product: "money-on-viber"
    });

    window.setTimeout(() => {
      copyEmailButton.textContent = "Copy email";
    }, 1600);
  } catch (error) {
    console.error("Failed to copy email address.", error);
  }
});
