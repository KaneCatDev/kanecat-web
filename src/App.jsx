import { useEffect, useState } from "react";
import "./App.css";
import logoImage from "./assets/logo.png";

/*
  Portfolio principal de KaneCatDev.
  Código en inglés y comentarios en español.
  Incluye selector de idioma ES/EN guardado en localStorage.
*/

const translations = {
    en: {
        nav: {
            projects: "Projects",
            about: "About",
            contact: "Contact",
        },
        hero: {
            eyebrow: "Apps · Games · AI Systems",
            title: "Building apps, games and AI systems with personality.",
            description:
                "I am Kane, a developer focused on Android apps, videogames, automation, AI companions and experimental tools.",
            primaryButton: "View projects",
            secondaryButton: "Contact me",
        },
        profile: {
            title: "KaneCatDev",
            subtitle: "Developer profile",
            status: "Currently building Gakeyru",
        },
        projectsSection: {
            eyebrow: "Selected work",
            title: "Projects",
        },
        statusLabels: {
            finished: "Finished",
            inProgress: "In progress",
            paused: "Paused",
            cancelled: "Cancelled",
        },
        projects: [
            {
                title: "Gakeyru",
                type: "Android App",
                status: "inProgress",
                description:
                    "A videogame deals aggregator focused on search, filters, favorites and store redirection.",
                tags: ["Kotlin", "Jetpack Compose", "Room", "CheapShark API"],
            },
            {
                title: "Hana AI VRC",
                type: "VRChat Assistant",
                status: "inProgress",
                description:
                    "An experimental AI companion system connected to VRChat, voice, memory and OSC controls.",
                tags: ["Python", "OSC", "AI", "TTS"],
            },
            {
                title: "Hellies Bots",
                type: "Discord / VRChat Tools",
                status: "paused",
                description:
                    "Community bots for events, announcements, reports and VRChat instance utilities.",
                tags: ["Discord", "Node/Python", "Automation"],
            },
        ],
        about: {
            eyebrow: "About",
            title: "Developer with a taste for dark interfaces.",
            description:
                "I study software development and build projects around Android, backend systems, automation, AI and videogames. My goal is to create software that feels personal and useful.",
        },
        stack: {
            eyebrow: "Stack",
            title: "Technologies",
        },
        contact: {
            eyebrow: "Contact",
            button: "contact@kanecat.dev",
        },
        footer: {
            copyright: "© 2026 KaneCatDev",
            built: "Built with React",
        },
    },

    es: {
        nav: {
            projects: "Proyectos",
            about: "Sobre mí",
            contact: "Contacto",
        },
        hero: {
            eyebrow: "Apps · Juegos · Sistemas IA",
            title: "Desarrollo apps, juegos y sistemas con personalidad.",
            description:
                "Soy Kane, un desarrollador centrado en apps Android, videojuegos, automatización, compañeras IA y herramientas experimentales.",
            primaryButton: "Ver proyectos",
            secondaryButton: "Contactar",
        },
        profile: {
            title: "KaneCatDev",
            subtitle: "Perfil de desarrollador",
            status: "Actualmente creando Gakeyru",
        },
        projectsSection: {
            eyebrow: "Trabajo destacado",
            title: "Proyectos",
        },
        statusLabels: {
            finished: "Terminado",
            inProgress: "En progreso",
            paused: "Pausado",
            cancelled: "Cancelado",
        },
        projects: [
            {
                title: "Gakeyru",
                type: "App Android",
                status: "inProgress",
                description:
                    "Un agregador de ofertas de videojuegos centrado en búsqueda, filtros, favoritos y redirección a tiendas.",
                tags: ["Kotlin", "Jetpack Compose", "Room", "CheapShark API"],
            },
            {
                title: "Hana AI VRC",
                type: "Asistente para VRChat",
                status: "inProgress",
                description:
                    "Un sistema experimental de compañera IA conectado a VRChat, voz, memoria y controles OSC.",
                tags: ["Python", "OSC", "IA", "TTS"],
            },
            {
                title: "Hellies Bots",
                type: "Discord / Herramientas VRChat",
                status: "paused",
                description:
                    "Bots comunitarios para eventos, anuncios, informes y utilidades relacionadas con instancias de VRChat.",
                tags: ["Discord", "Python", "Automatización"],
            },
        ],
        about: {
            eyebrow: "Sobre mí",
            description:
                "Estudio desarrollo de software y creo proyectos relacionados con Android, backend, automatización, IA y videojuegos. Mi objetivo es crear software personal y de utilidad.",
        },
        stack: {
            eyebrow: "Stack",
            title: "Tecnologías",
        },
        contact: {
            eyebrow: "Contacto",
            button: "contact@kanecat.dev",
        },
        footer: {
            copyright: "© 2026 KaneCatDev",
            built: "Creado con React",
        },
    },
};

