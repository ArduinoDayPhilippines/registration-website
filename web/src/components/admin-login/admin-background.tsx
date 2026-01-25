export default function AdminBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Large orange/yellow blur on left side */}
      <div className="absolute top-0 -left-1/4 w-[1000px] h-[1000px] bg-gradient-to-br from-yellow-500/60 via-orange-500/50 to-amber-600/40 rounded-full blur-[150px]" />
      
      {/* Large orange blur on bottom right */}
      <div className="absolute -bottom-40 -right-1/4 w-[1000px] h-[1000px] bg-gradient-to-tl from-orange-500/70 via-amber-500/50 to-yellow-600/40 rounded-full blur-[140px]" />
      
      {/* Teal accent blur top right */}
      <div className="absolute -top-40 right-1/4 w-[700px] h-[700px] bg-teal-500/40 rounded-full blur-[120px]" />
      
      {/* Additional amber glow center-left - animated */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-amber-400/30 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '4s' }} />
      
      {/* Additional orange glow bottom center */}
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-400/25 rounded-full blur-[100px]" />
      
      {/* Arduino Infinity Symbol Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
        <svg width="400" height="200" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M200 100C200 55.8172 227.386 20 261.538 20C295.69 20 323.077 55.8172 323.077 100C323.077 144.183 295.69 180 261.538 180C227.386 180 200 144.183 200 100Z" stroke="currentColor" strokeWidth="3" className="text-teal-500" />
          <path d="M200 100C200 144.183 172.614 180 138.462 180C104.31 180 76.9231 144.183 76.9231 100C76.9231 55.8172 104.31 20 138.462 20C172.614 20 200 55.8172 200 100Z" stroke="currentColor" strokeWidth="3" className="text-cyan-500" />
          <circle cx="150" cy="100" r="15" fill="currentColor" className="text-teal-400" />
          <circle cx="250" cy="100" r="15" fill="currentColor" className="text-cyan-400" />
        </svg>
      </div>
    </div>
  );
}
