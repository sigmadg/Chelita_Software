import './Card.css'

export function Card({ title, children, className = '' }) {
  const titleId = title ? title.replace(/\s+/g, '-').toLowerCase() : null
  return (
    <section
      className={`card ${className}`}
      aria-labelledby={titleId || undefined}
    >
      {title && (
        <h2 id={titleId} className="card__title">
          {title}
        </h2>
      )}
      <div className="card__body">{children}</div>
    </section>
  )
}
