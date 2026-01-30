import { RegistrationFlow } from '@/components/registration/RegistrationFlow';

export default function RegistrationPage() {
  return (
    <main>
      <RegistrationFlow 
          logoSrc="/images/logos/adph-2026-logo.png"
          date="MARCH 21, 2026"
          location="Insert University"
          description="Join us for the annual Arduino Day Philippines. Be part of the nationwide community of creators, students, and pros to share knowledge and showcase groundbreaking projects."
          brandName="Arduino"
      />
    </main>
  );
}
