export default function AdminHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center mb-4">
        <img 
          src="/images/logos/adph-logo.png" 
          alt="Arduino Day Philippines" 
          className="h-16 w-auto drop-shadow-[0_0_15px_rgba(20,184,166,0.3)]"
        />
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
      <p className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-orange-300 text-sm uppercase tracking-wider">
        Arduino Day Philippines 2026
      </p>
    </div>
  );
}
