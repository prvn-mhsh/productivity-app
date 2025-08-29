
import { OnboardingCarousel } from '@/components/welcome/onboarding-carousel';

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <OnboardingCarousel />
    </div>
  );
}
