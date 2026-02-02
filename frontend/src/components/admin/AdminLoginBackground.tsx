import BokehBackground from "@/components/create-event/bokeh-background";
import Squares from "@/components/create-event/squares-background";

export default function AdminLoginBackground() {
  return (
    <>
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f14] via-[#0a1520] to-[#120c08]" />
      
      {/* Bokeh Background Effect */}
      <BokehBackground />
      
      {/* Grid Background */}
      <Squares direction="diagonal" speed={0.3} />
    </>
  );
}
