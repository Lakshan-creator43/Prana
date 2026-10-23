import { useRef, useEffect, useState, useCallback } from 'react';
import { useScroll, useSpring, useTransform, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FRAME_COUNT = 229;
const frameSrc = (i) => `/images/prana/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;

/* ── Loading Screen ── */
function LoadingScreen({ progress, visible }) {
  if (!visible) return null;
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: visible ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Spinner */}
      <div className="relative w-16 h-16 mb-8">
        <svg className="w-16 h-16 animate-spin-slow" viewBox="0 0 64 64" fill="none">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="rgba(214,173,108,0.1)"
            strokeWidth="1.5"
          />
          <path
            d="M32 4 A28 28 0 0 1 60 32"
            stroke="#D6AD6C"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Gold progress bar */}
      <div className="w-48 h-px bg-white/5 rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full bg-prana-gold/60 rounded-full"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Percentage */}
      <p className="font-body text-sm text-white/30 tabular-nums">
        {Math.round(progress)}%
      </p>

      <p className="font-heading text-prana-ivory/30 text-lg mt-6 tracking-widest">
        PRANA
      </p>
    </motion.div>
  );
}

/* ── Mortar Fallback ── */
function MortarFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center" aria-label="Mortar illustration">
      <svg viewBox="0 0 300 300" className="w-64 h-64 opacity-40" fill="none">
        {/* Bowl */}
        <ellipse cx="150" cy="210" rx="90" ry="30" fill="#3d2b1a" />
        <path d="M60 180 Q60 240 150 240 Q240 240 240 180 L240 210 Q240 250 150 250 Q60 250 60 210Z" fill="#2a1d10" />
        <ellipse cx="150" cy="180" rx="90" ry="30" fill="#4a3622" />
        <ellipse cx="150" cy="180" rx="70" ry="22" fill="#1a1208" />
        {/* Pestle */}
        <rect x="162" y="100" width="14" height="90" rx="7" fill="#5a4a3a" transform="rotate(15 169 145)" />
        <ellipse cx="180" cy="96" rx="10" ry="8" fill="#6b5a48" transform="rotate(15 180 96)" />
        {/* Herbs */}
        <circle cx="140" cy="178" r="4" fill="#2D5A3D" opacity="0.6" />
        <circle cx="155" cy="175" r="3" fill="#3a7a4a" opacity="0.5" />
        <circle cx="160" cy="182" r="3.5" fill="#2D5A3D" opacity="0.4" />
        {/* Glow */}
        <ellipse cx="150" cy="200" rx="120" ry="40" fill="#D6AD6C" opacity="0.03" />
      </svg>
    </div>
  );
}

/* ── Text Beat ── */
function TextBeat({ progress, startP, endP, align, title, subtitle, children }) {
  const opacity = useTransform(
    progress,
    [startP, startP + 0.1, endP - 0.1, endP],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    progress,
    [startP, startP + 0.1, endP - 0.1, endP],
    [20, 0, 0, -20]
  );

  const alignment =
    align === 'left'
      ? 'items-start text-left left-[5%] sm:left-[8%] max-w-lg'
      : align === 'right'
      ? 'items-end text-right right-[5%] sm:right-[8%] max-w-lg'
      : 'items-center text-center left-1/2 -translate-x-1/2 max-w-2xl';

  return (
    <motion.div
      className={`absolute top-1/2 -translate-y-1/2 px-6 flex flex-col gap-3 ${alignment} pointer-events-none z-20`}
      style={{ opacity, y }}
    >
      <h2 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-prana-ivory tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="font-body text-sm sm:text-base text-white/40 max-w-md">
          {subtitle}
        </p>
      )}
      {children}
    </motion.div>
  );
}

/* ── Main HeroScroll ── */
export default function HeroScroll() {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [fallback, setFallback] = useState(false);

  const { scrollYProgress } = useScroll({ target: wrapperRef });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.0001,
  });

  /* Scroll-to-explore indicator opacity */
  const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);

  /* ── Preload Frames ── */
  useEffect(() => {
    let cancelled = false;
    const images = new Array(FRAME_COUNT);
    let loadedCount = 0;
    let hasError = false;

    const loadBatch = (start, end) => {
      return Promise.all(
        Array.from({ length: end - start }, (_, j) => {
          const idx = start + j;
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              images[idx] = img;
              loadedCount++;
              if (!cancelled) {
                setLoadProgress((loadedCount / FRAME_COUNT) * 100);
              }
              resolve();
            };
            img.onerror = () => {
              if (!hasError) {
                hasError = true;
                console.warn(
                  `[PRANA] Frame ${idx + 1} failed to load. Using fallback.`
                );
              }
              loadedCount++;
              if (!cancelled) {
                setLoadProgress((loadedCount / FRAME_COUNT) * 100);
              }
              resolve();
            };
            img.src = frameSrc(idx + 1);
          });
        })
      );
    };

    const preload = async () => {
      /* First 30 frames first */
      await loadBatch(0, Math.min(30, FRAME_COUNT));
      if (cancelled) return;

      /* Rest in batches of 30 */
      for (let s = 30; s < FRAME_COUNT; s += 30) {
        await loadBatch(s, Math.min(s + 30, FRAME_COUNT));
        if (cancelled) return;
      }

      imagesRef.current = images;

      /* Check if any frame loaded */
      const anyLoaded = images.some((img) => img);
      if (!anyLoaded) {
        setFallback(true);
      }

      if (!cancelled) {
        setTimeout(() => setLoaded(true), 300);
      }
    };

    preload();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ── Draw frames on canvas ── */
  useEffect(() => {
    if (!loaded || fallback) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const drawFrame = (index) => {
      const img = imagesRef.current[index];
      if (!img) return;

      const cw = canvas.width / dpr;
      const ch = canvas.height / dpr;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      /* Contain fit */
      const scale = Math.min(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    /* Draw first frame immediately */
    drawFrame(0);

    const unsubscribe = smoothProgress.on('change', (v) => {
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor((v / 0.85) * FRAME_COUNT)
      );
      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
      }
    });

    return () => {
      unsubscribe();
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loaded, fallback, smoothProgress]);

  /* ── Cleanup image refs on unmount ── */
  useEffect(() => {
    return () => {
      imagesRef.current = [];
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <LoadingScreen progress={loadProgress} visible={!loaded} />

      <div ref={wrapperRef} style={{ height: '350vh' }} className="relative">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Canvas or Fallback */}
          <div className="absolute inset-0 canvas-mask">
            {fallback ? (
              <MortarFallback />
            ) : (
              <canvas
                ref={canvasRef}
                className="w-full h-full"
                aria-hidden="true"
              />
            )}
          </div>

          {/* Edge Vignettes */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: `
                linear-gradient(to right, #050505 0%, transparent 15%, transparent 85%, #050505 100%),
                linear-gradient(to bottom, #050505 0%, transparent 12%, transparent 80%, #050505 100%)
              `,
            }}
          />

          {/* Left dark gradient for text readability */}
          <div
            className="absolute inset-y-0 left-0 w-[40%] pointer-events-none z-10"
            style={{
              background: 'linear-gradient(to right, rgba(5,5,5,0.7) 0%, transparent 100%)',
            }}
          />

          {/* Bottom dark gradient */}
          <div
            className="absolute inset-x-0 bottom-0 h-[30%] pointer-events-none z-10"
            style={{
              background: 'linear-gradient(to top, #050505 0%, transparent 100%)',
            }}
          />

          {/* Ambient glow behind mortar */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none z-[5]"
            style={{
              background: 'radial-gradient(circle, rgba(214,173,108,0.06) 0%, transparent 70%)',
            }}
          />

          {/* ── Text Beats ── */}
          <TextBeat
            progress={smoothProgress}
            startP={0}
            endP={0.2}
            align="center"
            title="Traditional Knowledge."
            subtitle="Every remedy comes with a receipt."
          />

          <TextBeat
            progress={smoothProgress}
            startP={0.25}
            endP={0.45}
            align="left"
            title="We don't invent remedies."
            subtitle="We find. We check. We cite."
          />

          <TextBeat
            progress={smoothProgress}
            startP={0.5}
            endP={0.7}
            align="right"
            title="Every claim has a source."
            subtitle="WHO. NCCIH. AYUSH. PubMed. Mayo Clinic."
          />

          <TextBeat
            progress={smoothProgress}
            startP={0.75}
            endP={0.95}
            align="center"
            title="Modern Trust."
            subtitle="Describe your symptoms. We'll show you the proof."
          />

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
            style={{ opacity: scrollIndicatorOpacity }}
          >
            <span className="font-body text-xs text-white/30 tracking-widest uppercase">
              Scroll to Explore
            </span>
            <ChevronDown size={16} className="text-white/20 animate-bounce" />
          </motion.div>
        </div>
      </div>
    </>
  );
}
