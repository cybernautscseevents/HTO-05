import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  variant?: 'default' | 'passport' | 'fade';
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  duration = 600,
  distance = 24,
  variant = 'default',
  className = '',
  style = {},
  as: Component = 'div',
}) => {
  const ref = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // Immediate reveal if user prefers reduced motion or if IntersectionObserver is not available
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsRevealed(true);
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setIsRevealed(true);
      return;
    }

    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            // Trigger once: unobserve as soon as it enters viewport
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const variantClass = variant === 'passport' 
    ? 'reveal-passport' 
    : 'reveal-on-scroll';

  const combinedStyles: React.CSSProperties = {
    ...style,
    ['--reveal-delay' as any]: `${delay}ms`,
    ['--reveal-duration' as any]: `${duration}ms`,
    ['--reveal-distance' as any]: `${distance}px`,
  };

  return (
    <Component
      ref={ref}
      style={combinedStyles}
      className={`${variantClass} ${isRevealed ? 'is-revealed' : ''} ${className}`}
    >
      {children}
    </Component>
  );
};

export default ScrollReveal;
