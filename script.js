const paymentLinks = {
  gcash: "https://example.com/gcash-payment-link",
  maya: "https://example.com/maya-payment-link",
  paypal: "https://example.com/paypal-payment-link",
  viberpay: "https://example.com/viberpay-payment-link"
};

const form = document.querySelector("#purchase-form");
const emailInput = document.querySelector("#email");
const paymentMethodInput = document.querySelector("#payment-method");
const formMessage = document.querySelector("#form-message");
const priceInput = document.querySelector("#price");
const formNote = document.querySelector("#form-note");
const gcashPanel = document.querySelector("#gcash-panel");
const topbar = document.querySelector(".topbar");
const menuToggle = document.querySelector(".menu-toggle");
const topbarNav = document.querySelector("#primary-nav");

function setMessage(message, state) {
  formMessage.textContent = message;
  formMessage.dataset.state = state;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function setMenuState(isOpen) {
  if (!topbar || !menuToggle || !topbarNav) {
    return;
  }

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
  link.addEventListener("click", () => {
    setMenuState(false);
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 720) {
    setMenuState(false);
  }
});

function updatePaymentUI() {
  const paymentMethod = paymentMethodInput?.value || "gcash";
  const isGCash = paymentMethod === "gcash";

  if (gcashPanel) {
    gcashPanel.hidden = !isGCash;
  }

  if (formNote) {
    formNote.textContent = isGCash
      ? "Enter your email, scan the QR code, and send your proof of payment by email for delivery confirmation."
      : "Enter your email first. Payment opens in the next step so the purchase can be matched to your delivery address.";
  }
}

updatePaymentUI();
paymentMethodInput?.addEventListener("change", updatePaymentUI);

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const paymentMethod = paymentMethodInput.value;

  if (!isValidEmail(email)) {
    setMessage("Enter a valid email address before continuing.", "error");
    emailInput.focus();
    return;
  }

  try {
    localStorage.setItem(
      "ebookPurchaseLead",
      JSON.stringify({
        email,
        paymentMethod,
        displayedPrice: priceInput?.value || "",
        createdAt: new Date().toISOString()
      })
    );
  } catch (error) {
    console.warn("Local storage unavailable:", error);
  }

  if (paymentMethod === "gcash") {
    setMessage("Complete your GCash payment, then email the proof of payment to alfiesuperhalk@gmail.com.", "success");
    return;
  }

  try {
    setMessage("Preparing your checkout.", "success");

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        email,
        paymentMethod,
        region: "GLOBAL",
        displayedPrice: priceInput?.value || ""
      })
    });

    const result = await response.json();
    if (!response.ok || !result.paymentUrl) {
      throw new Error(result.error || "Checkout failed.");
    }

    window.location.href = result.paymentUrl;
  } catch (error) {
    if (hasConfiguredClientPaymentLink(paymentMethod)) {
      const fallbackUrl = new URL(paymentLinks[paymentMethod]);
      fallbackUrl.searchParams.set("email", email);
      fallbackUrl.searchParams.set("product", "making-money-on-viber-ebook");
      setMessage("Opening your payment page.", "success");
      window.location.href = fallbackUrl.toString();
      return;
    }

    setMessage("Checkout is not configured yet. Add your payment links and Cloudflare bindings first.", "error");
  }
});

function hasConfiguredClientPaymentLink(paymentMethod) {
  const paymentUrl = paymentLinks[paymentMethod];
  return Boolean(paymentUrl) && !paymentUrl.includes("example.com");
}
