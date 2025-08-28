export function Spinner() {
  return <div style={{ padding: 8 }}>Loading…</div>
}

export function ErrorMessage({ message }) {
  if (!message) return null
  return <div style={{ color: 'red', padding: 8 }}>{message}</div>
}

export function Stars({ value = 0, onChange, size = 20 }) {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange?.(n)}
          style={{
            cursor: 'pointer',
            color: n <= value ? '#f5a623' : '#bbb',
            background: 'transparent',
            border: 'none',
            fontSize: size,
          }}
          aria-label={`${n} star`}
        >
          ★
        </button>
      ))}
    </div>
  )
}


