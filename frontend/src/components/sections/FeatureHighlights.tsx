import { marketplaceHighlights } from '../../data/mockData'

const FeatureHighlights = () => {
  return (
    <section className="app-section">
      <div className="section-heading">
        <span className="section-heading__eyebrow">why it works</span>
        <h2 className="section-heading__title">Infrastructure that automates every top-up workflow</h2>
        <p className="section-heading__subtitle">
          From payment APIs to automatic account delivery — PulseTopUp covers the entire order lifecycle and removes bottlenecks.
        </p>
      </div>
      <div className="feature-grid" style={{ marginTop: '32px' }}>
        {marketplaceHighlights.map((item) => (
          <article key={item.title} className="feature-card">
            <span className="feature-card__icon" aria-hidden>
              {item.icon}
            </span>
            <h3 className="feature-card__title">{item.title}</h3>
            <p className="feature-card__description">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FeatureHighlights
