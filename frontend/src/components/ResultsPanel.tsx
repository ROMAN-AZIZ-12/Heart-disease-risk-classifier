import { Link } from 'react-router-dom'
import { Activity, ArrowDown, CircleCheck, Info, LoaderCircle, LockKeyhole, MessageCircleQuestion, ScanHeart, Sparkles } from 'lucide-react'
import type { Explanation, Prediction } from '../lib/profile'

interface Props {
  prediction: Prediction | null; explanation: Explanation | null
  predicting: boolean; explaining: boolean; consent: boolean; error: string
  onConsent: (value: boolean) => void; onExplain: () => void
}

export function ResultsPanel({ prediction, explanation, predicting, explaining, consent, error, onConsent, onExplain }: Props) {
  const percent = prediction ? prediction.probability * 100 : 0
  // Keep provider-specific backend messages out of the display copy.
  const explanationError = error.includes('GEMINI_API_KEY')
    ? 'AI explanation is not configured. Please contact the app administrator.'
    : error.replace(/\bGemini\b/g, 'AI explanation')
  return <aside className="results-column" aria-label="Assessment results">
    <div className="result-card" aria-live="polite" aria-busy={predicting}>
      <div className="panel-title"><span className="icon-inline"><Activity size={18} />Your estimate</span><span className="soft-badge">MODEL OUTPUT</span></div>
      {!prediction ? <div className="result-empty"><div className="empty-orbit"><ScanHeart size={44} strokeWidth={1.4} /></div><h2>{predicting ? 'Reading the patterns…' : 'Your profile. A new perspective.'}</h2><p>{predicting ? 'The saved model is calculating an estimate from your inputs.' : 'Complete the profile and calculate an estimate to see the model’s probability and risk label here.'}</p><div className="empty-process"><span><CircleCheck size={15} />18 raw inputs</span><ArrowDown size={15} /><span><Activity size={15} />One model-based estimate</span></div></div> : <div className={`prediction-content ${prediction.risk_label === 'High risk' ? 'higher-risk' : ''}`}>
        <div className="prediction-label"><span className="tiny-dot" />{prediction.risk_label}</div>
        <p className="score">{percent.toFixed(1)}<span>%</span></p><p className="score-label">Estimated risk probability</p>
        <div className="probability-track" role="meter" aria-label="Estimated risk probability" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><span style={{ width: `${percent}%` }} /><i style={{ left: `${prediction.threshold * 100}%` }} title="Classification threshold" /></div>
        <div className="scale-labels"><span>0%</span><span>100%</span></div>
        <div className="threshold-detail"><span>Classification threshold</span><strong>{prediction.threshold.toFixed(2)}</strong></div>
        <p className="result-context">{prediction.risk_label === 'High risk' ? 'This profile meets or exceeds the saved model’s threshold for a high-risk label.' : 'This profile falls below the saved model’s threshold. A lower-risk result does not guarantee health.'}</p>
        <div className="mini-notice"><Info size={16} /><p>Learn about the dataset and evaluation limits in <Link to="/#model-information" className="underline underline-offset-2">Model information</Link>.</p></div>
      </div>}
    </div>

    {prediction && <section className="gemini-card" aria-label="AI explanation"><div className="gemini-title"><span className="gemini-icon"><Sparkles size={20} /></span><div><h2>Understand your result</h2><p>An AI-generated explanation of your model estimate</p></div></div><p className="consent-intro">Your fictional inputs and model result will be sent to Google’s AI service when you request an explanation.</p><label className="consent-label"><input type="checkbox" checked={consent} onChange={event => onConsent(event.target.checked)} disabled={explaining} /><span>I confirm these inputs are fictional and agree to share them for an AI explanation.</span></label><button type="button" className="button primary explain-button" disabled={!consent || explaining} onClick={onExplain}>{explaining ? <LoaderCircle className="spin" size={18} /> : <Sparkles size={18} />}{explaining ? 'Preparing your explanation…' : 'Explain with AI'}</button>
      {error && <div className="inline-error mt-4" role="alert"><Info size={18} /><p>{explanationError} Your local model result is still available above.</p></div>}
      {explanation && <div className="explanation-content" aria-live="polite"><div className="explanation-section"><h3><Activity size={16} />What the model result means</h3><p>{explanation.meaning}</p></div><div className="explanation-section"><h3><Info size={16} />Supplied factors to discuss</h3><ul>{explanation.relevant_factors.map((factor, i) => <li key={i}>{factor}</li>)}</ul></div><div className="explanation-section"><h3><MessageCircleQuestion size={16} />Questions for a healthcare professional</h3><ul>{explanation.questions_for_professional.map((question, i) => <li key={i}>{question}</li>)}</ul></div><p className="explanation-note">The AI explanation provides context. The model’s probability and label stay unchanged.</p></div>}
    </section>}
    {!prediction && <div className="privacy-note"><LockKeyhole size={18} /><div><strong>You choose when to share.</strong><p>The estimate runs on the local model. An AI explanation is optional and requires your consent and a separate button click.</p></div></div>}
  </aside>
}
