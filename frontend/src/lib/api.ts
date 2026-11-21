import type { Explanation, Prediction, Profile } from './profile'

export class ApiError extends Error {
  fields: Record<string, string>
  constructor(message: string, fields: Record<string, string> = {}) { super(message); this.fields = fields }
}

async function post<T>(path: string, data: unknown, signal: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(`/api/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal })
  } catch (error) {
    if (signal.aborted) throw error
    throw new ApiError('We could not connect. Check that the backend is running, then try again.')
  }
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    if (Array.isArray(body?.detail)) {
      const fields: Record<string, string> = {}
      for (const item of body.detail) fields[item.loc.at(-1)] = item.msg
      throw new ApiError('Please check the highlighted values and try again.', fields)
    }
    throw new ApiError(typeof body?.detail === 'string' ? body.detail : 'The service is unavailable. Please try again shortly.')
  }
  if (!body) throw new ApiError('The service returned an empty response. Please try again.')
  return body as T
}

export const requestPrediction = (inputs: Profile, signal: AbortSignal) => post<Prediction>('predict', inputs, signal)
export const requestExplanation = (inputs: Profile, consent: boolean, signal: AbortSignal) => post<Explanation>('explain', { inputs, consent }, signal)
