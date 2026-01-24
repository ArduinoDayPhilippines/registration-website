import Image from "next/image";

export default function Home() {
  return (
    <div>
      <main className="flex flex-col items-center p-24">
        <h1 className="text-primary font-morganite text-5xl mb-8 text-center">
          Welcome to Our ADPH App, Read README.md to get started!
        </h1>
        <Image
          src="/images/logos/adph-logo.png"
          alt="ADPH Logo"
          width={100}
          height={100}
        />
      </main>
    </div>
  );
}