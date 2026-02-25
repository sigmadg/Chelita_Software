import './Button.css'

export function Button({ children, type = 'button', disabled, loading, variant = 'primary', ...props }) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`btn btn--${variant}`}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="btn__spinner" aria-hidden="true" />
          <span className="btn__text">Procesando...</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
