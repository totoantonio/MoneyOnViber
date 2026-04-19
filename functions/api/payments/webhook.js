export async function onRequestPost(context) {
  const rawBody = await context.request.text();
  let payload = null;

  try {
    payload = JSON.parse(rawBody);
  } catch (error) {
    return new Response("Invalid JSON", { status: 400 });
  }

  const eventType = String(payload?.data?.attributes?.type || payload?.type || "");
  const attributes = payload?.data?.attributes?.data?.attributes || payload?.data?.attributes || {};
  const email = extractEmail(attributes);
  const providerPaymentId = extractProviderPaymentId(payload, attributes);

  await context.env.EBOOK_DB.prepare(
    `INSERT INTO payment_webhook_events (
      id,
      event_type,
      email,
      provider_payment_id,
      raw_payload,
      created_at
    ) VALUES (?, ?, ?, ?, ?, datetime('now'))`
  )
    .bind(
      crypto.randomUUID(),
      eventType || "unknown",
      email,
      providerPaymentId,
      rawBody
    )
    .run();

  if (email && isPaidEvent(eventType)) {
    await context.env.EBOOK_DB.prepare(
      `UPDATE ebook_orders
       SET status = 'paid',
           provider_payment_id = ?,
           updated_at = datetime('now')
       WHERE email = ?
         AND status = 'initiated'`
    )
      .bind(providerPaymentId, email)
      .run();
  }

  return new Response("ok", { status: 200 });
}

function extractEmail(attributes) {
  return String(
    attributes?.billing?.email ||
    attributes?.customer?.email ||
    attributes?.email ||
    ""
  ).trim().toLowerCase();
}

function extractProviderPaymentId(payload, attributes) {
  return String(
    attributes?.payment_intent_id ||
    attributes?.payment_id ||
    attributes?.id ||
    payload?.data?.id ||
    ""
  ).trim();
}

function isPaidEvent(eventType) {
  return [
    "checkout_session.payment.paid",
    "link.payment.paid",
    "payment.paid"
  ].includes(eventType);
}
