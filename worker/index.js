const CONTACT_SUBJECT = "GAKEYRU TEST PETICIÓN";

const jsonResponse = (data, status = 200, headers = {}) =>
    new Response(JSON.stringify(data), {
        status,
        headers,
    });

const sanitizeText = (value) => String(value).trim().replace(/\0/g, "");

const escapeHtml = (value) =>
    String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getCorsHeaders = (request, env) => {
    const origin = request.headers.get("Origin");
    const allowedOrigins = [
        env.FRONTEND_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ].filter(Boolean);
    const allowOrigin = allowedOrigins.includes(origin) ? origin : env.FRONTEND_URL || "*";

    return {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    };
};

const checkRequiredEnv = (env) => {
    if (!env.RESEND_API_KEY) {
        throw new Error("Missing RESEND_API_KEY");
    }

    if (!env.ADMIN_EMAIL) {
        throw new Error("Missing ADMIN_EMAIL");
    }

    if (!env.FROM_EMAIL) {
        throw new Error("Missing FROM_EMAIL");
    }
};

const validateContactForm = ({ name, email, message }) => {
    if (!name || name.length < 2) {
        return "El nombre es obligatorio.";
    }

    if (name.length > 80) {
        return "El nombre es demasiado largo.";
    }

    if (!email || !isValidEmail(email)) {
        return "El email no es válido.";
    }

    if (message.length < 10) {
        return "El mensaje debe tener al menos 10 caracteres.";
    }

    if (message.length > 3000) {
        return "El mensaje es demasiado largo.";
    }

    return null;
};

const sendResendEmail = async (env, payload) => {
    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        console.error("Resend API error:", data);
        throw new Error("Error enviando email con Resend");
    }

    return data;
};

const handleContactRequest = async (request, env) => {
    const corsHeaders = getCorsHeaders(request, env);

    if (request.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: corsHeaders,
        });
    }

    if (request.method !== "POST") {
        return jsonResponse({ ok: false, error: "Method not allowed" }, 405, corsHeaders);
    }

    checkRequiredEnv(env);

    let body;

    try {
        body = await request.json();
    } catch {
        return jsonResponse(
            { ok: false, error: "El cuerpo de la petición no es JSON válido." },
            400,
            corsHeaders,
        );
    }

    const name = sanitizeText(body.name || "");
    const email = sanitizeText(body.email || "");
    const message = sanitizeText(body.message || "");
    const honeypot = sanitizeText(body.company || "");

    if (honeypot.length > 0) {
        return jsonResponse(
            { ok: true, message: "Mensaje recibido correctamente." },
            200,
            corsHeaders,
        );
    }

    const validationError = validateContactForm({ name, email, message });

    if (validationError) {
        return jsonResponse({ ok: false, error: validationError }, 400, corsHeaders);
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

    await sendResendEmail(env, {
        from: env.FROM_EMAIL,
        to: env.ADMIN_EMAIL,
        reply_to: email,
        subject: CONTACT_SUBJECT,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>${CONTACT_SUBJECT}</h2>
            <p><strong>Nombre:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <hr>
            <p><strong>Mensaje:</strong></p>
            <p>${safeMessage}</p>
            <hr>
            <p style="color: #666; font-size: 13px;">
              Este mensaje fue enviado desde el formulario de Gakeyru Test de KaneCatDev.
            </p>
          </div>
        `,
    });

    return jsonResponse(
        { ok: true, message: "Mensaje enviado correctamente." },
        200,
        corsHeaders,
    );
};

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === "/contact") {
            try {
                return await handleContactRequest(request, env);
            } catch (error) {
                console.error("Contact Worker fetch error:", error);
                return jsonResponse(
                    { ok: false, error: "Error interno enviando el mensaje." },
                    500,
                    getCorsHeaders(request, env),
                );
            }
        }

        return env.ASSETS.fetch(request);
    },
};
