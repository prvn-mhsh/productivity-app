
'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import {
  PieChart,
  BellRing,
  ClipboardList,
  FolderLock,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const features = [
  {
    icon: PieChart,
    title: 'Track Your Budget',
    description: 'Manage your expenses and savings with an intuitive budget tracker.',
  },
  {
    icon: BellRing,
    title: 'Set Smart Reminders',
    description: 'Never miss a deadline or an important event with smart reminders.',
  },
  {
    icon: ClipboardList,
    title: 'Organize Your Notes',
    description: 'Capture your thoughts and ideas in a flexible, OneNote-style notebook.',
  },
  {
    icon: FolderLock,
    title: 'Secure Your Documents',
    description: 'Keep your important documents safe and accessible, like a personal DigiLocker.',
  },
];

export function OnboardingCarousel() {
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);
  const router = useRouter();

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const isLastSlide = current === features.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      router.push('/signup');
    } else {
      api.scrollNext();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      <h1 className="text-3xl font-bold text-primary mb-2">
        Welcome to Productivity Assistant
      </h1>
      <p className="text-muted-foreground mb-8">
        Your all-in-one app for staying organized.
      </p>

      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {features.map((feature, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="border-0 shadow-none">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center aspect-square">
                    <feature.icon className="w-20 h-20 text-primary mb-6" />
                    <h3 className="text-2xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>

      <div className="flex space-x-2 my-4">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => api.scrollTo(index)}
            className={`w-2 h-2 rounded-full ${
              current === index ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
        <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push('/login')}
        >
            Skip
        </Button>
        <Button onClick={handleNext} className="w-full">
          {isLastSlide ? 'Get Started' : 'Next'}
        </Button>
      </div>

       <p className="text-center text-sm text-muted-foreground mt-8">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Log In
          </Link>
        </p>

    </div>
  );
}
