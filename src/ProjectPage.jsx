import { useEffect, useMemo, useRef, useState } from "react";
import "./ProjectPage.css";
import logoImage from "./assets/logo.png";
import SpaLink from "./SpaLink.jsx";

const textByLanguage = {
    en: {
        nav: { projects: "All projects", home: "Home" },
        loading: "Loading project...",
        loadingEyebrow: "Project file",
        errorEyebrow: "Connection problem",
        errorTitle: "The project could not be loaded",
        errorCopy: "The public project information is not available right now. Please try again later.",
        notFoundEyebrow: "404 · Project not found",
        notFoundTitle: "This project is not available",
        notFoundCopy: "It may have moved, changed its address, or is no longer public.",
        backToProjects: "Back to projects",
        overviewEyebrow: "About the project",
        overviewTitle: "Overview",
        technologiesEyebrow: "Built with",
        technologiesTitle: "Technologies",
        galleryEyebrow: "Media",
        galleryTitle: "Gallery",
        updatesEyebrow: "Development log",
        updatesTitle: "Updates",
        website: "Visit website",
        repository: "Source code",
        download: "Download",
        readMore: "Read more",
        imageFallback: "Project artwork",
        mediaUnavailable: "This media item is not available.",
        close: "Close gallery",
        previous: "Previous image",
        next: "Next image",
        imageCount: (current, total) => `Image ${current} of ${total}`,
        untitledUpdate: "Project update",
        footer: "© 2026 KaneCatDev",
    },
    es: {
        nav: { projects: "Todos los proyectos", home: "Inicio" },
        loading: "Cargando proyecto...",
        loadingEyebrow: "Ficha de proyecto",
        errorEyebrow: "Problema de conexión",
        errorTitle: "No se pudo cargar el proyecto",
        errorCopy: "La información pública del proyecto no está disponible ahora mismo. Inténtalo de nuevo más tarde.",
        notFoundEyebrow: "404 · Proyecto no encontrado",
        notFoundTitle: "Este proyecto no está disponible",
        notFoundCopy: "Puede que se haya movido, haya cambiado de dirección o ya no sea público.",
        backToProjects: "Volver a proyectos",
        overviewEyebrow: "Sobre el proyecto",
        overviewTitle: "Descripción",
        technologiesEyebrow: "Creado con",
        technologiesTitle: "Tecnologías",
        galleryEyebrow: "Contenido multimedia",
        galleryTitle: "Galería",
        updatesEyebrow: "Diario de desarrollo",
        updatesTitle: "Actualizaciones",
        website: "Visitar web",
        repository: "Código fuente",
        download: "Descargar",
        readMore: "Leer más",
        imageFallback: "Imagen del proyecto",
        mediaUnavailable: "Este contenido multimedia no está disponible.",
        close: "Cerrar galería",
        previous: "Imagen anterior",
        next: "Imagen siguiente",
        imageCount: (current, total) => `Imagen ${current} de ${total}`,
        untitledUpdate: "Actualización del proyecto",
        footer: "© 2026 KaneCatDev",
    },
};

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

