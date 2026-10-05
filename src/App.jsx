import { useEffect, useMemo, useState } from "react";
import "./App.css";
import logoImage from "./assets/logo.png";
import ProjectPage from "./ProjectPage.jsx";
import SpaLink from "./SpaLink.jsx";
import ContactSection from "./ContactSection.jsx";

const DEFAULT_PUBLIC_API_BASE_URL = "https://api.kanecat.dev";
const API_BASE_URL = (
    import.meta.env.VITE_PUBLIC_API_BASE_URL || DEFAULT_PUBLIC_API_BASE_URL
).replace(/\/+$/, "");
const PUBLIC_ENDPOINTS = {
    feed: "/feed",
    news: "/news",
    projects: "/projects",
};
const GAKEYRU_TEST_API_URL =
    import.meta.env.VITE_GAKEYRU_TEST_API_URL ||
    import.meta.env.VITE_CONTACT_ENDPOINT ||
    "https://contact-api.kanecat.dev/api/gakeyru-test";
const KOFI_URL = "https://ko-fi.com/kanecatdev";

const translations = {
    en: {
        nav: {
            projects: "Projects",
            news: "News",
            about: "About",
            contact: "Contact",
            support: "Ko-fi",
        },
        hero: {
            eyebrow: "Android apps, games and AI tools",
            title: "KaneCatDev",
            description:
                "I build Android apps, playful systems and creator tools with a backend-first mindset and a taste for interfaces with character.",
            primaryButton: "View projects",
            secondaryButton: "Latest news",
        },
        profile: {
            title: "KaneCatDev",
            subtitle: "Developer profile",
            status: "Public project feed online",
            latestNews: "Latest news",
            moreNewsButton: "More news",
        },
        projectsSection: {
            eyebrow: "Public feed",
            title: "Projects",
            empty: "No public projects are available yet.",
            loading: "Loading projects...",
            error: "The public project feed could not be loaded right now.",
            featured: "Featured",
            standard: "Project",
            infoButton: "Information",
            viewButton: "View project",
            websiteButton: "Website",
            repoButton: "Repository",
            untitled: "Untitled project",
        },
        newsSection: {
            eyebrow: "Updates",
            title: "News",
            empty: "No news has been published yet.",
            loading: "Loading news...",
            error: "The public news feed could not be loaded right now.",
            linkButton: "Read more",
            untitled: "Untitled update",
        },
        a11y: {
            navigation: "Main navigation",
            switchLanguage: "Cambiar idioma a español",
        },
        statusLabels: {
            active: "Active",
            archived: "Archived",
            cancelled: "Cancelled",
            completed: "Completed",
            development: "In development",
            finished: "Finished",
            live: "Live",
            paused: "Paused",
            published: "Published",
            unknown: "Status pending",
        },
        about: {
            eyebrow: "About",
            title: "Practical software with a personal edge.",
            description:
                "I study software development and create projects around Android, backend systems, automation, AI and videogames. I like building things that can leave the sketchbook and become useful in real communities.",
        },
        stack: {
            eyebrow: "Stack",
            title: "Technologies",
        },
        contact: {
            eyebrow: "Contact",
            title: "Let's get in touch",
            description:
                "I am open to project ideas, collaborations and technical conversations around apps, tools and game-adjacent systems.",
            emailSubject: "Contact from kanecat.dev",
            methods: {
                email: { label: "Email", description: "Project ideas, collaborations or a hello." },
                github: { label: "GitHub", description: "Explore my code and repositories." },
                linkedin: { label: "LinkedIn", description: "Connect with me professionally." },
                discord: { label: "Discord", description: "Let's chat about projects and ideas." },
                phone: { label: "Phone", description: "Call me directly." },
            },
            supportText:
                "If you enjoy my projects, you can also support future builds with a coffee.",
            supportButton: "Support on Ko-fi",
        },
        footer: {
            copyright: "© 2026 KaneCatDev",
            built: "Built with React",
        },
    },

    es: {
        nav: {
            projects: "Proyectos",
            news: "Novedades",
            about: "Sobre mí",
            contact: "Contacto",
            support: "Ko-fi",
        },
        hero: {
            eyebrow: "Apps Android, juegos y herramientas IA",
            title: "KaneCatDev",
            description:
                "Desarrollo apps Android, sistemas jugables y herramientas para creadores con mentalidad backend y gusto por interfaces con carácter.",
            primaryButton: "Ver proyectos",
            secondaryButton: "Novedades",
        },
        profile: {
            title: "KaneCatDev",
            subtitle: "Perfil de desarrollador",
            status: "Feed público de proyectos activo",
            latestNews: "Últimas novedades",
            moreNewsButton: "Ver más novedades",
        },
        projectsSection: {
            eyebrow: "Feed público",
            title: "Proyectos",
            empty: "Todavía no hay proyectos públicos disponibles.",
            loading: "Cargando proyectos...",
            error: "Ahora mismo no se pudo cargar el feed público de proyectos.",
            featured: "Destacado",
            standard: "Proyecto",
            infoButton: "Información",
            viewButton: "Ver proyecto",
            websiteButton: "Web",
            repoButton: "Repositorio",
            untitled: "Proyecto sin título",
        },
        newsSection: {
            eyebrow: "Actualizaciones",
            title: "Novedades",
            empty: "Todavía no hay novedades publicadas.",
            loading: "Cargando novedades...",
            error: "Ahora mismo no se pudo cargar el feed público de novedades.",
            linkButton: "Leer más",
            untitled: "Novedad sin título",
        },
        a11y: {
            navigation: "Navegación principal",
            switchLanguage: "Switch language to English",
        },
        statusLabels: {
            active: "Activo",
            archived: "Archivado",
            cancelled: "Cancelado",
            completed: "Completado",
            development: "En desarrollo",
            finished: "Terminado",
            live: "Publicado",
            paused: "Pausado",
            published: "Publicado",
            unknown: "Estado pendiente",
        },
        about: {
            eyebrow: "Sobre mí",
            title: "Software práctico con personalidad.",
            description:
                "Estudio desarrollo de software y creo proyectos relacionados con Android, backend, automatización, IA y videojuegos. Me gusta construir cosas que salgan del boceto y sean útiles en comunidades reales.",
        },
        stack: {
            eyebrow: "Stack",
            title: "Tecnologías",
        },
        contact: {
            eyebrow: "Contacto",
            title: "Hablemos",
            description:
                "Estoy abierto a ideas de proyectos, colaboraciones y conversaciones técnicas sobre apps, herramientas y sistemas alrededor de videojuegos.",
            emailSubject: "Contacto desde kanecat.dev",
            methods: {
                email: { label: "Correo", description: "Ideas, colaboraciones o simplemente un saludo." },
                github: { label: "GitHub", description: "Explora mi código y mis repositorios." },
                linkedin: { label: "LinkedIn", description: "Conecta conmigo en el ámbito profesional." },
                discord: { label: "Discord", description: "Charlemos sobre proyectos e ideas." },
                phone: { label: "Teléfono", description: "Llámame directamente." },
            },
            supportText:
                "Si te gustan mis proyectos, también puedes apoyar futuras creaciones con un café.",
            supportButton: "Apoyar en Ko-fi",
        },
        footer: {
            copyright: "© 2026 KaneCatDev",
            built: "Creado con React",
        },
    },
};