const skills = [
    "Python",
    "Java",
    "Spring Boot",
    "Kotlin",
    "Android",
    "C#",
    "React",
    "JavaScript",
    "PHP",
    "Dart",
    "Flutter",
    "MySQL",
    "MongoDB",
    "Blender",
    "Unity",
    "VRC Creator Companion",
];

function App() {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem("portfolio-language") || "en";
    });

    const content = translations[language];

    const projectStatusClassNames = {
        finished: "status-finished",
        inProgress: "status-in-progress",
        paused: "status-paused",
        cancelled: "status-cancelled",
    };

    // Devuelve el texto del estado según el idioma actual.
    const getProjectStatusLabel = (status) => {
        return content.statusLabels[status] || status;
    };

    // Guarda el idioma elegido para mantenerlo al recargar la web.
    useEffect(() => {
        localStorage.setItem("portfolio-language", language);
    }, [language]);

    // Cambia entre inglés y español.
    const toggleLanguage = () => {
        setLanguage((currentLanguage) => (currentLanguage === "en" ? "es" : "en"));
    };

    return (
        <main className="page">
            {/* Fondo decorativo con brillos suaves */}
            <div className="background-glow glow-one"></div>
            <div className="background-glow glow-two"></div>

            {/* Barra superior */}
            <header className="navbar">
                <div className="brand">
                    <span className="brand-mark">KC</span>
                    <span>KaneCatDev</span>
                </div>

                <div className="nav-actions">
                    <nav className="nav-links">
                        <a href="#projects">{content.nav.projects}</a>
                        <a href="#about">{content.nav.about}</a>
                        <a href="#contact">{content.nav.contact}</a>
                    </nav>

                    <button
                        className="language-toggle"
                        type="button"
                        onClick={toggleLanguage}
                        aria-label="Change language"
                    >
                        <span className={language === "en" ? "active-language" : ""}>
                            EN
                        </span>
                        <span>/</span>
                        <span className={language === "es" ? "active-language" : ""}>
                            ES
                        </span>
                    </button>
                </div>
            </header>

            {/* Hero principal */}
            <section className="hero">
                <div className="hero-content">
                    <p className="eyebrow">{content.hero.eyebrow}</p>

                    <h1>{content.hero.title}</h1>

                    <p className="hero-description">{content.hero.description}</p>

                    <div className="hero-actions">
                        <a className="button primary-button" href="#projects">
                            {content.hero.primaryButton}
                        </a>
                        <a className="button secondary-button" href="#contact">
                            {content.hero.secondaryButton}
                        </a>
                    </div>
                </div>

                {/* Tarjeta visual de identidad */}
                <aside className="hero-card">
                    <div className="avatar-ring">
                        <div className="avatar-core">
                            <img
                                src={logoImage}
                                alt="KaneCatDev logo"
                                className="avatar-image"
                            />
                        </div>
                    </div>

                    <h2>{content.profile.title}</h2>
                    <p>{content.profile.subtitle}</p>

                    <div className="status-box">
                        <span className="status-dot"></span>
                        <span>{content.profile.status}</span>
                    </div>
                </aside>
            </section>

            {/* Proyectos */}
            <section id="projects" className="section">
                <div className="section-heading">
                    <p className="eyebrow">{content.projectsSection.eyebrow}</p>
                    <h2>{content.projectsSection.title}</h2>
                </div>

                <div className="project-grid">
                    {content.projects.map((project) => (
                        <article className="project-card" key={project.title}>
                            <div className="project-card-header">
                                <p className="project-type">{project.type}</p>

                                <span
                                    className={`project-status ${
                                        projectStatusClassNames[project.status] || "status-paused"
                                    }`}
                                >
                                    {getProjectStatusLabel(project.status)}
                                </span>
                            </div>

                            <h3>{project.title}</h3>
                            <p>{project.description}</p>

                            <div className="tag-list">
                                {project.tags.map((tag) => (
                                    <span className="tag" key={tag}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Sobre mí */}
            <section id="about" className="section about-section">
                <div>
                    <p className="eyebrow">{content.about.eyebrow}</p>
                    <h2>{content.about.title}</h2>
                </div>

                <p>{content.about.description}</p>
            </section>

            {/* Tecnologías */}
            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">{content.stack.eyebrow}</p>
                    <h2>{content.stack.title}</h2>
                </div>

                <div className="skill-list">
                    {skills.map((skill) => (
                        <span className="skill" key={skill}>
                            {skill}
                        </span>
                    ))}
                </div>
            </section>

            {/* Contacto */}
            <section id="contact" className="section contact-section">
                <p className="eyebrow">{content.contact.eyebrow}</p>

                <a className="button primary-button" href="mailto:contact@kanecat.dev">
                    {content.contact.button}
                </a>
            </section>

            <footer className="footer">
                <span>{content.footer.copyright}</span>
                <span>{content.footer.built}</span>
            </footer>
        </main>
    );
}

export default App;