export function Navbar() {
  return (
    <nav className="w-full p-6 md:px-12 flex items-center justify-between z-20 relative backdrop-blur-sm bg-black/20 sticky top-0 border-b border-white/5">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold font-morganite tracking-wide text-white">Arduino Day Philippines <span className="text-secondary">Dashboard</span> Example</h1>
      </div>
    </nav>
  );
}
