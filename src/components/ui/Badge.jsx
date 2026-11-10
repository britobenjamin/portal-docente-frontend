const VARIANTES = {
  solid: 'bg-primary text-ink',
  soft: 'bg-primary-light text-ink border border-primary/50',
  outline: 'bg-white text-ink border border-primary/40',
  muted: 'bg-neutral-100 text-ink/70',
};

export default function Badge({ children, variant = 'outline', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5 ${VARIANTES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
