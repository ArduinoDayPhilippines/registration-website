export default function AdminLoginBackground() {
  return (
    <>
      {/* Layer 1: Dark teal base - Strong foundation */}
      <div className="absolute inset-0 bg-[#0d2828]" />
      
      {/* Layer 2: Large amber glow from left - Side spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_160%_100%_at_-20%_50%,_#d4a145_0%,_#b8884d_10%,_#9d7240_20%,_transparent_45%)]" />
      
      {/* Layer 3: Large amber glow from right - Side spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_160%_100%_at_120%_50%,_#d4a145_0%,_#b8884d_10%,_#9d7240_20%,_transparent_45%)]" />
      
      {/* Layer 4: Strong teal center reinforcement - Preserves center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0d2828_0%,_#0d2828_15%,_transparent_45%)]" />
      
      {/* Layer 5: Bottom warm wash - Adds depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#8b6940]/20 via-transparent to-transparent" />
      
      {/* Layer 6: Edge vignette - Darkens corners */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_transparent_40%,_rgba(0,0,0,0.3)_100%)]" />
    </>
  );
}
