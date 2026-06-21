/**
 * Ambient backdrop: pure-black field with soft, slowly drifting brand glows
 * (orange + blue) and a faint grid — echoes the glow of the Dev2Scale logo.
 */
export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* Orange glow, lower-left */}
      <div
        className="glow-a absolute -left-32 top-1/3 h-[36rem] w-[36rem] rounded-full blur-[120px]"
        style={{
          background:
            'radial-gradient(circle at center, rgba(255,106,0,0.40), rgba(255,138,43,0.10) 45%, transparent 70%)',
        }}
      />
      {/* Blue glow, upper-right */}
      <div
        className="glow-b absolute -right-24 -top-24 h-[40rem] w-[40rem] rounded-full blur-[130px]"
        style={{
          background:
            'radial-gradient(circle at center, rgba(46,144,255,0.42), rgba(19,102,230,0.12) 45%, transparent 70%)',
        }}
      />
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 78%)',
        }}
      />
      {/* Vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  )
}