const skills = [
    "Kotlin",
    "Android",
    "Jetpack Compose",
    "React",
    "JavaScript",
    "Python",
    "Spring Boot",
    "Java",
    "C#",
    "Unity",
    "MySQL",
    "MongoDB",
    "Cloudflare Workers",
    "D1",
    "Automation",
    "Blender",
    "VRChat",
];

const statusClassNames = {
    active: "status-active",
    archived: "status-paused",
    cancelled: "status-cancelled",
    completed: "status-finished",
    development: "status-development",
    finished: "status-finished",
    live: "status-active",
    paused: "status-paused",
    published: "status-active",
    unknown: "status-paused",
};

const getInitialLanguage = () => {
    const storedLanguage = localStorage.getItem("portfolio-language");

    if (storedLanguage === "en" || storedLanguage === "es") {
        return storedLanguage;
    }

    return navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
};

const getSafeWebUrl = (value) => {
    if (typeof value !== "string" || value.trim() === "") {
        return "";
    }

    try {
        const url = new URL(value.trim(), "https://kanecat.dev");

        return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
    } catch {
        return "";
    }
};

const getDisplayText = (...values) => {
    const value = values.find((item) => typeof item === "string" && item.trim() !== "");

    return value ? value.trim().replace(/\s+/g, " ") : "";
};

