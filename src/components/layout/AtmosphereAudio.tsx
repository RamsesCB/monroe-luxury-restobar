"use client";

import React, { useEffect, useRef } from "react";
import { Volume2, VolumeX, Radio } from "lucide-react";

interface AtmosphereAudioProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export function AtmosphereAudio({ isPlaying, onToggle }: AtmosphereAudioProps) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  useEffect(() => {
    if (isPlaying) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;

        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.04, ctx.currentTime);
        masterGain.connect(ctx.destination);
        gainNodeRef.current = masterGain;

        // Warm chord frequencies for luxury restobar mood (Fmaj9 / Dm7 warm pad)
        const freqs = [174.61, 220.0, 261.63, 329.63, 392.0];
        const oscs: OscillatorNode[] = [];

        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(350 + idx * 80, ctx.currentTime);

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          // Subtle detune for lush organic feel
          osc.detune.setValueAtTime((idx - 2) * 4, ctx.currentTime);

          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(0.15 + idx * 0.05, ctx.currentTime);
          lfoGain.gain.setValueAtTime(2, ctx.currentTime);
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          lfo.start();

          osc.connect(filter);
          filter.connect(masterGain);
          osc.start();
          oscs.push(osc);
        });

        oscillatorsRef.current = oscs;
      } catch (err) {
        console.warn("Web Audio ambient init error:", err);
      }
    } else {
      if (audioCtxRef.current) {
        try {
          oscillatorsRef.current.forEach((osc) => {
            try {
              osc.stop();
              osc.disconnect();
            } catch {}
          });
          audioCtxRef.current.close();
        } catch {}
        audioCtxRef.current = null;
        oscillatorsRef.current = [];
      }
    }

    return () => {
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, [isPlaying]);

  return (
    <div className="fixed bottom-6 left-6 z-30 hidden sm:flex items-center gap-2 bg-obsidian-950/80 backdrop-blur-xl border border-white/10 hover:border-gold-500/40 px-3.5 py-2 rounded-full shadow-2xl transition-all">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 text-xs font-medium text-platinum hover:text-gold-300"
      >
        {isPlaying ? (
          <>
            <Radio className="w-3.5 h-3.5 text-gold-400 animate-spin" style={{ animationDuration: "6s" }} />
            <span className="text-[11px] text-gold-300">Atmósfera Sonora Activa</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-platinum/60" />
            <span className="text-[11px]">Activar Atmósfera Lounge</span>
          </>
        )}
      </button>
    </div>
  );
}
