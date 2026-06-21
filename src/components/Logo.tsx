import logoUrl from '../assets/dev2scale-logo.png'

/**
 * Dev2Scale wordmark. The source image sits on a pure-black field;
 * `.logo-blend` (mix-blend-mode: screen) drops that black into the dark UI.
 */
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <img
      src={logoUrl}
      alt="Dev2Scale"
      draggable={false}
      className={`logo-blend select-none ${className}`}
    />
  )
}
