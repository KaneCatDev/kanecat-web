import { contactDetails } from "./contact.js";

const webContact = (value) => {
    if (!value?.trim()) return null;

    try {
        const url = new URL(value.trim());
        if (!["https:", "http:"].includes(url.protocol)) return null;
        return { href: url.href, value: `${url.hostname}${url.pathname}`.replace(/\/$/, ""), external: true };
    } catch {
        return null;
    }
};

function ContactIcon({ kind }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {kind === "email" ? (
                <>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 6 9 7 9-7" />
                </>
            ) : kind === "phone" ? (
                <path d="m8 3 2 5-3 2c2 4 3 5 7 7l2-3 5 2v4c0 1-1 2-2 1C10 20 4 14 3 5c0-1 1-2 2-2Z" />
            ) : kind === "github" ? (
                <>
                    <path d="M9 21v-4c-4 1-4-2-6-2m12 6v-4c0-1-.3-1.7-1-2 4-.5 6-2 6-6a5 5 0 0 0-1-3c.3-1 .3-2 0-3-2 0-3 1-3 1a13 13 0 0 0-8 0S7 3 5 3c-.3 1-.3 2 0 3a5 5 0 0 0-1 3c0 4 2 5.5 6 6-.7.3-1 1-1 2" />
                </>
            ) : (
                <>
                    <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2m3 6a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2" />
                </>
            )}
        </svg>
    );
}

function ContactSection({ text, supportUrl }) {
    const email = contactDetails.email.trim();
    const phone = contactDetails.phone.trim();
    const phoneNumber = phone.replace(/[\s().-]/g, "");
    const methods = [
        email && {
            kind: "email",
            href: `mailto:${email}?subject=${encodeURIComponent(text.emailSubject)}`,
            value: email,
        },
        ...["github", "linkedin", "discord"].map((kind) => {
            const link = webContact(contactDetails[kind]);
            return link && { kind, ...link };
        }),
        /^\+?\d{7,15}$/.test(phoneNumber) && {
            kind: "phone",
            href: `tel:${phoneNumber}`,
            value: phone,
        },
    ].filter(Boolean);

    return (
        <section id="contact" className="section contact-section" aria-labelledby="contact-title">
            <div className="contact-intro">
                <p className="eyebrow">{text.eyebrow}</p>
                <h2 id="contact-title">{text.title}</h2>
                <p>{text.description}</p>
            </div>

            <div className="contact-grid">
                {methods.map(({ kind, href, value, external }) => (
                    <a className={`contact-card contact-card-${kind}`} key={kind} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
                        <span className="contact-icon"><ContactIcon kind={kind} /></span>
                        <span className="contact-card-copy">
                            <span className="contact-card-title">{text.methods[kind].label}</span>
                            <span className="contact-card-description">{text.methods[kind].description}</span>
                            <span className="contact-card-value">{value}</span>
                        </span>
                        <span className="contact-card-arrow" aria-hidden="true">{external ? "↗" : "→"}</span>
                    </a>
                ))}
            </div>

            <div className="contact-support">
                <p className="support-copy">{text.supportText}</p>
                <a className="button kofi-button" href={supportUrl} target="_blank" rel="noopener noreferrer">
                    {text.supportButton} <span aria-hidden="true">↗</span>
                </a>
            </div>
        </section>
    );
}

export default ContactSection;
