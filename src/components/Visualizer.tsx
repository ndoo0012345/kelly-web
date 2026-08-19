import React, { useEffect, useRef } from 'react';
import { musicPlayer } from '../music/music-player';

interface VisualizerProps {
  isPlaying: boolean;
  barCount?: number;
  className?: string;
  color?: string;
}

export const Visualizer: React.FC<VisualizerProps> = ({
  isPlaying,
  barCount = 16,
  className = '',
  color = '#7C93C4'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const freqData = musicPlayer.getFrequencyData();
      const hasRealAudio = freqData.some((v) => v > 0);

      const barWidth = (width / barCount) - 2;
      phase += 0.08;

      for (let i = 0; i < barCount; i++) {
        let barHeight = 4;

        if (isPlaying) {
          if (hasRealAudio) {
            const dataIndex = Math.floor((i / barCount) * (freqData.length / 2));
            const val = freqData[dataIndex] || 0;
            barHeight = Math.max(4, (val / 255) * height);
          } else {
            // Pleasant rhythmic fallback animation while audio plays
            const wave = Math.sin(phase + i * 0.4) * 0.4 + 0.6;
            const variance = Math.cos(phase * 0.7 + i * 0.2) * 0.3 + 0.5;
            barHeight = Math.max(4, wave * variance * (height * 0.85));
          }
        } else {
          barHeight = 4;
        }

        const x = i * (barWidth + 2);
        const y = height - barHeight;

        // Rounded bar
        ctx.fillStyle = color;
        ctx.beginPath();
        const radius = Math.min(barWidth / 2, 2);
        ctx.roundRect(x, y, barWidth, barHeight, [radius, radius, 0, 0]);
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, barCount, color]);

  return (
    <canvas
      ref={canvasRef}
      width={barCount * 8}
      height={32}
      className={`block ${className}`}
      aria-label="Audio Visualizer"
    />
  );
};
