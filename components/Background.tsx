export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base */}
      <div className="absolute inset-0 bg-midnight" />
      {/* grid */}
      <div className="absolute inset-0 bg-grid-glow [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      {/* glow blobs */}
      <div className="absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-teal-glow/20 blur-[140px] animate-pulse-slow" />
      <div className="absolute top-1/3 -left-32 h-[400px] w-[400px] rounded-full bg-cyan-glow/15 blur-[150px] animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-[150px]" />
    </div>
  );
}
