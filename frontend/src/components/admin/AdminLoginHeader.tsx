import Image from 'next/image';

export default function AdminLoginHeader() {
  return (
    <div className="text-center mb-10 space-y-3">
      <div className="inline-block mb-4">
        <Image
          src="/images/logos/adph-logo.png"
          alt="Arduino Day Philippines"
          width={96}
          height={96}
          className="opacity-95"
        />
      </div>
      <h1 className="text-[56px] font-bold text-[#f5f5f5] tracking-tight leading-none">
        Admin Portal
      </h1>
      <p className="text-[#5dd8d8] text-[11px] tracking-[0.3em] uppercase font-semibold">
        Arduino Day Philippines 2026
      </p>
    </div>
  );
}
