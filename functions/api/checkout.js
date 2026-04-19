export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const paymentMethod = String(body.paymentMethod || "").trim().toLowerCase();
    const region = String(body.region || "PH").trim().toUpperCase();
    const displayedPrice = String(body.displayedPrice || "").trim();

    if (!isValidEmail(email)) {
      return json({ error: "Enter a valid email address." }, 400);
    }

    const paymentUrl = getPaymentUrl(context.env, paymentMethod);
    if (!paymentUrl) {
      return json({ error: "Payment link is not configured yet." }, 500);
    }

    const checkoutId = crypto.randomUUID();

    await context.env.EBOOK_DB.prepare(
      `INSERT INTO ebook_orders (
        id,
        email,
        payment_method,
        region,
        displayed_price,
        status,
        payment_provider,
        payment_url,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, 'initiated', 'paymongo', ?, datetime('now'), datetime('now'))`
    )
      .bind(
        checkoutId,
        email,
        paymentMethod,
        region,
        displayedPrice,
        paymentUrl
      )
      .run();

    return json({
      checkoutId,
      paymentUrl
    });
  } catch (error) {
    return json({ error: "Unable to start checkout." }, 500);
  }
}

function getPaymentUrl(env, paymentMethod) {
  const links = {
    gcash: env.PAYMENT_LINK_GCASH,
    maya: env.PAYMENT_LINK_MAYA,
    paypal: env.PAYMENT_LINK_PAYPAL,
    viberpay: env.PAYMENT_LINK_VIBERPAY
  };

  return links[paymentMethod] || env.PAYMENT_LINK_DEFAULT || null;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=UTF-8"
    }
  });
}
