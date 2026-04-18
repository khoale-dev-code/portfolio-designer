import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function HLSVideo({
  src,
  poster = "",
  className = "",
  desaturate = false,
  objectFit = "cover",
  /* Cinematic extras */
  burnIn = false,        // film burn overlay khi fade in
  scanlines = false,     // CRT scanline texture
  vignetteStrength = 0,  // 0 = tắt, 0.5 = nhẹ, 1 = mạnh
}) {
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hlsInstance = null;

    const onWaiting  = () => setIsBuffering(true);
    const onPlaying  = () => setIsBuffering(false);
    const onError    = () => setHasError(true);

    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("error",   onError);

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else {
      import("hls.js").then(({ default: Hls }) => {
        if (!Hls.isSupported()) return;

        hlsInstance = new Hls({
          startLevel:          -1,   // auto ABR
          capLevelToPlayerSize: true, // no wasted 4K on FHD screen
          maxMaxBufferLength:   30,
          lowLatencyMode:       false,
          enableWorker:         true,
        });

        hlsInstance.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) setHasError(true);
        });

        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
      });
    }

    return () => {
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error",   onError);

      if (hlsInstance) {
        hlsInstance.destroy();
      } else {
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [src]);

  return (
    <div className={`relative w-full h-full ${className}`}>

      {/* ── Video element ── */}
      <motion.video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        poster={poster}
        onCanPlay={() => setIsReady(true)}
        initial={{ opacity: 0, filter: "blur(14px) saturate(0.4)" }}
        animate={{
          opacity: isReady ? 1 : 0,
          filter: isReady
            ? `blur(0px) saturate(${desaturate ? 0 : 1.1})`
            : "blur(14px) saturate(0.4)",
        }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute inset-0 w-full h-full object-${objectFit} ${
          desaturate ? "grayscale" : ""
        }`}
      />

      {/* ── Film burn — warm flash on fade-in ── */}
      {burnIn && (
        <AnimatePresence>
          {!isReady && (
            <motion.div
              key="burn"
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 40%, rgba(255,200,100,0.18) 0%, transparent 70%)",
              }}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
      )}

      {/* ── Scanlines ── */}
      {scanlines && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.018) 3px, rgba(255,255,255,0.018) 4px)",
            opacity: isReady ? 1 : 0,
            transition: "opacity 1s ease",
          }}
        />
      )}

      {/* ── Vignette ── */}
      {vignetteStrength > 0 && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,${
              vignetteStrength * 0.8
            }) 100%)`,
            opacity: isReady ? 1 : 0,
            transition: "opacity 1.5s ease",
          }}
        />
      )}

      {/* ── Buffering pulse ── */}
      <AnimatePresence>
        {isBuffering && isReady && (
          <motion.div
            key="buffering"
            className="absolute inset-0 pointer-events-none z-20"
            style={{ background: "rgba(0,0,0,0.04)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}
      </AnimatePresence>

      {/* ── Error fallback (invisible but accessible) ── */}
      {hasError && poster && (
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}
    </div>
  );
}