const truncateText = (value, maxLength = 190) => {
    const text = getDisplayText(value);

    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength).trimEnd()}...`;
};

const getPublicContentFromResponse = (data = {}) => ({
    projects: Array.isArray(data?.projects) ? data.projects : [],
    news: Array.isArray(data?.news) ? data.news : [],
});

const fetchPublicApi = async (path, signal) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: "GET",
        signal,
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`${path} request failed with ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.ok === false) {
        throw new Error(`${path} response was not ok`);
    }

    return data;
};

const loadPublicContent = async (signal) => {
    const [projectsResult, newsResult] = await Promise.allSettled([
        fetchPublicApi(PUBLIC_ENDPOINTS.projects, signal),
        fetchPublicApi(PUBLIC_ENDPOINTS.news, signal),
    ]);

    const abortResult = [projectsResult, newsResult].find(
        (result) => result.status === "rejected" && result.reason?.name === "AbortError",
    );

    if (abortResult) {
        throw abortResult.reason;
    }

    let projects =
        projectsResult.status === "fulfilled"
            ? getPublicContentFromResponse(projectsResult.value).projects
            : [];
    let news =
        newsResult.status === "fulfilled"
            ? getPublicContentFromResponse(newsResult.value).news
            : [];
    const needsFeedFallback =
        projectsResult.status === "rejected" ||
        newsResult.status === "rejected" ||
        (!projects.length && !news.length);

    if (needsFeedFallback) {
        try {
            const feedData = await fetchPublicApi(PUBLIC_ENDPOINTS.feed, signal);
            const feedContent = getPublicContentFromResponse(feedData);

            if (!projects.length) {
                projects = feedContent.projects;
            }

            if (!news.length) {
                news = feedContent.news;
            }
        } catch (error) {
            const hasSuccessfulEndpoint =
                projectsResult.status === "fulfilled" || newsResult.status === "fulfilled";

            if (!hasSuccessfulEndpoint) {
                throw error;
            }
        }
    }

    return { projects, news };
};

const normalizeStatus = (status) => {
    if (!status) {
        return "unknown";
    }

    return String(status).toLowerCase().replace(/[_\s]+/g, "-");
};

const humanizeStatus = (status) => {
    if (!status) {
        return "";
    }

    return String(status)
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getDateParts = (value) => {
    if (!value) {
        return null;
    }

    const datePart = String(value).slice(0, 10);
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart);

    if (!match) {
        return null;
    }

    const [, yearValue, monthValue, dayValue] = match;
    const year = Number(yearValue);
    const month = Number(monthValue);
    const day = Number(dayValue);
    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    return date;
};

