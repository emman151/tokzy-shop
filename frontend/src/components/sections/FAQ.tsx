import { faqItems } from '../../data/mockData'

const FAQ = () => {
  return (
    <section className="app-section">
      <div className="section-heading">
        <span className="section-heading__eyebrow">faq</span>
        <h2 className="section-heading__title">Answers about billing, delivery and security</h2>
      </div>
      <div className="faq-grid" style={{ marginTop: '32px' }}>
        {faqItems.map((item) => (
          <article key={item.question} className="faq-item">
            <h3 className="faq-item__question">{item.question}</h3>
            <p className="faq-item__answer">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FAQ
