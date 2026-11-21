import { Activity, SlidersHorizontal, Sparkles } from 'lucide-react'

export function HeartIllustration() {
  return <div className="heart-visual" aria-label="Illustration of a heart with data points and a pulse line">
    <div className="visual-heading"><span className="tiny-dot" /> A LITTLE DATA. A CLEARER PICTURE.</div>
    <svg className="heart-svg" viewBox="0 0 600 440" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="heartFill" x1="180" y1="130" x2="420" y2="370" gradientUnits="userSpaceOnUse"><stop stopColor="#e1edff" /><stop offset="1" stopColor="#a3c5fc" /></linearGradient>
        <linearGradient id="heartEdge" x1="190" y1="80" x2="420" y2="350" gradientUnits="userSpaceOnUse"><stop stopColor="#9cbff5" /><stop offset="1" stopColor="#3e79db" /></linearGradient>
        <pattern id="visualGrid" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#aec8e9" opacity=".5" /></pattern>
      </defs>
      <rect width="600" height="440" fill="url(#visualGrid)" />
      <circle cx="310" cy="220" r="174" stroke="#cedff7" strokeDasharray="4 6" />
      <circle cx="310" cy="220" r="138" stroke="#dce8f9" strokeWidth="1.5" />
      <path d="M289 140C267 101 213 99 189 137C157 189 191 243 229 283C255 311 288 339 310 360C344 334 396 291 420 250C450 199 436 150 400 129C369 110 335 118 315 143L309 82C307 72 295 66 283 70L267 76L280 116" fill="url(#heartFill)" stroke="url(#heartEdge)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M304 141L318 101C323 88 337 81 348 88L358 95M324 151C334 137 347 131 360 132M291 157C266 183 259 203 265 231C273 261 298 290 310 338M292 179C316 183 338 194 351 215C365 241 360 277 341 308M269 216L239 229L220 249M280 259L251 272M352 217L383 207L404 213M358 251L386 258" stroke="#709fdf" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M37 226H139L161 208L180 242L205 167L230 281L250 226H335L358 213L377 237L394 226H561" stroke="white" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" opacity=".8" />
      <path d="M37 226H139L161 208L180 242L205 167L230 281L250 226H335L358 213L377 237L394 226H561" stroke="#2463eb" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="139" cy="226" r="5" fill="#2463eb" /><circle cx="394" cy="226" r="5" fill="#2463eb" />
      <path d="M217 125L161 88H105M387 296L439 330H497" stroke="#9ebde8" strokeWidth="1.5" /><circle cx="217" cy="125" r="4" fill="white" stroke="#6799db" /><circle cx="387" cy="296" r="4" fill="white" stroke="#6799db" />
      <circle cx="310" cy="46" r="5" fill="#6596e2" /><circle cx="472" cy="285" r="5" fill="#6596e2" />
    </svg>
    <div className="visual-tag tag-input"><SlidersHorizontal size={17} /><div><strong>18 inputs</strong><small>One risk profile</small></div></div>
    <div className="visual-tag tag-insight"><Sparkles size={18} /><div><strong>Understand the estimate</strong><small>Optional AI explanation</small></div></div>
    <div className="visual-foot"><Activity size={15} /> A model-based view, made understandable.<span>ILLUSTRATION</span></div>
  </div>
}
