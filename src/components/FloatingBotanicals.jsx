import { useEffect, useRef, useMemo } from 'react';

const LEAF_SHAPES = [
  /* Simple leaf */
  'M0,-12 C4,-10 6,-4 5,0 C4,4 2,8 0,12 C-2,8 -4,4 -5,0 C-6,-4 -4,-10 0,-12Z',
  /* Round leaf */
  'M0,-8 C5,-6 8,-2 7,2 C6,6 3,9 0,10 C-3,9 -6,6 -7,2 C-8,-2 -5,-6 0,-8Z',
  /* Narrow leaf */
  'M0,-14 C2,-10 3,-5 3,0 C3,5 2,10 0,14 C-2,10 -3,5 -3,0 C-3,-5 -2,-10 0,-14Z',
  /* Sprig */
  'M0,-10 C3,-7 4,-3 3,1 C2,5 1,8 0,10 C-1,8 -2,5 -3,1 C-4,-3 -3,-7 0,-10Z',
];

function createLeafConfig(index) {
  const layer = index % 3; // 0=bg, 1=mid, 2=fg
  const seed = index * 137.508;
  const rand = (min, max) => {
    const x = Math.sin(seed + min) * 10000;
    return min + (x - Math.floor(x)) * (max - min);
  };

  return {
    id: index,
    layer,
    x: rand(5, 95),
    y: rand(5, 95),
    size: layer === 0 ? rand(6, 10) : layer === 1 ? rand(8, 14) : rand(10, 18),
    opacity: layer === 0 ? rand(0.06, 0.12) : layer === 1 ? rand(0.08, 0.15) : rand(0.1, 0.2),
    rotation: rand(0, 360),
    duration: rand(15, 35),
    delay: rand(0, 10),
    drift: layer === 0 ? 1 : layer === 1 ? 2 : 3,
    shape: LEAF_SHAPES[index % LEAF_SHAPES.length],
    color: index % 5 === 0 ? '#8BC34A' : '#2D5A3D',
  };
}

export default function FloatingBotanicals() {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const leaves = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => createLeafConfig(i));
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      smoothMouseRef.current.x = lerp(smoothMouseRef.current.x, mouseRef.current.x, 0.05);
      smoothMouseRef.current.y = lerp(smoothMouseRef.current.y, mouseRef.current.y, 0.05);

      const leafEls = containerRef.current?.querySelectorAll('[data-leaf]');
      if (leafEls) {
        leafEls.forEach((el) => {
          const layer = parseInt(el.dataset.layer, 10);
          const parallaxRange = layer === 0 ? 3 : layer === 1 ? 6 : 10;
          const tx = smoothMouseRef.current.x * parallaxRange;
          const ty = smoothMouseRef.current.y * parallaxRange;
          el.style.transform = `translate(${tx}px, ${ty}px)`;
        });
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none z-[1]" aria-hidden="true">
        {leaves.slice(0, 6).map((leaf) => (
          <svg
            key={leaf.id}
            className="absolute"
            style={{
              left: `${leaf.x}%`,
              top: `${leaf.y}%`,
              width: leaf.size,
              height: leaf.size,
              opacity: leaf.opacity,
            }}
            viewBox="-10 -16 20 32"
            fill={leaf.color}
          >
            <path d={leaf.shape} />
          </svg>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          data-leaf
          data-layer={leaf.layer}
          className="absolute will-change-transform"
          style={{
            left: `${leaf.x}%`,
            top: `${leaf.y}%`,
          }}
        >
          <svg
            className="animate-float"
            style={{
              width: leaf.size,
              height: leaf.size,
              opacity: leaf.opacity,
              animationDuration: `${leaf.duration}s`,
              animationDelay: `${leaf.delay}s`,
              transform: `rotate(${leaf.rotation}deg)`,
            }}
            viewBox="-10 -16 20 32"
            fill={leaf.color}
          >
            <path d={leaf.shape} />
          </svg>
        </div>
      ))}
    </div>
  );
}
