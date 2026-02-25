import './FormField.css'

export function FormField({ id, label, type = 'text', value, onChange, placeholder, required, maxLength, error, inputMode }) {
  return (
    <div className={`form-group ${error ? 'form-group--error' : ''}`}>
      <label htmlFor={id} className="form-group__label">
        {label}
        {required && <span className="form-group__required" aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        inputMode={inputMode}
        className="form-group__input"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="form-group__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