const formatDate = (value, language) => {
    const date = getDateParts(value);

    if (!date) {
        return "";
    }

    return new Intl.DateTimeFormat(language === "es" ? "es-ES" : "en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
};

const getSortDate = (value) => {
    const date = getDateParts(value);

    return date ? date.getTime() : 0;
};

function RemoteImage({ alt = "", className, fallback, src }) {
    const [hasError, setHasError] = useState(false);

    if (!src || hasError) {
        return fallback;
    }

    return (
        <img
            className={className}
            src={src}
            alt={alt}
            loading="lazy"
            onError={() => setHasError(true)}
        />
    );
}

function GakeyruTestPage() {
    const [formValues, setFormValues] = useState({
        contactEmail: "",
        discord: "",
        googlePlayEmail: "",
        instagram: "",
        name: "",
        testerReason: "",
        whatsapp: "",
    });
    const [optionalMethods, setOptionalMethods] = useState({
        discord: false,
        instagram: false,
        whatsapp: false,
    });
    const [submissionError, setSubmissionError] = useState("");
    const [submissionStatus, setSubmissionStatus] = useState("idle");

    useEffect(() => {
        document.documentElement.lang = "es";
        document.title = "Gakeyru Test | KaneCatDev";
    }, []);

    const updateField = (fieldName, value) => {
        setFormValues((currentValues) => ({
            ...currentValues,
            [fieldName]: value,
        }));
    };

    const toggleOptionalMethod = (method) => {
        setOptionalMethods((currentMethods) => {
            const nextValue = !currentMethods[method];

            if (!nextValue) {
                updateField(method, "");
            }

            return {
                ...currentMethods,
                [method]: nextValue,
            };
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmissionError("");
        setSubmissionStatus("submitting");

        if (typeof window.fetch !== "function") {
            setSubmissionError("Tu navegador no permite enviar la solicitud.");
            setSubmissionStatus("error");
            return;
        }

        try {
            const response = await fetch(GAKEYRU_TEST_API_URL, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    communicationEmail: formValues.contactEmail.trim(),
                    googlePlayEmail: formValues.googlePlayEmail.trim(),
                    name: formValues.name.trim(),
                    reason: formValues.testerReason.trim(),
                    instagram: optionalMethods.instagram,
                    instagramUser: optionalMethods.instagram ? formValues.instagram.trim() : "",
                    discord: optionalMethods.discord,
                    discordUser: optionalMethods.discord ? formValues.discord.trim() : "",
                    whatsapp: optionalMethods.whatsapp,
                    whatsappNumber: optionalMethods.whatsapp ? formValues.whatsapp.trim() : "",
                    company: "",
                }),
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok || data.ok === false) {
                throw new Error(data.error || "No se pudo enviar la petición.");
            }

            setSubmissionStatus("sent");
        } catch (error) {
            setSubmissionError(error.message || "No se pudo enviar la petición.");
            setSubmissionStatus("error");
        }
    };

    if (submissionStatus === "sent") {
        return (
            <main className="test-page">
                <section className="test-form-shell test-thanks-shell" aria-labelledby="thanks-title">
                    <div className="test-form-intro">
                        <span className="brand-mark test-brand-mark">
                            <img src={logoImage} alt="" aria-hidden="true" />
                        </span>
                        <p className="eyebrow">Petición enviada</p>
                        <h1 id="thanks-title">Gracias por participar en la prueba</h1>
                        <p>
                            He recibido tu solicitud para Gakeyru Test. Si encaja con la prueba,
                            te contactaré con los siguientes pasos.
                        </p>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="test-page">
            <section className="test-form-shell" aria-labelledby="gakeyru-test-title">
                <div className="test-form-intro">
                    <span className="brand-mark test-brand-mark">
                        <img src={logoImage} alt="" aria-hidden="true" />
                    </span>
                    <p className="eyebrow">Gakeyru Test</p>
                    <h1 id="gakeyru-test-title">Solicitud para testers</h1>
                    <p>
                        Solicita acceso como tester de Gakeyru. El correo de Google Play se usa
                        solo para añadirte a la prueba.
                    </p>
                    <p className="optional-contact-note">
                        El correo de comunicación y el correo de Google Play son obligatorios.
                        Instagram, Discord y WhatsApp son opcionales.
                    </p>
                    <div className="test-steps">
                        <h2>Antes de apuntarte</h2>
                        <ul>
                            <li>Necesitas un móvil Android con Android 7.0 o superior.</li>
                            <li>Debes tener acceso a Google Play Store.</li>
                            <li>Usa una cuenta de Google/Gmail activa.</li>
                            <li>
                                Tendrás que pasarme el correo de Google que usas en Play Store
                                para poder añadirte a la prueba cerrada.
                            </li>
                            <li>Cuando recibas el enlace de invitación, ábrelo con esa cuenta.</li>
                            <li>Pulsa “Unirse a la prueba”.</li>
                            <li>Instala Gakeyru desde Google Play.</li>
                            <li>Mantente unido a la prueba durante 14 días seguidos.</li>
                            <li>
                                Si puedes, abre y usa la app durante esos días para que cuente como
                                una prueba real.
                            </li>
                        </ul>
                        <a
                            className="test-policy-link"
                            href="https://gakeyru.kanecat.dev/policies/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Ver políticas de Gakeyru
                        </a>
                    </div>
                </div>

                <form className="test-form" onSubmit={handleSubmit}>
                    <label>
                        <span>Nombre</span>
                        <input
                            type="text"
                            name="name"
                            value={formValues.name}
                            onChange={(event) => updateField("name", event.target.value)}
                            placeholder="nombre para referirme a ti"
                            autoComplete="name"
                            required
                        />
                    </label>

                    <label>
                        <span>Correo o método de comunicación</span>
                        <span className="contact-email-label">Correo de comunicación</span>
                        <input
                            type="email"
                            name="contactEmail"
                            value={formValues.contactEmail}
                            onChange={(event) => updateField("contactEmail", event.target.value)}
                            placeholder="correo donde puedo contactarte"
                            autoComplete="email"
                            required
                        />
                    </label>

                    <fieldset className="optional-contact-group">
                        <legend>Medios de comunicación opcionales</legend>
                        <p>Marca solo los que quieras añadir además del correo.</p>

                        <div className="optional-contact-options">
                            {[
                                ["instagram", "Instagram"],
                                ["discord", "Discord"],
                                ["whatsapp", "WhatsApp"],
                            ].map(([method, label]) => (
                                <label className="contact-option" key={method}>
                                    <input
                                        type="checkbox"
                                        checked={optionalMethods[method]}
                                        onChange={() => toggleOptionalMethod(method)}
                                    />
                                    <span>{label}</span>
                                </label>
                            ))}
                        </div>

                        {optionalMethods.instagram && (
                            <label>
                                <span>Usuario de Instagram</span>
                                <input
                                    type="text"
                                    name="instagram"
                                    value={formValues.instagram}
                                    onChange={(event) =>
                                        updateField("instagram", event.target.value)
                                    }
                                    placeholder="@usuario"
                                    required
                                />
                            </label>
                        )}

                        {optionalMethods.discord && (
                            <label>
                                <span>Usuario de Discord</span>
                                <input
                                    type="text"
                                    name="discord"
                                    value={formValues.discord}
                                    onChange={(event) => updateField("discord", event.target.value)}
                                    placeholder="usuario o ID de Discord"
                                    required
                                />
                            </label>
                        )}

                        {optionalMethods.whatsapp && (
                            <label>
                                <span>Número de WhatsApp</span>
                                <input
                                    type="tel"
                                    name="whatsapp"
                                    value={formValues.whatsapp}
                                    onChange={(event) =>
                                        updateField("whatsapp", event.target.value)
                                    }
                                    placeholder="+34 600 000 000"
                                    autoComplete="tel"
                                    required
                                />
                            </label>
                        )}
                    </fieldset>

                    <label>
                        <span>Correo de Google Play</span>
                        <input
                            type="email"
                            name="googlePlayEmail"
                            value={formValues.googlePlayEmail}
                            onChange={(event) =>
                                updateField("googlePlayEmail", event.target.value)
                            }
                            placeholder="cuenta usada en Google Play"
                            autoComplete="email"
                            required
                        />
                    </label>

                    <label>
                        <span>Por qué quieres ser tester</span>
                        <textarea
                            name="testerReason"
                            value={formValues.testerReason}
                            onChange={(event) => updateField("testerReason", event.target.value)}
                            placeholder="Cuéntame brevemente por qué te interesa probar Gakeyru."
                            rows="6"
                            required
                        />
                    </label>

                    <button
                        className="button primary-button test-submit-button"
                        type="submit"
                        disabled={submissionStatus === "submitting"}
                    >
                        {submissionStatus === "submitting" ? "Enviando..." : "Enviar petición"}
                    </button>

                    {submissionStatus === "error" && (
                        <p className="test-submit-note test-submit-error">
                            {submissionError
                                ? `No se pudo enviar: ${submissionError}`
                                : "No se pudo enviar ahora mismo. Inténtalo de nuevo en unos minutos."}
                        </p>
                    )}
                </form>
            </section>
        </main>
    );
}

function HomePage() {
    const [language, setLanguage] = useState(getInitialLanguage);
    const [feed, setFeed] = useState({
        projects: [],
        news: [],
    });
    const [feedStatus, setFeedStatus] = useState("loading");

    const content = translations[language];

    const sortedProjects = useMemo(() => {
        return [...feed.projects].sort((firstProject, secondProject) => {
            const featuredDifference =
                Number(secondProject.featured || 0) - Number(firstProject.featured || 0);

            if (featuredDifference !== 0) {
                return featuredDifference;
            }

            return Number(firstProject.sort_order || 0) - Number(secondProject.sort_order || 0);
        });
    }, [feed.projects]);

    const sortedNews = useMemo(() => {
        return [...feed.news].sort((firstNews, secondNews) => {
            return (
                getSortDate(secondNews.published_at || secondNews.created_at) -
                getSortDate(firstNews.published_at || firstNews.created_at)
            );
        });
    }, [feed.news]);

    const isLoading = feedStatus === "loading";
    const hasError = feedStatus === "error";
    const latestProfileNews = sortedNews.slice(0, 3);

    const getStatusLabel = (status) => {
        const normalizedStatus = normalizeStatus(status);

        return (
            content.statusLabels[normalizedStatus] ||
            humanizeStatus(status) ||
            content.statusLabels.unknown
        );
    };

    useEffect(() => {
        localStorage.setItem("portfolio-language", language);
        document.documentElement.lang = language;
        document.title = "KaneCatDev | Portfolio";
    }, [language]);

    useEffect(() => {
        const abortController = new AbortController();

        const loadFeed = async () => {
            setFeedStatus("loading");

            try {
                setFeed(await loadPublicContent(abortController.signal));
                setFeedStatus("ready");
            } catch (error) {
                if (error.name !== "AbortError") {
                    setFeedStatus("error");
                }
            }
        };

        loadFeed();

        return () => {
            abortController.abort();
        };
    }, []);

    const toggleLanguage = () => {
        setLanguage((currentLanguage) => (currentLanguage === "en" ? "es" : "en"));
    };

    return (
        <main className="page">
            <header className="navbar">
                <a className="brand" href="#top" aria-label="KaneCatDev">
                    <span className="brand-mark">
                        <img src={logoImage} alt="" aria-hidden="true" />
                    </span>
                    <span>KaneCatDev</span>
                </a>

                <div className="nav-actions">
                    <nav className="nav-links" aria-label={content.a11y.navigation}>
                        <a href="#projects">{content.nav.projects}</a>
                        <a href="#news">{content.nav.news}</a>
                        <a href="#about">{content.nav.about}</a>
                        <a href="#contact">{content.nav.contact}</a>
                        <a href={KOFI_URL} target="_blank" rel="noreferrer">
                            {content.nav.support}
                        </a>
                    </nav>

                    <button
                        className="language-toggle"
                        type="button"
                        onClick={toggleLanguage}
                        aria-label={content.a11y.switchLanguage}
                    >
                        <span lang="en" className={language === "en" ? "active-language" : ""}>
                            EN
                        </span>
                        <span aria-hidden="true">/</span>
                        <span lang="es" className={language === "es" ? "active-language" : ""}>
                            ES
                        </span>
                    </button>
                </div>
            </header>

            <section id="top" className="hero">
                <div className="hero-content">
                    <p className="eyebrow">{content.hero.eyebrow}</p>

                    <h1>{content.hero.title}</h1>

                    <p className="hero-description">{content.hero.description}</p>

                    <div className="hero-actions">
                        <a className="button primary-button" href="#projects">
                            {content.hero.primaryButton}
                        </a>
                        <a className="button secondary-button" href="#news">
                            {content.hero.secondaryButton}
                        </a>
                    </div>
                </div>

                <aside className="hero-card" aria-label={content.profile.title}>
                    <div className="avatar-ring">
                        <div className="avatar-core">
                            <img src={logoImage} alt="KaneCatDev logo" className="avatar-image" />
                        </div>
                    </div>

                    <h2>{content.profile.title}</h2>
                    <p>{content.profile.subtitle}</p>

                    <div className="status-box">
                        <span className="status-dot" aria-hidden="true"></span>
                        <span>{content.profile.status}</span>
                    </div>

                    <div className="profile-news" aria-label={content.profile.latestNews}>
                        <div className="profile-news-heading">
                            <span>{content.profile.latestNews}</span>
                        </div>

                        {isLoading && (
                            <p className="profile-news-state">{content.newsSection.loading}</p>
                        )}

                        {!isLoading && hasError && (
                            <p className="profile-news-state">{content.newsSection.error}</p>
                        )}

                        {!isLoading && !hasError && latestProfileNews.length === 0 && (
                            <p className="profile-news-state">{content.newsSection.empty}</p>
                        )}

                        {!isLoading && !hasError && latestProfileNews.length > 0 && (
                            <div className="profile-news-list">
                                {latestProfileNews.map((newsItem) => {
                                    const newsDate = formatDate(
                                        newsItem.published_at || newsItem.created_at,
                                        language,
                                    );
                                    const newsLink = getSafeWebUrl(newsItem.link_url);
                                    const newsTitle =
                                        getDisplayText(newsItem.title) ||
                                        content.newsSection.untitled;

                                    return (
                                        <a
                                            className="profile-news-link"
                                            href={newsLink || "#news"}
                                            target={newsLink ? "_blank" : undefined}
                                            rel={newsLink ? "noreferrer" : undefined}
                                            key={newsItem.slug || newsItem.id || newsTitle}
                                        >
                                            <span>{newsTitle}</span>
                                            {newsDate && <time>{newsDate}</time>}
                                        </a>
                                    );
                                })}
                            </div>
                        )}

                        <a className="button profile-news-button" href="#news">
                            {content.profile.moreNewsButton}
                        </a>
                    </div>
                </aside>
            </section>

            <section id="projects" className="section">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">{content.projectsSection.eyebrow}</p>
                        <h2>{content.projectsSection.title}</h2>
                    </div>
                </div>

                {isLoading && (
                    <div className="project-grid" aria-live="polite">
                        {[0, 1].map((item) => (
                            <article className="project-card skeleton-card" key={item}>
                                <span>{content.projectsSection.loading}</span>
                            </article>
                        ))}
                    </div>
                )}

                {!isLoading && hasError && (
                    <p className="notice-message">{content.projectsSection.error}</p>
                )}

                {!isLoading && !hasError && sortedProjects.length === 0 && (
                    <p className="notice-message">{content.projectsSection.empty}</p>
                )}

                {!isLoading && !hasError && sortedProjects.length > 0 && (
                    <div className="project-grid">
                        {sortedProjects.map((project, projectIndex) => {
                            const status = normalizeStatus(project.status);
                            const projectImage = getSafeWebUrl(project.image_url);
                            const websiteUrl = getSafeWebUrl(project.website_url);
                            const repositoryUrl = getSafeWebUrl(project.repo_url);
                            const projectTitle =
                                getDisplayText(project.title) ||
                                content.projectsSection.untitled;
                            const projectSummary = truncateText(
                                getDisplayText(project.summary, project.description),
                                150,
                            );
                            const projectDescription = getDisplayText(
                                project.description,
                                project.summary,
                            );

                            return (
                                <article
                                    className="project-card"
                                    key={project.slug || project.id || `${projectTitle}-${projectIndex}`}
                                >
                                    <div className="project-media">
                                        <RemoteImage
                                            className="project-image"
                                            src={projectImage}
                                            alt=""
                                            fallback={
                                                <div className="project-image-placeholder">
                                                <span>{projectTitle.charAt(0)}</span>
                                                </div>
                                            }
                                        />
                                    </div>

                                    <div className="project-card-body">
                                        <div className="project-card-header">
                                            <p className="project-type">
                                                {project.featured
                                                    ? content.projectsSection.featured
                                                    : content.projectsSection.standard}
                                            </p>

                                            <span
                                                className={`project-status ${
                                                    statusClassNames[status] || "status-paused"
                                                }`}
                                            >
                                                {getStatusLabel(project.status)}
                                            </span>
                                        </div>

                                        <h3>{projectTitle}</h3>
                                        {projectSummary && (
                                            <p className="project-summary">{projectSummary}</p>
                                        )}

                                        <div className="card-actions">
                                            {project.slug && (
                                                <SpaLink
                                                    className="project-action project-detail-action"
                                                    href={`/projects/${encodeURIComponent(project.slug)}`}
                                                >
                                                    {content.projectsSection.viewButton}
                                                </SpaLink>
                                            )}
                                            <details className="project-info">
                                                <summary className="project-action info-action">
                                                    {content.projectsSection.infoButton}
                                                </summary>
                                                <div className="project-info-panel">
                                                    <span>{getStatusLabel(project.status)}</span>
                                                    {projectDescription && <p>{projectDescription}</p>}
                                                </div>
                                            </details>
                                            {websiteUrl && (
                                                <a
                                                    className="project-action"
                                                    href={websiteUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {content.projectsSection.websiteButton}
                                                </a>
                                            )}
                                            {repositoryUrl && (
                                                <a
                                                    className="project-action"
                                                    href={repositoryUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {content.projectsSection.repoButton}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            <section id="news" className="section news-section">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">{content.newsSection.eyebrow}</p>
                        <h2>{content.newsSection.title}</h2>
                    </div>
                </div>

                {isLoading && (
                    <div className="news-list" aria-live="polite">
                        {[0, 1].map((item) => (
                            <article className="news-item skeleton-card" key={item}>
                                <span>{content.newsSection.loading}</span>
                            </article>
                        ))}
                    </div>
                )}

                {!isLoading && hasError && <p className="notice-message">{content.newsSection.error}</p>}

                {!isLoading && !hasError && sortedNews.length === 0 && (
                    <p className="notice-message">{content.newsSection.empty}</p>
                )}

                {!isLoading && !hasError && sortedNews.length > 0 && (
                    <div className="news-list">
                        {sortedNews.map((newsItem, newsIndex) => {
                            const newsDate = formatDate(
                                newsItem.published_at || newsItem.created_at,
                                language,
                            );
                            const newsImage = getSafeWebUrl(newsItem.image_url);
                            const newsLink = getSafeWebUrl(newsItem.link_url);
                            const newsTitle =
                                getDisplayText(newsItem.title) || content.newsSection.untitled;
                            const newsSummary = truncateText(
                                getDisplayText(newsItem.summary, newsItem.content),
                                220,
                            );

                            return (
                                <article
                                    className="news-item"
                                    key={newsItem.slug || newsItem.id || `${newsTitle}-${newsIndex}`}
                                >
                                    <RemoteImage
                                        className="news-image"
                                        src={newsImage}
                                        alt=""
                                        fallback={
                                            <div className="news-date-card" aria-hidden="true">
                                                <span>{newsDate || content.newsSection.eyebrow}</span>
                                            </div>
                                        }
                                    />

                                    <div className="news-content">
                                        <div className="news-meta">
                                            {newsItem.project_title && <span>{newsItem.project_title}</span>}
                                            {newsDate && <time>{newsDate}</time>}
                                        </div>

                                        <h3>{newsTitle}</h3>
                                        {newsSummary && <p>{newsSummary}</p>}

                                        {newsLink && (
                                            <a
                                                className="text-link"
                                                href={newsLink}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {content.newsSection.linkButton}
                                            </a>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            <section id="about" className="section about-section">
                <div>
                    <p className="eyebrow">{content.about.eyebrow}</p>
                    <h2>{content.about.title}</h2>
                </div>

                <p>{content.about.description}</p>
            </section>

            <section className="section">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">{content.stack.eyebrow}</p>
                        <h2>{content.stack.title}</h2>
                    </div>
                </div>

                <div className="skill-list">
                    {skills.map((skill) => (
                        <span className="skill" key={skill}>
                            {skill}
                        </span>
                    ))}
                </div>
            </section>

            <ContactSection text={content.contact} supportUrl={KOFI_URL} />

            <footer className="footer">
                <span>{content.footer.copyright}</span>
                <span>{content.footer.built}</span>
            </footer>
        </main>
    );
}

function App() {
    const [locationKey, setLocationKey] = useState(
        () => `${window.location.pathname}${window.location.search}${window.location.hash}`,
    );
    const pathname = window.location.pathname.replace(/\/+$/, "") || "/";

    useEffect(() => {
        const handleLocationChange = () => {
            setLocationKey(
                `${window.location.pathname}${window.location.search}${window.location.hash}`,
            );
        };

        window.addEventListener("popstate", handleLocationChange);
        return () => window.removeEventListener("popstate", handleLocationChange);
    }, []);

    useEffect(() => {
        if (pathname.startsWith("/projects/")) {
            window.scrollTo({ top: 0 });
            return undefined;
        }

        if (window.location.hash) {
            const animationFrame = window.requestAnimationFrame(() => {
                document.querySelector(window.location.hash)?.scrollIntoView();
            });

            return () => window.cancelAnimationFrame(animationFrame);
        }

        return undefined;
    }, [locationKey, pathname]);

    if (pathname === "/gakeyru-test") {
        return <GakeyruTestPage />;
    }

    const projectMatch = /^\/projects\/([^/]+)$/.exec(pathname);

    if (projectMatch) {
        let projectSlug = projectMatch[1];

        try {
            projectSlug = decodeURIComponent(projectSlug);
        } catch {
            // Keep the raw segment so the API can return the appropriate not-found state.
        }

        return <ProjectPage apiBaseUrl={API_BASE_URL} slug={projectSlug} />;
    }

    return <HomePage />;
}

export default App;
