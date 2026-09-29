const navigateTo = (href) => {
    const nextUrl = new URL(href, window.location.href);

    if (nextUrl.origin !== window.location.origin) {
        window.location.assign(nextUrl.href);
        return;
    }

    const nextLocation = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
    const currentLocation = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (nextLocation !== currentLocation) {
        window.history.pushState({}, "", nextLocation);
    }

    window.dispatchEvent(new PopStateEvent("popstate"));
};

function SpaLink({ children, href, onClick, ...props }) {
    const handleClick = (event) => {
        onClick?.(event);

        if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            props.target === "_blank"
        ) {
            return;
        }

        event.preventDefault();
        navigateTo(href);
    };

    return (
        <a href={href} onClick={handleClick} {...props}>
            {children}
        </a>
    );
}

export default SpaLink;
