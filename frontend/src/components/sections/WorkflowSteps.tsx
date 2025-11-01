import { workflowSteps } from '../../data/mockData'

const WorkflowSteps = () => {
  return (
    <section className="app-section">
      <div className="section-heading">
        <span className="section-heading__eyebrow">customer journey</span>
        <h2 className="section-heading__title">From package selection to confirmed payment in four steps</h2>
      </div>
      <div className="workflow-grid" style={{ marginTop: '32px' }}>
        {workflowSteps.map((step, index) => (
          <article key={step.title} className="workflow-step">
            <span className="workflow-step__index">0{index + 1}</span>
            <h3 className="workflow-step__title">{step.title}</h3>
            <p className="workflow-step__description">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default WorkflowSteps
