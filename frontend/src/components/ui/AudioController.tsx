"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export function AudioController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRefs = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Programmatic synthesizer: Starts an ambient drone chord
  const startSynthesizer = () => {
    if (typeof window === "undefined") return;

    // Initialize Web Audio Context
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    analyserRef.current = analyser;

    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0, ctx.currentTime);
    mainGain.connect(analyser);
    analyser.connect(ctx.destination);
    gainNodeRef.current = mainGain;

    // Frequencies for a beautiful minor 7th chord (C min 7: C3, G3, Bb3, Eb4)
    const frequencies = [130.81, 196.0, 233.08, 311.13];

    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = index === 0 ? "sawtooth" : "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Lowpass filter to keep it dark and ambient
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(index === 0 ? 150 : 250, ctx.currentTime);
      filter.Q.setValueAtTime(2, ctx.currentTime);

      oscGain.gain.setValueAtTime(0.08 / frequencies.length, ctx.currentTime);

      // LFO modulation to make the drone evolve and feel alive
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.1 + index * 0.05, ctx.currentTime);
      lfoGain.gain.setValueAtTime(10, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(mainGain);

      osc.start();
      oscillatorRefs.current.push(osc);
    });

    // Fade-in main gain smoothly
    mainGain.gain.linearRampToValueAtTime(0.65, ctx.currentTime + 2.0);
    setIsPlaying(true);
    startVisualizer();
  };

  const stopSynthesizer = () => {
    const mainGain = gainNodeRef.current;
    const ctx = audioCtxRef.current;

    if (mainGain && ctx) {
      mainGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      setTimeout(() => {
        oscillatorRefs.current.forEach((osc) => {
          try {
            osc.stop();
          } catch (e) {}
        });
        oscillatorRefs.current = [];
        ctx.close();
        audioCtxRef.current = null;
        gainNodeRef.current = null;
        analyserRef.current = null;
        setIsPlaying(false);
      }, 500);
    }
  };

  const handleToggle = () => {
    if (isPlaying) {
      stopSynthesizer();
    } else {
      startSynthesizer();
    }
  };

  // Play a soft high-tech hover click synth sound
  const playHoverSound = () => {
    const ctx = audioCtxRef.current;
    if (!ctx || !isPlaying) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    // Play a high frequency micro-tone
    osc.frequency.setValueAtTime(950 + Math.random() * 200, ctx.currentTime);

    filter.type = "highpass";
    filter.frequency.setValueAtTime(600, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  };

  // Simple Canvas Visualizer Loop
  const startVisualizer = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isPlaying) return;

      animationFrameIdRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = 3;
      const barGap = 2;
      const xOffset = 0;

      for (let i = 0; i < 4; i++) {
        // Map high frequencies/amplitude to visualizer bar heights
        const value = dataArray[i * 2] || 0;
        const height = (value / 255) * canvas.height * 0.8 + 2;

        ctx.fillStyle = isPlaying ? "rgba(200, 169, 110, 0.8)" : "rgba(255, 255, 255, 0.15)";
        ctx.fillRect(
          xOffset + i * (barWidth + barGap),
          canvas.height - height,
          barWidth,
          height
        );
      }
    };

    draw();
  };

  // Hook global hover sounds to links and buttons
  useEffect(() => {
    if (!isPlaying) return;

    const registerHoverSounds = () => {
      const targets = document.querySelectorAll("a, button, [role='button'], .magnetic-wrapper");
      targets.forEach((target) => {
        target.addEventListener("mouseenter", playHoverSound);
      });
    };

    registerHoverSounds();

    // Re-verify on page modifications/scroll transitions
    const observer = new MutationObserver(registerHoverSounds);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      const targets = document.querySelectorAll("a, button, [role='button'], .magnetic-wrapper");
      targets.forEach((target) => {
        target.removeEventListener("mouseenter", playHoverSound);
      });
    };
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      stopSynthesizer();
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "none",
      }}
    >
      <button
        onClick={handleToggle}
        aria-label={isPlaying ? "Mute soundtrack" : "Enable soundtrack"}
        style={{
          background: "transparent",
          border: "none",
          color: isPlaying ? "var(--accent-gold)" : "var(--text-muted)",
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          transition: "color 0.3s ease",
          cursor: "none",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: isPlaying ? "var(--accent-gold)" : "transparent",
            border: isPlaying ? "none" : "1px solid var(--text-muted)",
            display: "inline-block",
          }}
        />
        Sound
      </button>

      {/* Visualizer Lines */}
      <canvas
        ref={canvasRef}
        width="18"
        height="12"
        style={{
          width: "18px",
          height: "12px",
          opacity: isPlaying ? 1 : 0.25,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
}
