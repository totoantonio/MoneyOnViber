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

const currencyConfig = {
  PH: { currency: "PHP", amount: 199, locale: "en-PH" },
  US: { currency: "USD", amount: 3.32, locale: "en-US" },
  CA: { currency: "USD", amount: 3.32, locale: "en-CA" },
  GB: { currency: "USD", amount: 3.32, locale: "en-GB" },
  AU: { currency: "USD", amount: 3.32, locale: "en-AU" },
  NZ: { currency: "USD", amount: 3.32, locale: "en-NZ" },
  SG: { currency: "USD", amount: 3.32, locale: "en-SG" },
  MY: { currency: "USD", amount: 3.32, locale: "en-MY" },
  AE: { currency: "USD", amount: 3.32, locale: "en-AE" }
};

function setMessage(message, state) {
  formMessage.textContent = message;
  formMessage.dataset.state = state;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function getRegionFromBrowser() {
  const locale = navigator.language || "en-PH";
  const localeMatch = locale.match(/-([A-Z]{2})$/i);

  if (localeMatch) {
    return localeMatch[1].toUpperCase();
  }

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  if (timeZone.startsWith("Asia/Manila")) {
    return "PH";
  }

  return "PH";
}

function formatPriceForRegion(region) {
  const config = currencyConfig[region] || currencyConfig.PH;
  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.currency,
    maximumFractionDigits: config.currency === "PHP" ? 0 : 2
  }).format(config.amount);
}

if (priceInput) {
  const region = getRegionFromBrowser();
  priceInput.value = formatPriceForRegion(region);
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const paymentMethod = paymentMethodInput.value;
  const region = getRegionFromBrowser();

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
        region,
        displayedPrice: priceInput?.value || "",
        createdAt: new Date().toISOString()
      })
    );
  } catch (error) {
    console.warn("Local storage unavailable:", error);
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
        region,
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
