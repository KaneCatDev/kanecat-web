import { useEffect, useMemo, useState } from "react";
import "./App.css";
import logoImage from "./assets/logo.png";

const API_BASE_URL = "https://api.kanecat.dev";
const CONTACT_EMAIL = "contact@kanecat.dev";
const KOFI_URL = "https://ko-fi.com/kanecatdev";
const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    "Contacto desde kanecat.dev",
)}&body=${encodeURIComponent("Hola KaneCatDev,\n\n")}`;

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
            websiteButton: "Website",
            repoButton: "Repository",
        },
        newsSection: {
            eyebrow: "Updates",
            title: "News",
            empty: "No news has been published yet.",
            loading: "Loading news...",
            error: "The public news feed could not be loaded right now.",
            linkButton: "Read more",
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
            title: "Want to build something?",
            description:
                "I am open to project ideas, collaborations and technical conversations around apps, tools and game-adjacent systems.",
            button: CONTACT_EMAIL,
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
            websiteButton: "Web",
            repoButton: "Repositorio",
        },
        newsSection: {
            eyebrow: "Actualizaciones",
            title: "Novedades",
            empty: "Todavía no hay novedades publicadas.",
            loading: "Cargando novedades...",
            error: "Ahora mismo no se pudo cargar el feed público de novedades.",
            linkButton: "Leer más",
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
            title: "¿Montamos algo?",
            description:
                "Estoy abierto a ideas de proyectos, colaboraciones y conversaciones técnicas sobre apps, herramientas y sistemas alrededor de videojuegos.",
            button: CONTACT_EMAIL,
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

const isVisibleUrl = (value) => typeof value === "string" && value.trim() !== "";

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
    const [year, month, day] = datePart.split("-").map(Number);

    if (!year || !month || !day) {
        return null;
    }

    return new Date(year, month - 1, day);
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

function App() {
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

        return content.statusLabels[normalizedStatus] || humanizeStatus(status);
    };

    useEffect(() => {
        localStorage.setItem("portfolio-language", language);
        document.documentElement.lang = language;
    }, [language]);

    useEffect(() => {
        const abortController = new AbortController();

        const loadFeed = async () => {
            setFeedStatus("loading");

            try {
                const response = await fetch(`${API_BASE_URL}/feed`, {
                    signal: abortController.signal,
                    headers: {
                        Accept: "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Feed request failed with ${response.status}`);
                }

                const data = await response.json();

                if (!data.ok) {
                    throw new Error("Feed response was not ok");
                }

                setFeed({
                    projects: Array.isArray(data.projects) ? data.projects : [],
                    news: Array.isArray(data.news) ? data.news : [],
                });
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
                    <nav className="nav-links" aria-label="Main navigation">
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
                        aria-label="Change language"
                    >
                        <span className={language === "en" ? "active-language" : ""}>EN</span>
                        <span aria-hidden="true">/</span>
                        <span className={language === "es" ? "active-language" : ""}>ES</span>
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
                        <span className="status-dot"></span>
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
                                    const hasNewsLink = isVisibleUrl(newsItem.link_url);

                                    return (
                                        <a
                                            className="profile-news-link"
                                            href={hasNewsLink ? newsItem.link_url.trim() : "#news"}
                                            target={hasNewsLink ? "_blank" : undefined}
                                            rel={hasNewsLink ? "noreferrer" : undefined}
                                            key={newsItem.slug || newsItem.id}
                                        >
                                            <span>{newsItem.title}</span>
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
                        {sortedProjects.map((project) => {
                            const status = normalizeStatus(project.status);
                            const projectImage = isVisibleUrl(project.image_url)
                                ? project.image_url.trim()
                                : "";

                            return (
                                <article className="project-card" key={project.slug || project.id}>
                                    {projectImage && (
                                        <img
                                            className="project-image"
                                            src={projectImage}
                                            alt=""
                                            loading="lazy"
                                        />
                                    )}

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

                                        <h3>{project.title}</h3>
                                        <p>{project.description || project.summary}</p>

                                        <div className="card-actions">
                                            <details className="project-info">
                                                <summary className="project-action info-action">
                                                    {content.projectsSection.infoButton}
                                                </summary>
                                                <div className="project-info-panel">
                                                    <span>{getStatusLabel(project.status)}</span>
                                                    <p>{project.description || project.summary}</p>
                                                </div>
                                            </details>
                                            {isVisibleUrl(project.website_url) && (
                                                <a
                                                    className="project-action"
                                                    href={project.website_url.trim()}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {content.projectsSection.websiteButton}
                                                </a>
                                            )}
                                            {isVisibleUrl(project.repo_url) && (
                                                <a
                                                    className="project-action"
                                                    href={project.repo_url.trim()}
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
                        {sortedNews.map((newsItem) => {
                            const newsDate = formatDate(
                                newsItem.published_at || newsItem.created_at,
                                language,
                            );
                            const newsImage = isVisibleUrl(newsItem.image_url)
                                ? newsItem.image_url.trim()
                                : "";

                            return (
                                <article className="news-item" key={newsItem.slug || newsItem.id}>
                                    {newsImage && (
                                        <img
                                            className="news-image"
                                            src={newsImage}
                                            alt=""
                                            loading="lazy"
                                        />
                                    )}

                                    <div className="news-content">
                                        <div className="news-meta">
                                            {newsItem.project_title && <span>{newsItem.project_title}</span>}
                                            {newsDate && <time>{newsDate}</time>}
                                        </div>

                                        <h3>{newsItem.title}</h3>
                                        <p>{newsItem.summary || newsItem.content}</p>

                                        {isVisibleUrl(newsItem.link_url) && (
                                            <a
                                                className="text-link"
                                                href={newsItem.link_url.trim()}
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

            <section id="contact" className="section contact-section">
                <div>
                    <p className="eyebrow">{content.contact.eyebrow}</p>
                    <h2>{content.contact.title}</h2>
                    <p>{content.contact.description}</p>
                    <p className="support-copy">{content.contact.supportText}</p>
                </div>

                <div className="contact-actions">
                    <a
                        className="button primary-button"
                        href={CONTACT_MAILTO}
                        aria-label={`Enviar correo a ${CONTACT_EMAIL}`}
                    >
                        {content.contact.button}
                    </a>
                    <a
                        className="button kofi-button"
                        href={KOFI_URL}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {content.contact.supportButton}
                    </a>
                </div>
            </section>

            <footer className="footer">
                <span>{content.footer.copyright}</span>
                <span>{content.footer.built}</span>
            </footer>
        </main>
    );
}

export default App;
