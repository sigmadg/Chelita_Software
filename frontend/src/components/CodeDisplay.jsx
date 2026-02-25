import { useState } from 'react'
import './CodeDisplay.css'

export function CodeDisplay({ code }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: no clipboard API
    }
  }

  return (
    <div className="code-display" role="region" aria-label="Código del documento">
      <code className="code-display__value">{code}</code>
      <button
        type="button"
        className="code-display__copy"
        onClick={handleCopy}
        title="Copiar código"
        aria-label={copied ? 'Copiado' : 'Copiar código'}
      >
        {copied ? '✓ Copiado' : 'Copiar'}
      </button>
    </div>
  )
}
