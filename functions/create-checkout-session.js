import Stripe from "stripe";
import { trackEvent, captureError } from "./telemetry";

/**
 * Create Stripe Checkout Session
 * POST JSON: { priceType: "one_month" | "sub_monthly" | "sub_yearly", discord_user_id: string }
 */
export async function onRequest(context) {
	const { request, env } = context;

	if (request.method !== "POST") {
		return new Response("Method Not Allowed", { status: 405 });
	}

	const {
		STRIPE_SECRET_KEY,
		STRIPE_PRICE_ONE_MONTH,
		STRIPE_PRICE_SUB_MONTHLY,
		STRIPE_PRICE_SUB_YEARLY,
		APP_BASE_URL,
	} = env;

	if (
		!STRIPE_SECRET_KEY ||
		!STRIPE_PRICE_ONE_MONTH ||
		!STRIPE_PRICE_SUB_MONTHLY ||
		!STRIPE_PRICE_SUB_YEARLY ||
		!APP_BASE_URL
	) {
		return new Response("Missing Stripe env", { status: 503 });
	}

	let body;
	try {
		body = await request.json();
	} catch (_) {
		return new Response("Invalid JSON", { status: 400 });
	}

	const {
		priceType,
		discord_user_id,
		avatar_url,
		consent_roles,
		consent_terms,
	} = body || {};
	if (!priceType || !discord_user_id) {
		return new Response("Missing priceType or discord_user_id", {
			status: 400,
		});
	}

	const priceMap = {
		one_month: STRIPE_PRICE_ONE_MONTH,
		sub_monthly: STRIPE_PRICE_SUB_MONTHLY,
		sub_yearly: STRIPE_PRICE_SUB_YEARLY,
	};

	const priceId = priceMap[priceType];
	if (!priceId) {
		return new Response("Invalid priceType", { status: 400 });
	}

	// Use account default API version; avoid pinning to unavailable future versions.
	const stripe = new Stripe(STRIPE_SECRET_KEY);

	const mode = priceType === "one_month" ? "payment" : "subscription";

	try {
		const customer = await findOrCreateCustomer(
			stripe,
			discord_user_id,
			avatar_url
		);

		const session = await stripe.checkout.sessions.create({
			mode,
			customer: customer.id,
			line_items: [{ price: priceId, quantity: 1 }],
			success_url: `${APP_BASE_URL}/thanks?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${APP_BASE_URL}/membership?checkout=cancel`,
			metadata: {
				discord_user_id,
				price_type: priceType,
				avatar_url: avatar_url || "",
				consent_roles: String(consent_roles),
				consent_terms: String(consent_terms),
			},
			subscription_data:
				mode === "subscription"
					? {
							metadata: { discord_user_id, price_type: priceType },
					  }
					: undefined,
			payment_intent_data:
				mode === "payment"
					? { metadata: { discord_user_id, price_type: priceType } }
					: undefined,
			client_reference_id: discord_user_id,
		});

		trackEvent(
			"checkout_session_created",
			{ priceType, mode, customerId: customer.id },
			env
		);

		return new Response(JSON.stringify({ url: session.url }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		captureError(err, { stage: "checkout_session_create", priceType }, env);
		return new Response("Stripe error", { status: 500 });
	}
}

async function findOrCreateCustomer(stripe, discordUserId, avatarUrl) {
	// Stripe Search API is available for Customers. We rely on metadata to find the same user.
	const query = `metadata['discord_user_id']:'${discordUserId}'`;
	const existing = await stripe.customers.search({ query, limit: 1 });
	if (existing?.data?.length) {
		const customer = existing.data[0];
		if (avatarUrl && customer.metadata?.avatar_url !== avatarUrl) {
			await stripe.customers.update(customer.id, {
				metadata: { avatar_url: avatarUrl },
			});
		}
		return customer;
	}

	return stripe.customers.create({
		metadata: { discord_user_id: discordUserId, avatar_url: avatarUrl || "" },
	});
}
