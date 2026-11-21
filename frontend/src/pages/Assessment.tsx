import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowLeft, ArrowRight, ClipboardList, FlaskConical, HeartPulse, Info, LoaderCircle, RotateCcw, UserRound } from 'lucide-react'
import { BinaryField, FormSection, NumberField, SelectField } from '../components/FormFields'
import { ResultsPanel } from '../components/ResultsPanel'
import { ApiError, requestExplanation, requestPrediction } from '../lib/api'
import { defaults, toProfile } from '../lib/profile'
import type { BinaryKey, Explanation, FormValues, NumericKey, Prediction, Profile } from '../lib/profile'

export function Assessment() {
  const [values, setValues] = useState<FormValues>({ ...defaults })
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [snapshot, setSnapshot] = useState<Profile | null>(null)
  const [explanation, setExplanation] = useState<Explanation | null>(null)
  const [consent, setConsent] = useState(false)
  const [predicting, setPredicting] = useState(false)
  const [explaining, setExplaining] = useState(false)
  const [error, setError] = useState('')
  const [explainError, setExplainError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const activeRequest = useRef<AbortController | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  useEffect(() => () => activeRequest.current?.abort(), [])

  function clearResult() {
    activeRequest.current?.abort()
    activeRequest.current = null
    setPrediction(null); setSnapshot(null); setExplanation(null); setConsent(false)
    setPredicting(false); setExplaining(false); setError(''); setExplainError(''); setFieldErrors({})
  }

  function change(name: keyof FormValues, value: string | boolean) {
    clearResult()
    setValues(previous => ({ ...previous, [name]: value }))
  }

  async function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (activeRequest.current) return
    clearResult()
    const controller = new AbortController()
    activeRequest.current = controller
    setPredicting(true)
    const inputs = toProfile(values)
    try {
      const result = await requestPrediction(inputs, controller.signal)
      if (controller.signal.aborted) return
      setPrediction(result); setSnapshot(inputs)
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      resultsRef.current?.scrollIntoView({ behavior, block: 'start' })
    } catch (caught) {
      if (!controller.signal.aborted) {
        setError(caught instanceof Error ? caught.message : 'Something went wrong. Please try again.')
        if (caught instanceof ApiError) setFieldErrors(caught.fields)
      }
    } finally {
      if (activeRequest.current === controller) { activeRequest.current = null; setPredicting(false) }
    }
  }

  async function explain() {
    if (!snapshot || !consent || activeRequest.current) return
    const controller = new AbortController()
    activeRequest.current = controller
    setExplaining(true); setExplainError(''); setExplanation(null)
    try {
      const result = await requestExplanation(snapshot, consent, controller.signal)
      if (!controller.signal.aborted) setExplanation(result)
    } catch (caught) {
      if (!controller.signal.aborted) setExplainError(caught instanceof Error ? caught.message : 'AI explanation is unavailable. Please try again later.')
    } finally {
      if (activeRequest.current === controller) { activeRequest.current = null; setExplaining(false) }
    }
  }

  const number = (name: NumericKey) => <NumberField key={name} name={name} value={values[name]} onChange={change} error={fieldErrors[name]} />
  const binary = (name: BinaryKey, label: string) => <BinaryField name={name} label={label} value={values[name]} onChange={change} />

  return <main id="main" className="assessment-page"><div className="page-shell">
    <Link to="/" className="back-link"><ArrowLeft size={16} />Back to overview</Link>
    <div className="assessment-heading"><div><p className="eyebrow">YOUR RISK PROFILE</p><h1>Explore your heart-risk profile.</h1><p>Review the example values or adjust the inputs to explore the model’s estimate.</p></div><span className="assessment-badge"><FlaskConical size={16} />18-input assessment</span></div>
    <div className="demo-banner"><Info size={18} /><p><strong>Use fictional values only.</strong></p></div>
    <div className="assessment-grid">
      <form onSubmit={calculate} className="assessment-form">
        <FormSection number="01" title="Personal details" description="The basics of your profile." icon={<UserRound size={20} />} columns={3}>
          {number('age')}<SelectField name="sex" label="Sex" value={values.sex} options={['Female', 'Male']} onChange={change} error={fieldErrors.sex} />{number('bmi')}
        </FormSection>
        <FormSection number="02" title="Lifestyle" description="Everyday patterns represented in the dataset." icon={<Activity size={20} />} columns={3}>
          <SelectField name="smoking_status" label="Smoking status" value={values.smoking_status} options={['Never', 'Former', 'Current']} onChange={change} error={fieldErrors.smoking_status} />{number('sleep_hours')}{number('stress_level')}
        </FormSection>
        <FormSection number="03" title="Medical history" description="Select the conditions represented in the profile." icon={<ClipboardList size={20} />}>
          {binary('diabetes', 'Diabetes')}{binary('hypertension', 'Hypertension')}{binary('family_history', 'Family history of heart disease')}{binary('previous_heart_event', 'Previous heart attack or procedure')}
        </FormSection>
        <FormSection number="04" title="Clinical values" description="Enter the clinical values represented in the profile." icon={<HeartPulse size={20} />}>
          {number('resting_bp')}{number('cholesterol')}{number('max_heart_rate')}
          <SelectField name="resting_ecg" label="Resting ECG" value={values.resting_ecg} options={['Normal', 'ST-T Abnormality', 'Left Ventricular Hypertrophy']} onChange={change} error={fieldErrors.resting_ecg} />
          {number('st_depression')}<SelectField name="st_slope" label="ST slope" value={values.st_slope} options={['Upsloping', 'Flat', 'Downsloping']} onChange={change} error={fieldErrors.st_slope} />
          {number('hrv_score')}{binary('exercise_angina', 'Chest pain during exercise')}
        </FormSection>
        <div className="form-actions">{error && <div className="inline-error" role="alert"><Info size={18} /><p>{error}</p></div>}<div className="action-row"><button type="button" className="reset-button" onClick={() => { clearResult(); setValues({ ...defaults }) }}><RotateCcw size={16} />Reset values</button><button className="button primary large" type="submit" disabled={predicting || explaining}>{predicting ? <><LoaderCircle size={18} className="spin" />Calculating…</> : <>Calculate estimate<ArrowRight size={18} /></>}</button></div><p>The estimate uses all 18 inputs. Derived features are calculated automatically.</p></div>
      </form>
      <div ref={resultsRef} className="results-anchor"><ResultsPanel prediction={prediction} explanation={explanation} predicting={predicting} explaining={explaining} consent={consent} error={explainError} onConsent={setConsent} onExplain={explain} /></div>
    </div>
  </div></main>
}