const statusLabels = {
    en: {
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
    es: {
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
    return value ? value.trim() : "";
};

const normalizeStatus = (status) => {
    if (!status) {
        return "unknown";
    }

    return String(status).toLowerCase().replace(/[_\s]+/g, "-");
};

const humanizeStatus = (status) =>
    status
        ? String(status)
              .replace(/[_-]+/g, " ")
              .replace(/\b\w/g, (letter) => letter.toUpperCase())
        : "";

const formatDate = (value, language) => {
    if (!value) {
        return "";
    }

    const datePart = String(value).slice(0, 10);
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart);

    if (!match) {
        return "";
    }

    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat(language === "es" ? "es-ES" : "en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(date);
};

const getYouTubeEmbedUrl = (value) => {
    const safeUrl = getSafeWebUrl(value);

    if (!safeUrl) {
        return "";
    }

    try {
        const url = new URL(safeUrl);
        const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
        let videoId = "";

        if (hostname === "youtu.be") {
            videoId = url.pathname.split("/").filter(Boolean)[0] || "";
        } else if (
            hostname === "youtube.com" ||
            hostname === "m.youtube.com" ||
            hostname === "youtube-nocookie.com"
        ) {
            if (url.pathname === "/watch") {
                videoId = url.searchParams.get("v") || "";
            } else {
                const pathParts = url.pathname.split("/").filter(Boolean);
                if (["embed", "shorts", "live"].includes(pathParts[0])) {
                    videoId = pathParts[1] || "";
                }
            }
        }

        if (!/^[a-zA-Z0-9_-]{6,20}$/.test(videoId)) {
            return "";
        }

        return `https://www.youtube-nocookie.com/embed/${videoId}`;
    } catch {
        return "";
    }
};

const setMetadata = ({ description, image, title }) => {
    const previousTitle = document.title;
    const changes = [];

    const updateMeta = (attribute, key, value) => {
        let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
        const wasCreated = !element;

        if (!element) {
            element = document.createElement("meta");
            element.setAttribute(attribute, key);
            document.head.appendChild(element);
        }

        changes.push({ element, previousValue: element.getAttribute("content"), wasCreated });
        element.setAttribute("content", value);
    };

    document.title = title;
    updateMeta("name", "description", description);
    updateMeta("property", "og:title", title);
    updateMeta("property", "og:description", description);
    updateMeta("property", "og:image", image);
    updateMeta("property", "og:url", window.location.href);
    updateMeta("property", "og:type", "website");

    return () => {
        document.title = previousTitle;
        changes.forEach(({ element, previousValue, wasCreated }) => {
            if (wasCreated) {
                element.remove();
            } else if (previousValue === null) {
                element.removeAttribute("content");
            } else {
                element.setAttribute("content", previousValue);
            }
        });
    };
};

function ProjectHeader({ language, onToggleLanguage, text }) {
    return (
        <header className="navbar project-navbar">
            <SpaLink className="brand" href="/#top" aria-label="KaneCatDev">
                <span className="brand-mark">
                    <img src={logoImage} alt="" aria-hidden="true" />
                </span>
                <span>KaneCatDev</span>
            </SpaLink>

            <div className="nav-actions project-nav-actions">
                <nav className="nav-links" aria-label="Project navigation">
                    <SpaLink href="/#top">{text.nav.home}</SpaLink>
                    <SpaLink href="/#projects">{text.nav.projects}</SpaLink>
                </nav>
                <button
                    className="language-toggle"
                    type="button"
                    onClick={onToggleLanguage}
                    aria-label={language === "en" ? "Cambiar idioma a español" : "Switch language to English"}
                >
                    <span lang="en" className={language === "en" ? "active-language" : ""}>EN</span>
                    <span aria-hidden="true">/</span>
                    <span lang="es" className={language === "es" ? "active-language" : ""}>ES</span>
                </button>
            </div>
        </header>
    );
}

function ProjectStatePage({ language, onToggleLanguage, state, text }) {
    const isNotFound = state === "not-found";

    return (
        <main className="page project-page">
            <ProjectHeader language={language} onToggleLanguage={onToggleLanguage} text={text} />
            <section className={`project-state ${state === "loading" ? "project-state-loading" : ""}`} aria-live="polite">
                <span className="project-state-mark" aria-hidden="true">
                    {state === "loading" ? "…" : isNotFound ? "404" : "!"}
                </span>
                <p className="eyebrow">
                    {state === "loading"
                        ? text.loadingEyebrow
                        : isNotFound
                          ? text.notFoundEyebrow
                          : text.errorEyebrow}
                </p>
                <h1>
                    {state === "loading"
                        ? text.loading
                        : isNotFound
                          ? text.notFoundTitle
                          : text.errorTitle}
                </h1>
                {state !== "loading" && <p>{isNotFound ? text.notFoundCopy : text.errorCopy}</p>}
                {state !== "loading" && (
                    <SpaLink className="button primary-button" href="/#projects">
                        {text.backToProjects}
                    </SpaLink>
                )}
            </section>
        </main>
    );
}

function MediaGallery({ media, text }) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const closeButtonRef = useRef(null);
    const imageItems = useMemo(
        () =>
            media
                .filter((item) => String(item?.type).toLowerCase() === "image")
                .map((item) => ({
                    ...item,
                    mediaIndex: media.indexOf(item),
                    safeUrl: getSafeWebUrl(item.url),
                }))
                .filter((item) => item.safeUrl),
        [media],
    );
    const isLightboxOpen = selectedImageIndex !== null;

    useEffect(() => {
        if (!isLightboxOpen) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        const previouslyFocused = document.activeElement;
        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setSelectedImageIndex(null);
            } else if (event.key === "ArrowLeft" && imageItems.length > 1) {
                setSelectedImageIndex((current) =>
                    current === null ? null : (current - 1 + imageItems.length) % imageItems.length,
                );
            } else if (event.key === "ArrowRight" && imageItems.length > 1) {
                setSelectedImageIndex((current) =>
                    current === null ? null : (current + 1) % imageItems.length,
                );
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
            previouslyFocused?.focus?.();
        };
    }, [imageItems.length, isLightboxOpen]);

    return (
        <>
            <div className="project-gallery-grid">
                {media.map((item, index) => {
                    const type = String(item?.type || "").toLowerCase();
                    const url = getSafeWebUrl(item?.url);
                    const thumbnailUrl = getSafeWebUrl(item?.thumbnail_url);
                    const title = getDisplayText(item?.title);
                    const caption = getDisplayText(item?.caption);

                    if (type === "image") {
                        const currentImagePosition = imageItems.findIndex(
                            (imageItem) => imageItem.mediaIndex === index,
                        );

                        return url ? (
                            <figure className="project-media-card project-image-card" key={item.id || `${url}-${index}`}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedImageIndex(currentImagePosition)}
                                    aria-label={title || text.imageFallback}
                                >
                                    <img src={thumbnailUrl || url} alt={title || caption || ""} loading="lazy" />
                                    <span className="project-media-zoom" aria-hidden="true">＋</span>
                                </button>
                                {(title || caption) && (
                                    <figcaption>
                                        {title && <strong>{title}</strong>}
                                        {caption && <span>{caption}</span>}
                                    </figcaption>
                                )}
                            </figure>
                        ) : (
                            <div className="project-media-card media-unavailable" key={item.id || index}>
                                {text.mediaUnavailable}
                            </div>
                        );
                    }

                    if (type === "youtube") {
                        const embedUrl = getYouTubeEmbedUrl(url);
                        return embedUrl ? (
                            <figure className="project-media-card project-video-card" key={item.id || `${url}-${index}`}>
                                <div className="project-video-frame">
                                    <iframe
                                        src={embedUrl}
                                        title={title || "YouTube video"}
                                        loading="lazy"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                    />
                                </div>
                                {(title || caption) && (
                                    <figcaption>
                                        {title && <strong>{title}</strong>}
                                        {caption && <span>{caption}</span>}
                                    </figcaption>
                                )}
                            </figure>
                        ) : (
                            <div className="project-media-card media-unavailable" key={item.id || index}>
                                {text.mediaUnavailable}
                            </div>
                        );
                    }

                    if (type === "video") {
                        return url ? (
                            <figure className="project-media-card project-video-card" key={item.id || `${url}-${index}`}>
                                <video controls playsInline preload="metadata" poster={thumbnailUrl || undefined}>
                                    <source src={url} />
                                </video>
                                {(title || caption) && (
                                    <figcaption>
                                        {title && <strong>{title}</strong>}
                                        {caption && <span>{caption}</span>}
                                    </figcaption>
                                )}
                            </figure>
                        ) : (
                            <div className="project-media-card media-unavailable" key={item.id || index}>
                                {text.mediaUnavailable}
                            </div>
                        );
                    }

                    return null;
                })}
            </div>

            {isLightboxOpen && imageItems[selectedImageIndex] && (
                <div
                    className="lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label={text.galleryTitle}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedImageIndex(null);
                        }
                    }}
                >
                    <button
                        ref={closeButtonRef}
                        className="lightbox-close"
                        type="button"
                        onClick={() => setSelectedImageIndex(null)}
                        aria-label={text.close}
                    >
                        ×
                    </button>

                    {imageItems.length > 1 && (
                        <button
                            className="lightbox-arrow lightbox-previous"
                            type="button"
                            onClick={() =>
                                setSelectedImageIndex(
                                    (selectedImageIndex - 1 + imageItems.length) % imageItems.length,
                                )
                            }
                            aria-label={text.previous}
                        >
                            ‹
                        </button>
                    )}

                    <figure className="lightbox-content">
                        <img
                            src={imageItems[selectedImageIndex].safeUrl}
                            alt={getDisplayText(
                                imageItems[selectedImageIndex].title,
                                imageItems[selectedImageIndex].caption,
                            )}
                        />
                        <figcaption>
                            <span>{text.imageCount(selectedImageIndex + 1, imageItems.length)}</span>
                            {getDisplayText(imageItems[selectedImageIndex].title) && (
                                <strong>{getDisplayText(imageItems[selectedImageIndex].title)}</strong>
                            )}
                            {getDisplayText(imageItems[selectedImageIndex].caption) && (
                                <p>{getDisplayText(imageItems[selectedImageIndex].caption)}</p>
                            )}
                        </figcaption>
                    </figure>

                    {imageItems.length > 1 && (
                        <button
                            className="lightbox-arrow lightbox-next"
                            type="button"
                            onClick={() =>
                                setSelectedImageIndex((selectedImageIndex + 1) % imageItems.length)
                            }
                            aria-label={text.next}
                        >
                            ›
                        </button>
                    )}
                </div>
            )}
        </>
    );
}

