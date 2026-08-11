export default function PageSection({ eyebrow, title, description, highlights }) {
    return (
        <section className="route-page">
            <header className="route-page__hero">
                <div>
                    <p className="app-eyebrow">{eyebrow}</p>
                    <h1>{title}</h1>
                    <p className="app-subtitle">{description}</p>
                </div>

                <div className="route-page__status">
                    Test navigation
                </div>
            </header>

            <div className="route-page__grid">
                {highlights.map(highlight => (
                    <article key={highlight.title} className="route-card">
                        <p className="route-card__eyebrow">{highlight.eyebrow}</p>
                        <h2>{highlight.title}</h2>
                        <p>{highlight.description}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}