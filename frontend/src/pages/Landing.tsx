import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, BookOpen, ChartNoAxesCombined, ChevronRight, FlaskConical, SlidersHorizontal, Sparkles } from 'lucide-react'
import { HeartIllustration } from '../components/HeartIllustration'

const steps = [
  { number: '01', icon: SlidersHorizontal, title: 'Build a profile', text: 'Explore 18 inputs across personal details, lifestyle, medical history, and clinical values.' },
  { number: '02', icon: ChartNoAxesCombined, title: 'See the model’s estimate', text: 'A trained Logistic Regression model turns the profile into a probability and a risk label.' },
  { number: '03', icon: Sparkles, title: 'Make sense of the result', text: 'Choose an optional AI explanation of the estimate and relevant factors to discuss.' },
]

export function Landing() {
  return <main id="main">
    <section className="hero-section">
      <div className="page-shell hero-grid">
        <div className="hero-copy">
          <div className="eyebrow"><span className="tiny-dot" /> MACHINE LEARNING, MADE UNDERSTANDABLE</div>
          <h1>Explore heart-risk<br /><span>patterns.</span><br />Understand the why.</h1>
          <p className="hero-description">Explore a model-based risk estimate from your inputs, with an optional AI explanation to help you understand the result.</p>
          <div className="hero-actions"><Link to="/assessment" className="button primary large">Start assessment<ArrowRight size={19} /></Link><a href="#about" className="text-link">Explore the model<ArrowUpRight size={17} /></a></div>
          <div className="hero-note"><FlaskConical size={17} /><span>Clear inputs. Model-based insights.</span></div>
        </div>
        <HeartIllustration />
      </div>
      <div className="page-shell hero-strip"><span>HEART RISK INSIGHTS</span><div>18 raw inputs<span />Logistic Regression<span />Optional AI explanation</div><a href="#how-it-works">See how it works<ChevronRight size={16} /></a></div>
    </section>

    <section className="page-shell how-section" id="how-it-works">
      <div className="section-intro"><div><p className="eyebrow">FROM INPUT TO INSIGHT</p><h2>Three steps. A clearer understanding.</h2></div><p>Follow the data from your inputs<br className="desktop-break" /> to an estimate you can explore.</p></div>
      <div className="steps-grid">{steps.map(({ number, icon: Icon, title, text }) => <article className="step-item" key={number}><div className="step-top"><span className="step-icon"><Icon size={22} /></span><span className="step-number">{number}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>

    <section className="about-section" id="about"><div className="page-shell about-grid">
      <div className="about-copy"><p className="eyebrow"><BookOpen size={16} /> BEHIND THE ESTIMATE</p><h2>Built on data.<br />Designed for clarity.</h2><p>HeartWise brings model-based risk estimates and clear explanations into one place. Explore how personal details, lifestyle, medical history, and clinical values relate to the model’s output.</p><p>The prediction model uses 18 inputs and two automatically derived features. Logistic Regression was selected after comparing six models using cross-validation.</p><Link to="/assessment" className="text-link">Explore a profile<ArrowRight size={17} /></Link></div>
      <div className="method-panel"><div className="method-heading"><div><span className="label-caps">SELECTED MODEL</span><h3>Logistic Regression</h3></div><span className="soft-badge">18 inputs</span></div><div className="metric-grid"><div><strong>0.8523</strong><span>Test ROC-AUC</span></div><div><strong>76.36<span>%</span></strong><span>Test accuracy</span></div><div><strong>81.29<span>%</span></strong><span>Test recall</span></div></div><div className="method-detail"><span>Evaluation</span><strong>20,000 held-out rows</strong></div><div className="method-detail"><span>Classification threshold</span><strong>0.40</strong></div><details id="model-information" className="method-foot block"><summary className="cursor-pointer text-xs font-semibold">Model information</summary><p className="mt-3">The model was trained and evaluated on synthetic data. These saved notebook metrics come from 20,000 held-out synthetic rows at a classification threshold of 0.40. They do not establish performance on real patients. The probability reflects patterns learned from this dataset; it is not a diagnosis or a guarantee of health.</p></details></div>
    </div></section>
    <div className="page-shell closing-note"><span className="note-icon"><FlaskConical size={20} /></span><p><strong>Put the estimate in context.</strong> Review the model information to understand how the results were evaluated and what they can tell you.</p></div>
  </main>
}
