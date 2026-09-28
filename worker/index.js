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
        "Access-Control-Allow-Headers": "Accept, Content-Type",
        "Content-Type": "application/json",
        Vary: "Origin",
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

const validateGakeyruTestForm = ({
    communicationEmail,
    discord,
    discordUser,
    googlePlayEmail,
    instagram,
    instagramUser,
    name,
    reason,
    whatsapp,
    whatsappNumber,
}) => {
    if (!name || name.length < 2) {
        return "El nombre es obligatorio.";
    }

    if (name.length > 80) {
        return "El nombre es demasiado largo.";
    }

    if (!communicationEmail || !isValidEmail(communicationEmail)) {
        return "El correo de comunicación no es válido.";
    }

    if (!googlePlayEmail || !isValidEmail(googlePlayEmail)) {
        return "El correo de Google Play no es válido.";
    }

    if (!reason || reason.length < 10) {
        return "Cuéntame un poco más sobre por qué quieres ser tester.";
    }

    if (reason.length > 3000) {
        return "El motivo es demasiado largo.";
    }

    if (instagram && !instagramUser) {
        return "Falta el usuario de Instagram.";
    }

    if (discord && !discordUser) {
        return "Falta el usuario de Discord.";
    }

    if (whatsapp && !whatsappNumber) {
        return "Falta el número de WhatsApp.";
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

const handleGakeyruTestSubmission = async (body, env, corsHeaders) => {
    const name = sanitizeText(body.name || "");
    const communicationEmail = sanitizeText(body.communicationEmail || "");
    const googlePlayEmail = sanitizeText(body.googlePlayEmail || "");
    const reason = sanitizeText(body.reason || "");
    const instagram = body.instagram === true;
    const instagramUser = sanitizeText(body.instagramUser || "");
    const discord = body.discord === true;
    const discordUser = sanitizeText(body.discordUser || "");
    const whatsapp = body.whatsapp === true;
    const whatsappNumber = sanitizeText(body.whatsappNumber || "");
    const honeypot = sanitizeText(body.company || "");

    if (honeypot.length > 0) {
        return jsonResponse(
            { ok: true, message: "Solicitud recibida correctamente." },
            200,
            corsHeaders,
        );
    }

    const validationError = validateGakeyruTestForm({
        communicationEmail,
        discord,
        discordUser,
        googlePlayEmail,
        instagram,
        instagramUser,
        name,
        reason,
        whatsapp,
        whatsappNumber,
    });

    if (validationError) {
        return jsonResponse({ ok: false, error: validationError }, 400, corsHeaders);
    }

    checkRequiredEnv(env);

    const contactRows = [
        instagram && instagramUser
            ? `<p><strong>Instagram:</strong> ${escapeHtml(instagramUser)}</p>`
            : "",
        discord && discordUser
            ? `<p><strong>Discord:</strong> ${escapeHtml(discordUser)}</p>`
            : "",
        whatsapp && whatsappNumber
            ? `<p><strong>WhatsApp:</strong> ${escapeHtml(whatsappNumber)}</p>`
            : "",
    ].join("");

    await sendResendEmail(env, {
        from: env.FROM_EMAIL,
        to: env.ADMIN_EMAIL,
        reply_to: communicationEmail,
        subject: CONTACT_SUBJECT,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>${CONTACT_SUBJECT}</h2>
            <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
            <p><strong>Correo de comunicación:</strong> ${escapeHtml(communicationEmail)}</p>
            <p><strong>Correo de Google Play:</strong> ${escapeHtml(googlePlayEmail)}</p>
            ${contactRows}
            <hr>
            <p><strong>Motivo:</strong></p>
            <p>${escapeHtml(reason).replace(/\n/g, "<br>")}</p>
            <hr>
            <p style="color: #666; font-size: 13px;">
              Solicitud enviada desde el formulario de testers de Gakeyru.
            </p>
          </div>
        `,
    });

    return jsonResponse(
        { ok: true, message: "Solicitud enviada correctamente." },
        200,
        corsHeaders,
    );
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

    if ("communicationEmail" in body || "googlePlayEmail" in body || "reason" in body) {
        return handleGakeyruTestSubmission(body, env, corsHeaders);
    }

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

    checkRequiredEnv(env);

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

        if (url.pathname === "/contact" || url.pathname === "/api/gakeyru-test") {
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
