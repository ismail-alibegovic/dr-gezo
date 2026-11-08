'use client';

import {Children, useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode} from 'react';
import {ChevronLeft, ChevronRight, ArrowRight} from 'lucide-react';

type Props = {
  id: string;
  title: ReactNode;
  intro?: ReactNode;
  label: string;
  kind: 'services' | 'doctors' | 'gallery';
  children: ReactNode;
};

export default function Carousel({id, title, intro, label, kind, children}: Props) {
  const track = useRef<HTMLDivElement>(null);
  const total = Children.count(children);
  const [position, setPosition] = useState({first: 1, last: 1, previous: false, next: true, progress: 0});

  const measure = useCallback(() => {
    const el = track.current;
    const item = el?.firstElementChild as HTMLElement | null;
    if (!el || !item) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = item.getBoundingClientRect().width + gap;
    const maximum = Math.max(0, el.scrollWidth - el.clientWidth);
    const visible = Math.max(1, Math.floor((el.clientWidth + gap + 1) / step));
    const first = Math.min(total, Math.round(el.scrollLeft / step) + 1);
    setPosition({
      first,
      last: Math.min(total, first + visible - 1),
      previous: el.scrollLeft > 3,
      next: el.scrollLeft < maximum - 3,
      progress: maximum > 0 ? el.scrollLeft / maximum : 1,
    });
  }, [total]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const update = () => {cancelAnimationFrame(frame); frame = requestAnimationFrame(measure);};
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener('scroll', update, {passive: true});
    measure();
    return () => {observer.disconnect(); el.removeEventListener('scroll', update); cancelAnimationFrame(frame);};
  }, [measure]);


  useEffect(() => {
    const el = track.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      Array.from(el.children).forEach((card, index) => {
        animations.push(card.animate(
          [{opacity: 0, transform: 'translateY(10px)'}, {opacity: 1, transform: 'none'}],
          {duration: 1000, delay: Math.min(index, 4) * 110, easing: 'cubic-bezier(.25,.46,.45,.94)', fill: 'backwards'},
        ));
      });
    }, {threshold: .2});
    observer.observe(el);
    return () => {observer.disconnect(); animations.forEach(animation => animation.cancel());};
  }, []);

  function move(direction: number) {
    const el = track.current;
    const item = el?.firstElementChild as HTMLElement | null;
    if (!el || !item) return;
    const step = item.getBoundingClientRect().width + (parseFloat(getComputedStyle(el).columnGap) || 0);
    const destination = (Math.round(el.scrollLeft / step) + direction) * step;
    el.scrollTo({left: destination, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      track.current?.scrollTo({left: event.key === 'Home' ? 0 : track.current.scrollWidth, behavior: 'instant'});
    }
  }

  return (
    <section className={`section carousel-section ${kind}-section`} id={id} aria-labelledby={`${id}-title`}>
      <div className="section-heading">
        <div className="heading-group"><h2 id={`${id}-title`}>{title}</h2>{intro ? <p className="intro">{intro}</p> : null}</div>
        <div className="carousel-navigation">
          <span className="carousel-count" aria-hidden="true">{String(position.first).padStart(2, '0')}<span>—{String(position.last).padStart(2, '0')} / {String(total).padStart(2, '0')}</span></span>
          <div className="arrows">
            <button type="button" aria-label={`Prethodno — ${label}`} aria-controls={`${id}-track`} disabled={!position.previous} onClick={() => move(-1)}><ChevronLeft size={15} strokeWidth={1.5}/></button>
            <button type="button" aria-label={`Sljedeće — ${label}`} aria-controls={`${id}-track`} disabled={!position.next} onClick={() => move(1)}><ChevronRight size={15} strokeWidth={1.5}/></button>
          </div>
        </div>
      </div>
      <p className="sr-only" id={`${id}-instructions`}>Koristite strelice za pregled ili prevucite prstom. Na tastaturi koristite lijevu i desnu strelicu, Home i End.</p>
      <div className={`carousel-track ${kind}-track`} id={`${id}-track`} ref={track} tabIndex={0} role="group" aria-roledescription="karusel" aria-label={label} aria-describedby={`${id}-instructions`} onKeyDown={onKeyDown}>{children}</div>
      <div className="carousel-bottom">
        <div className="carousel-meter" aria-hidden="true"><span style={{left: `${position.progress * 68}%`}}/></div>
        <span className="swipe-hint">Prevucite za više <ArrowRight size={13}/></span>
      </div>
      <span className="sr-only" aria-live="polite" aria-atomic="true">Prikazane stavke {position.first} do {position.last} od {total}.</span>
    </section>
  );
}
