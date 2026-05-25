import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const revealSelector = [
  'main > section:not(:first-child) > .mx-auto',
  '.service-card:nth-child(-n + 9)',
  '.group.flex.h-full.flex-col',
  '.siau-schedule-card',
  '.pqrs-block',
  '.timeline-row',
  '.diferencial-card',
  '.area-head',
  '.area-service',
  '.santa-service',
  '.primary-carousel',
  '.pediatric-services',
].join(', ');

const heroSelector = [
  '.hero-home article > *',
  '.sede-hero article > *',
  '.sede-hero aside > *',
  '.santa-hero article > *',
  '.quienes-hero article > *',
  '.historia-hero article > *',
  '.historia-year-panel',
  '.pqrs-hero .mx-auto > *',
  '.policy-hero .mx-auto > *',
].join(', ');

let activeMotion: ReturnType<typeof gsap.matchMedia> | undefined;

const uniqueElements = (selector: string) => Array.from(new Set(document.querySelectorAll<HTMLElement>(selector)));

const initPageMotion = () => {
  activeMotion?.revert();
  activeMotion = gsap.matchMedia();

  activeMotion.add(
    {
      isDesktop: '(min-width: 768px)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { isDesktop, reduceMotion } = context.conditions as { isDesktop: boolean; reduceMotion: boolean };
      const heroElements = uniqueElements(heroSelector);
      const revealElements = uniqueElements(revealSelector).filter((element) => !heroElements.includes(element));

      if (reduceMotion) {
        gsap.set([...heroElements, ...revealElements], { clearProps: 'all' });
        return;
      }

      gsap.defaults({ duration: 0.75, ease: 'power3.out' });

      if (heroElements.length > 0) {
        gsap.fromTo(
          heroElements,
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.08,
            clearProps: 'transform,opacity,visibility',
          },
        );
      }

      revealElements.forEach((element, index) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 28, willChange: 'transform, opacity' },
          {
            autoAlpha: 1,
            y: 0,
            delay: index % (isDesktop ? 4 : 2) * 0.04,
            overwrite: true,
            clearProps: 'transform,opacity,visibility,willChange',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              once: true,
            },
          },
        );
      });

      if (isDesktop) {
        uniqueElements('.hero-home, .sede-hero, .santa-hero, .historia-hero, .quienes-hero').forEach((hero) => {
          const heroImage = hero.querySelector<HTMLElement>('img, .historia-image-rotator');

          if (!heroImage) return;

          gsap.to(heroImage, {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.8,
            },
          });
        });
      }
    },
  );
};

document.addEventListener('astro:page-load', initPageMotion);
initPageMotion();