function ProjectPage({ apiBaseUrl, slug }) {
    const [language, setLanguage] = useState(getInitialLanguage);
    const [state, setState] = useState("loading");
    const [projectData, setProjectData] = useState(null);
    const text = textByLanguage[language];

    useEffect(() => {
        localStorage.setItem("portfolio-language", language);
        document.documentElement.lang = language;
    }, [language]);

    useEffect(() => {
        const abortController = new AbortController();

        const loadProject = async () => {
            setState("loading");
            setProjectData(null);

            try {
                const response = await fetch(`${apiBaseUrl}/projects/${encodeURIComponent(slug)}`, {
                    headers: { Accept: "application/json" },
                    signal: abortController.signal,
                });

                if (response.status === 404) {
                    setState("not-found");
                    return;
                }

                if (!response.ok) {
                    throw new Error("Project request failed");
                }

                const data = await response.json();

                if (!data?.ok || !data?.project) {
                    throw new Error("Project response was not valid");
                }

                setProjectData({
                    project: data.project,
                    media: Array.isArray(data.media) ? data.media : [],
                    news: Array.isArray(data.news) ? data.news : [],
                });
                setState("ready");
            } catch (error) {
                if (error.name !== "AbortError") {
                    setState("error");
                }
            }
        };

        loadProject();
        return () => abortController.abort();
    }, [apiBaseUrl, slug]);

    useEffect(() => {
        if (state === "loading") {
            return setMetadata({
                title: `${text.loading} | KaneCatDev`,
                description: text.loading,
                image: new URL(logoImage, window.location.origin).href,
            });
        }

        if (state !== "ready" || !projectData) {
            const notFound = state === "not-found";
            return setMetadata({
                title: `${notFound ? text.notFoundTitle : text.errorTitle} | KaneCatDev`,
                description: notFound ? text.notFoundCopy : text.errorCopy,
                image: new URL(logoImage, window.location.origin).href,
            });
        }

        const { project } = projectData;
        const title = getDisplayText(project.title) || "KaneCatDev";
        const description = getDisplayText(project.summary, project.description) || text.overviewTitle;
        const image =
            getSafeWebUrl(project.banner_url) ||
            getSafeWebUrl(project.image_url) ||
            new URL(logoImage, window.location.origin).href;

        return setMetadata({ title: `${title} | KaneCatDev`, description, image });
    }, [projectData, state, text]);

    const toggleLanguage = () => {
        setLanguage((currentLanguage) => (currentLanguage === "en" ? "es" : "en"));
    };

    if (state !== "ready" || !projectData) {
        return (
            <ProjectStatePage
                language={language}
                onToggleLanguage={toggleLanguage}
                state={state}
                text={text}
            />
        );
    }

    const { media, news, project } = projectData;
    const title = getDisplayText(project.title) || slug;
    const summary = getDisplayText(project.summary);
    const description = getDisplayText(project.description);
    const longDescription = getDisplayText(project.long_description);
    const bannerUrl = getSafeWebUrl(project.banner_url);
    const coverUrl = getSafeWebUrl(project.image_url);
    const heroImage = bannerUrl || coverUrl;
    const websiteUrl = getSafeWebUrl(project.website_url);
    const repositoryUrl = getSafeWebUrl(project.repo_url);
    const downloadUrl = getSafeWebUrl(project.download_url);
    const technologies = Array.isArray(project.technologies)
        ? project.technologies.filter((technology) => typeof technology === "string" && technology.trim())
        : [];
    const status = normalizeStatus(project.status);
    const statusLabel = statusLabels[language][status] || humanizeStatus(project.status) || statusLabels[language].unknown;

    return (
        <main className="page project-page">
            <ProjectHeader language={language} onToggleLanguage={toggleLanguage} text={text} />

            <article className="project-detail">
                <header className={`project-detail-hero ${heroImage ? "has-hero-image" : ""}`}>
                    {heroImage && <img className="project-hero-background" src={heroImage} alt="" />}
                    <div className="project-hero-scrim" aria-hidden="true" />
                    <div className="project-hero-content">
                        <div className="project-hero-copy">
                            <SpaLink className="project-back-link" href="/#projects">
                                <span aria-hidden="true">←</span> {text.backToProjects}
                            </SpaLink>
                            <span className={`project-status ${statusClassNames[status] || "status-paused"}`}>
                                {statusLabel}
                            </span>
                            <h1>{title}</h1>
                            {summary && <p>{summary}</p>}

                            {(websiteUrl || repositoryUrl || downloadUrl) && (
                                <div className="project-hero-actions">
                                    {websiteUrl && (
                                        <a className="button primary-button" href={websiteUrl} target="_blank" rel="noreferrer">
                                            {text.website} <span aria-hidden="true">↗</span>
                                        </a>
                                    )}
                                    {repositoryUrl && (
                                        <a className="button secondary-button" href={repositoryUrl} target="_blank" rel="noreferrer">
                                            {text.repository} <span aria-hidden="true">↗</span>
                                        </a>
                                    )}
                                    {downloadUrl && (
                                        <a className="button download-button" href={downloadUrl} target="_blank" rel="noreferrer">
                                            {text.download} <span aria-hidden="true">↓</span>
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        {coverUrl && (
                            <div className="project-cover-shell">
                                <img src={coverUrl} alt={`${title} · ${text.imageFallback}`} />
                            </div>
                        )}
                    </div>
                </header>

                {(description || longDescription) && (
                    <section className="project-content-section project-overview" aria-labelledby="project-overview-title">
                        <div className="project-section-heading">
                            <p className="eyebrow">{text.overviewEyebrow}</p>
                            <h2 id="project-overview-title">{text.overviewTitle}</h2>
                        </div>
                        <div className="project-prose">
                            {description && <p className="project-lead">{description}</p>}
                            {longDescription &&
                                longDescription.split(/\r?\n\s*\r?\n/).map((paragraph, index) => (
                                    <p key={`${paragraph.slice(0, 32)}-${index}`}>{paragraph}</p>
                                ))}
                        </div>
                    </section>
                )}

                {technologies.length > 0 && (
                    <section className="project-content-section" aria-labelledby="project-technologies-title">
                        <div className="project-section-heading">
                            <p className="eyebrow">{text.technologiesEyebrow}</p>
                            <h2 id="project-technologies-title">{text.technologiesTitle}</h2>
                        </div>
                        <div className="project-technology-list">
                            {technologies.map((technology, index) => (
                                <span key={`${technology}-${index}`}>{technology.trim()}</span>
                            ))}
                        </div>
                    </section>
                )}

                {media.length > 0 && (
                    <section className="project-content-section" aria-labelledby="project-gallery-title">
                        <div className="project-section-heading">
                            <p className="eyebrow">{text.galleryEyebrow}</p>
                            <h2 id="project-gallery-title">{text.galleryTitle}</h2>
                        </div>
                        <MediaGallery media={media} text={text} />
                    </section>
                )}

                {news.length > 0 && (
                    <section className="project-content-section project-updates" aria-labelledby="project-updates-title">
                        <div className="project-section-heading">
                            <p className="eyebrow">{text.updatesEyebrow}</p>
                            <h2 id="project-updates-title">{text.updatesTitle}</h2>
                        </div>
                        <div className="project-update-list">
                            {news.map((item, index) => {
                                const itemTitle = getDisplayText(item.title) || text.untitledUpdate;
                                const itemSummary = getDisplayText(item.summary);
                                const itemContent = getDisplayText(item.content);
                                const itemImage = getSafeWebUrl(item.image_url);
                                const itemLink = getSafeWebUrl(item.link_url);
                                const itemDate = formatDate(item.published_at || item.created_at, language);

                                return (
                                    <article className="project-update" key={item.slug || item.id || `${itemTitle}-${index}`}>
                                        {itemImage && <img src={itemImage} alt="" loading="lazy" />}
                                        <div className="project-update-content">
                                            {itemDate && <time dateTime={String(item.published_at || item.created_at).slice(0, 10)}>{itemDate}</time>}
                                            <h3>{itemTitle}</h3>
                                            {itemSummary && <p className="project-update-summary">{itemSummary}</p>}
                                            {itemContent && <p className="project-update-body">{itemContent}</p>}
                                            {itemLink && (
                                                <a className="text-link" href={itemLink} target="_blank" rel="noreferrer">
                                                    {text.readMore} <span aria-hidden="true">↗</span>
                                                </a>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                )}
            </article>

            <footer className="footer project-footer">
                <span>{text.footer}</span>
                <SpaLink href="/#projects">{text.backToProjects}</SpaLink>
            </footer>
        </main>
    );
}

export default ProjectPage;
