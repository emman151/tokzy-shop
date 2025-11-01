import { testimonials } from '../../data/mockData'

const Testimonials = () => {
  return (
    <section className="app-section">
      <div className="section-heading">
        <span className="section-heading__eyebrow">teams & partners</span>
        <h2 className="section-heading__title">Trusted by streamers, esports clubs and boosting services</h2>
        <p className="section-heading__subtitle">
          PulseTopUp enables esports organisations and large communities to build subscriptions, loyalty bonuses and flexible promotional campaigns.
        </p>
      </div>
      <div className="testimonial-grid" style={{ marginTop: '32px' }}>
        {testimonials.map((item) => (
          <article key={item.name} className="testimonial-card">
            <div className="testimonial-card__header">
              <span className="testimonial-card__avatar">{item.initials}</span>
              <div>
                <strong>{item.name}</strong>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{item.role}</p>
              </div>
            </div>
            <p className="testimonial-card__content">“{item.quote}”</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Testimonials
