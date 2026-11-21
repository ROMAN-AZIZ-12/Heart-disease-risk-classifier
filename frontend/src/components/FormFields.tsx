import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { numericFields } from '../lib/profile'
import type { BinaryKey, FormValues, NumericKey } from '../lib/profile'

export type ChangeValue = (name: keyof FormValues, value: string | boolean) => void

export function NumberField({ name, value, onChange, error }: { name: NumericKey; value: string; onChange: ChangeValue; error?: string }) {
  const field = numericFields[name]
  return <div className="field"><label htmlFor={name}>{field.label}</label><div className="input-wrap"><input id={name} name={name} type="number" required min={field.min} max={field.max} step={field.step} value={value} onChange={event => onChange(name, event.target.value)} aria-invalid={!!error} aria-describedby={`${name}-hint`} /><span className="input-unit">{field.unit}</span></div><small id={`${name}-hint`} className={error ? 'field-error' : ''}>{error || `${field.min}–${field.max}${name === 'stress_level' ? ' · 1 = lowest, 10 = highest' : ''}`}</small></div>
}

export function SelectField({ name, label, value, options, onChange, error }: { name: keyof FormValues; label: string; value: string; options: string[]; onChange: ChangeValue; error?: string }) {
  return <div className="field"><label htmlFor={name}>{label}</label><div className="select-wrap"><select id={name} name={name} value={value} onChange={event => onChange(name, event.target.value)} aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined}>{options.map(option => <option key={option}>{option}</option>)}</select><ChevronDown size={16} aria-hidden="true" /></div>{error && <small className="field-error" id={`${name}-error`}>{error}</small>}</div>
}

export function BinaryField({ name, label, value, onChange }: { name: BinaryKey; label: string; value: boolean; onChange: ChangeValue }) {
  return <fieldset className="binary-field"><legend>{label}</legend><div className="binary-options">{[false, true].map(option => <label key={String(option)} className={value === option ? 'selected' : ''}><input type="radio" name={name} value={String(option)} checked={value === option} onChange={() => onChange(name, option)} /><span>{option ? 'Yes' : 'No'}</span></label>)}</div></fieldset>
}

export function FormSection({ number, title, description, icon, children, columns = 2 }: { number: string; title: string; description: string; icon: ReactNode; children: ReactNode; columns?: 2 | 3 }) {
  return <section className="form-section" aria-labelledby={`section-${number}`}><div className="form-section-heading"><span className="section-icon">{icon}</span><div><h2 id={`section-${number}`}>{title}</h2><p>{description}</p></div><span className="section-count">{number}</span></div><div className={`form-grid cols-${columns}`}>{children}</div></section>
}
