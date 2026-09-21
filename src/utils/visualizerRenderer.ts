/**
 * Canvas drawing algorithms for real-time visual equalizer effects
 */

import { EqualizerConfig, AudioReactiveVideoFx } from '../types';
import { audioEngine } from '../audio/audioEngine';
import { AudioReactiveVideoMetrics } from './slideRenderer';

export function renderEqualizer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: EqualizerConfig,
  bassEnergy: number
) {
  if (!config.enabled) return;

  const freqData = audioEngine.getFrequencyData();
  const timeData = audioEngine.getTimeDomainData();

  ctx.save();

  // Beat pulse effect (subtle scale expansion on heavy bass)
  if (config.beatPulse && bassEnergy > 0.4) {
    const scale = 1 + (bassEnergy - 0.4) * 0.08;
    ctx.translate(width / 2, height / 2);
    ctx.scale(scale, scale);
    ctx.translate(-width / 2, -height / 2);
  }

  // Setup glow effect
  if (config.glow) {
    ctx.shadowBlur = 14;
    ctx.shadowColor = getGlowColor(config.theme, config.customColor1);
  } else {
    ctx.shadowBlur = 0;
  }

  const rotationAngle = (performance.now() * 0.001 * 0.8) % (Math.PI * 2);

  switch (config.style) {
    case 'bars':
      renderBarSpectrum(ctx, width, height, config, freqData);
      break;
    case 'waveform':
      renderWaveform(ctx, width, height, config, timeData);
      break;
    case 'circular':
      renderCircularVisualizer(ctx, width, height, config, freqData, bassEnergy, rotationAngle);
      break;
    case 'circular-liquid':
      renderCircularLiquidVisualizer(ctx, width, height, config, freqData, bassEnergy, rotationAngle);
      break;
    case 'liquid-wave':
      renderLiquidWaveVisualizer(ctx, width, height, config, freqData, timeData, bassEnergy);
      break;
    case 'circular-bars':
      renderCircularBars(ctx, width, height, config, freqData, bassEnergy, rotationAngle);
      break;
    case 'circular-neon-ring':
      renderCircularNeonRing(ctx, width, height, config, freqData, bassEnergy, rotationAngle);
      break;
    case 'vinyl-disc':
      renderVinylDisc(ctx, width, height, config, freqData, bassEnergy, rotationAngle);
      break;
    case 'particle-orbit':
      renderParticleOrbit(ctx, width, height, config, freqData, bassEnergy, rotationAngle);
      break;
    case 'cyber-radial':
      renderCyberRadial(ctx, width, height, config, freqData, bassEnergy, rotationAngle);
      break;
    case 'matrix-rain':
      renderMatrixRainVisualizer(ctx, width, height, config, freqData, bassEnergy);
      break;
    case 'audio-tunnel':
      renderAudioTunnelVisualizer(ctx, width, height, config, freqData, bassEnergy, rotationAngle);
      break;
    case 'laser-prism':
      renderLaserPrismVisualizer(ctx, width, height, config, freqData, bassEnergy, rotationAngle);
      break;
    case 'galaxy-spiral':
      renderGalaxySpiralVisualizer(ctx, width, height, config, freqData, bassEnergy, rotationAngle);
      break;
    case 'starburst':
      renderStarburstVisualizer(ctx, width, height, config, freqData, bassEnergy, rotationAngle);
      break;
    case 'frequency-mesh':
      renderFrequencyMeshVisualizer(ctx, width, height, config, freqData, bassEnergy);
      break;
    case 'mirror':
      renderMirroredSpectrum(ctx, width, height, config, freqData);
      break;
    case 'dots':
      renderDotMatrix(ctx, width, height, config, freqData);
      break;
  }

  ctx.restore();
}

export function getGlowColor(theme: string, customColor?: string): string {
  if (theme === 'custom' && customColor) {
    return customColor;
  }
  switch (theme) {
    case 'cyan-neon':
      return 'rgba(6, 182, 212, 0.85)';
    case 'rainbow':
      return 'rgba(236, 72, 153, 0.85)';
    case 'fire-amber':
      return 'rgba(245, 158, 11, 0.85)';
    case 'emerald':
      return 'rgba(16, 185, 129, 0.85)';
    case 'purple-magenta':
      return 'rgba(217, 70, 239, 0.85)';
    case 'white-glow':
      return 'rgba(255, 255, 255, 0.9)';
    case 'blood-red':
      return 'rgba(239, 68, 68, 0.9)';
    case 'solar-gold':
      return 'rgba(234, 179, 8, 0.9)';
    case 'electric-violet':
      return 'rgba(168, 85, 247, 0.9)';
    case 'ocean-deep':
      return 'rgba(14, 165, 233, 0.9)';
    default:
      return customColor || 'rgba(99, 102, 241, 0.85)';
  }
}

export function getThemeGradient(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  theme: string,
  customColor1?: string,
  customColor2?: string,
  customColor3?: string
): CanvasGradient {
  const grad = ctx.createLinearGradient(x1, y1, x2, y2);
  if (theme === 'custom') {
    const c1 = customColor1 || '#ec4899';
    const c2 = customColor2 || '#8b5cf6';
    const c3 = customColor3 || '#38bdf8';
    grad.addColorStop(0, c1);
    grad.addColorStop(0.5, c2);
    grad.addColorStop(1, c3);
    return grad;
  }

  switch (theme) {
    case 'cyan-neon':
      grad.addColorStop(0, '#06b6d4');
      grad.addColorStop(0.5, '#3b82f6');
      grad.addColorStop(1, '#6366f1');
      break;
    case 'rainbow':
      grad.addColorStop(0, '#ec4899');
      grad.addColorStop(0.2, '#8b5cf6');
      grad.addColorStop(0.4, '#3b82f6');
      grad.addColorStop(0.6, '#10b981');
      grad.addColorStop(0.8, '#eab308');
      grad.addColorStop(1, '#ef4444');
      break;
    case 'fire-amber':
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.4, '#f59e0b');
      grad.addColorStop(0.8, '#ea580c');
      grad.addColorStop(1, '#b91c1c');
      break;
    case 'emerald':
      grad.addColorStop(0, '#a3e635');
      grad.addColorStop(0.5, '#10b981');
      grad.addColorStop(1, '#06b6d4');
      break;
    case 'purple-magenta':
      grad.addColorStop(0, '#c084fc');
      grad.addColorStop(0.5, '#e879f9');
      grad.addColorStop(1, '#ec4899');
      break;
    case 'white-glow':
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.7, '#e0e7ff');
      grad.addColorStop(1, '#818cf8');
      break;
    case 'blood-red':
      grad.addColorStop(0, '#fca5a5');
      grad.addColorStop(0.4, '#ef4444');
      grad.addColorStop(0.8, '#b91c1c');
      grad.addColorStop(1, '#450a0a');
      break;
    case 'solar-gold':
      grad.addColorStop(0, '#fef9c3');
      grad.addColorStop(0.3, '#facc15');
      grad.addColorStop(0.7, '#eab308');
      grad.addColorStop(1, '#ca8a04');
      break;
    case 'electric-violet':
      grad.addColorStop(0, '#f0abfc');
      grad.addColorStop(0.4, '#c084fc');
      grad.addColorStop(0.8, '#7c3aed');
      grad.addColorStop(1, '#3b0764');
      break;
    case 'ocean-deep':
      grad.addColorStop(0, '#7dd3fc');
      grad.addColorStop(0.4, '#0284c7');
      grad.addColorStop(0.8, '#0369a1');
      grad.addColorStop(1, '#082f49');
      break;
    default:
      grad.addColorStop(0, '#38bdf8');
      grad.addColorStop(1, '#6366f1');
  }
  return grad;
}

// 1. CLASSIC BAR SPECTRUM
function renderBarSpectrum(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: EqualizerConfig,
  freqData: Uint8Array<ArrayBuffer>
) {
  const barCount = config.barCount;
  const maxHeight = config.height;
  const paddingX = 40;
  const usableWidth = width - paddingX * 2;
  const barSpacing = 4;
  const barWidth = Math.max(3, (usableWidth - (barCount - 1) * barSpacing) / barCount);

  // Baseline Y calculation
  let baseY = height - 28;
  if (config.position === 'center') {
    baseY = height / 2 + maxHeight / 2;
  } else if (config.position === 'top') {
    baseY = maxHeight + 28;
  }

  // Ensure peakBars array is initialized
  while (audioEngine.peakBars.length < barCount) {
    audioEngine.peakBars.push(0);
  }

  // Sample frequencies smoothly across the spectrum
  const binStep = Math.max(1, Math.floor(freqData.length / barCount));

  for (let i = 0; i < barCount; i++) {
    const rawVal = freqData[i * binStep] || 0;
    const normalized = (rawVal / 255) * config.sensitivity;
    const barHeight = Math.max(4, Math.min(maxHeight, normalized * maxHeight));

    const x = paddingX + i * (barWidth + barSpacing);
    const y = config.position === 'top' ? 28 : baseY - barHeight;

    // Gradient fill for bar
    const grad = getThemeGradient(ctx, x, baseY, x, y, config.theme);
    ctx.fillStyle = grad;

    // Draw rounded bar
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 1, 1]);
    ctx.fill();

    // Peak caps animation
    if (config.showPeakCaps) {
      if (barHeight > audioEngine.peakBars[i]) {
        audioEngine.peakBars[i] = barHeight;
      } else {
        audioEngine.peakBars[i] = Math.max(0, audioEngine.peakBars[i] - audioEngine.peakDropSpeed);
      }

      const peakY = config.position === 'top' ? 28 + audioEngine.peakBars[i] : baseY - audioEngine.peakBars[i] - 4;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x, peakY, barWidth, 2.5);
    }
  }
}

// 2. OSCILLOSCOPE / WAVEFORM
function renderWaveform(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: EqualizerConfig,
  timeData: Uint8Array<ArrayBuffer>
) {
  let baseY = height - 70;
  if (config.position === 'center') baseY = height / 2;
  else if (config.position === 'top') baseY = 70;

  const amp = (config.height / 2) * config.sensitivity;
  const sliceWidth = width / timeData.length;

  ctx.lineWidth = 3.5;
  ctx.strokeStyle = getThemeGradient(ctx, 0, baseY - amp, width, baseY + amp, config.theme);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  let x = 0;
  for (let i = 0; i < timeData.length; i++) {
    const v = (timeData[i] - 128) / 128; // -1 to 1
    const y = baseY + v * amp;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    x += sliceWidth;
  }

  ctx.stroke();

  // Secondary subtle mirror glow ribbon
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.5;
  ctx.stroke();
  ctx.globalAlpha = 1.0;
}

// 3. RADIAL CIRCULAR VISUALIZER
// --- CENTER CIRCLE / AVATAR IMAGE DRAWING HELPER ---
function drawCenterCircleImage(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  config: EqualizerConfig,
  bassEnergy: number,
  rotationAngle: number
) {
  const dynamicRadius = Math.max(
    25,
    (config.centerImageRadius || radius) + (config.beatPulse ? bassEnergy * 8 : 0)
  );
  ctx.save();

  // Background core backing
  ctx.beginPath();
  ctx.arc(centerX, centerY, dynamicRadius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(10, 15, 30, 0.9)';
  ctx.fill();

  if (config.centerImageElement && config.centerImageElement.complete) {
    ctx.save();
    ctx.translate(centerX, centerY);
    if (config.centerImageRotation) {
      ctx.rotate(rotationAngle);
    }

    ctx.beginPath();
    if (config.centerImageShape === 'hexagon') {
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const hx = Math.cos(a) * dynamicRadius;
        const hy = Math.sin(a) * dynamicRadius;
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
    } else if (config.centerImageShape === 'rounded') {
      ctx.roundRect(-dynamicRadius, -dynamicRadius, dynamicRadius * 2, dynamicRadius * 2, 16);
    } else {
      ctx.arc(0, 0, dynamicRadius, 0, Math.PI * 2);
    }
    ctx.clip();

    // Draw image cover-fit
    const img = config.centerImageElement;
    const aspect = (img.naturalWidth || img.width) / (img.naturalHeight || img.height || 1);
    let dw = dynamicRadius * 2;
    let dh = dynamicRadius * 2;
    if (aspect > 1) {
      dw = dh * aspect;
    } else {
      dh = dw / aspect;
    }
    ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
  } else {
    // Default stylized vinyl record / HAMA monogram disc
    ctx.save();
    ctx.translate(centerX, centerY);
    if (config.centerImageRotation) {
      ctx.rotate(rotationAngle);
    }

    // Vinyl grooves
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    for (let r = dynamicRadius * 0.35; r < dynamicRadius * 0.95; r += 5) {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Center vinyl sticker
    ctx.beginPath();
    ctx.arc(0, 0, dynamicRadius * 0.42, 0, Math.PI * 2);
    const stickerGrad = ctx.createLinearGradient(-dynamicRadius * 0.4, -dynamicRadius * 0.4, dynamicRadius * 0.4, dynamicRadius * 0.4);
    stickerGrad.addColorStop(0, '#ec4899');
    stickerGrad.addColorStop(1, '#6366f1');
    ctx.fillStyle = stickerGrad;
    ctx.fill();

    // Center spindle hole
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();

    // Text monogram
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.max(9, Math.floor(dynamicRadius * 0.18))}px 'Plus Jakarta Sans', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HAMA', 0, -dynamicRadius * 0.14);
    ctx.restore();
  }

  // Glowing border ring
  if (config.centerImageBorder !== false) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, dynamicRadius, 0, Math.PI * 2);
    ctx.strokeStyle = getGlowColor(config.theme);
    ctx.lineWidth = 2.5 + bassEnergy * 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, dynamicRadius + 4, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.restore();
}

// 3. CLASSIC CIRCULAR RADIAL
function renderCircularVisualizer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: EqualizerConfig,
  freqData: Uint8Array<ArrayBuffer>,
  bassEnergy: number,
  rotationAngle: number
) {
  const centerX = width / 2;
  let centerY = height / 2;
  if (config.position === 'bottom') centerY = height * 0.75;
  else if (config.position === 'top') centerY = height * 0.25;

  const baseRadius = (config.centerImageRadius || 65) + 15 + bassEnergy * 15;
  const barCount = Math.min(64, config.barCount);
  const angleStep = (Math.PI * 2) / barCount;
  const binStep = Math.max(1, Math.floor(freqData.length / barCount));

  // Radial spikes
  for (let i = 0; i < barCount; i++) {
    const angle = i * angleStep + (config.centerImageRotation ? rotationAngle * 0.2 : 0);
    const rawVal = freqData[i * binStep] || 0;
    const normalized = (rawVal / 255) * config.sensitivity;
    const spikeLength = Math.max(4, normalized * config.height);

    const x1 = centerX + Math.cos(angle) * baseRadius;
    const y1 = centerY + Math.sin(angle) * baseRadius;
    const x2 = centerX + Math.cos(angle) * (baseRadius + spikeLength);
    const y2 = centerY + Math.sin(angle) * (baseRadius + spikeLength);

    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(1, getGlowColor(config.theme));

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = grad;
    ctx.stroke();
  }

  // Draw Center Circle Image
  drawCenterCircleImage(ctx, centerX, centerY, baseRadius - 10, config, bassEnergy, rotationAngle);
}

// 3B. CIRCULAR LIQUID VISUALIZER (ORGANIC MORPHING FLUID RING)
function renderCircularLiquidVisualizer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: EqualizerConfig,
  freqData: Uint8Array<ArrayBuffer>,
  bassEnergy: number,
  rotationAngle: number
) {
  const centerX = width / 2;
  let centerY = height / 2;
  if (config.position === 'bottom') centerY = height * 0.75;
  else if (config.position === 'top') centerY = height * 0.25;

  const baseRadius = (config.centerImageRadius || 65) + 20;
  const pointsCount = 36;
  const angleStep = (Math.PI * 2) / pointsCount;
  const binStep = Math.max(1, Math.floor(freqData.length / pointsCount));

  // Layer 1: Outer Translucent Liquid Aura
  ctx.save();
  ctx.beginPath();
  const outerPoints: { x: number; y: number }[] = [];
  for (let i = 0; i < pointsCount; i++) {
    const angle = i * angleStep;
    const rawVal = freqData[(i * binStep) % freqData.length] || 0;
    const waveSin = Math.sin(angle * 4 + rotationAngle * 3) * 8;
    const r = baseRadius + (rawVal / 255) * config.height * config.sensitivity * 1.1 + waveSin + bassEnergy * 15;
    outerPoints.push({
      x: centerX + Math.cos(angle) * r,
      y: centerY + Math.sin(angle) * r,
    });
  }

  if (outerPoints.length > 0) {
    ctx.moveTo(outerPoints[0].x, outerPoints[0].y);
    for (let i = 0; i < pointsCount; i++) {
      const p0 = outerPoints[i];
      const p1 = outerPoints[(i + 1) % pointsCount];
      const midX = (p0.x + p1.x) / 2;
      const midY = (p0.y + p1.y) / 2;
      ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
    }
    ctx.closePath();
    ctx.fillStyle = getGlowColor(config.theme).replace('0.8', '0.18');
    ctx.fill();
    ctx.strokeStyle = getGlowColor(config.theme);
    ctx.lineWidth = 1.8;
    ctx.stroke();
  }
  ctx.restore();

  // Layer 2: Main Liquid Perimeter
  ctx.save();
  ctx.beginPath();
  const innerPoints: { x: number; y: number }[] = [];
  for (let i = 0; i < pointsCount; i++) {
    const angle = i * angleStep;
    const rawVal = freqData[(i * binStep + 4) % freqData.length] || 0;
    const waveCos = Math.cos(angle * 5 - rotationAngle * 2.5) * 6;
    const r = baseRadius + (rawVal / 255) * config.height * 0.7 * config.sensitivity + waveCos;
    innerPoints.push({
      x: centerX + Math.cos(angle) * r,
      y: centerY + Math.sin(angle) * r,
    });
  }

  if (innerPoints.length > 0) {
    ctx.moveTo(innerPoints[0].x, innerPoints[0].y);
    for (let i = 0; i < pointsCount; i++) {
      const p0 = innerPoints[i];
      const p1 = innerPoints[(i + 1) % pointsCount];
      const midX = (p0.x + p1.x) / 2;
      const midY = (p0.y + p1.y) / 2;
      ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
    }
    ctx.closePath();
    const grad = ctx.createRadialGradient(centerX, centerY, baseRadius * 0.7, centerX, centerY, baseRadius + config.height);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
    grad.addColorStop(0.6, getGlowColor(config.theme).replace('0.8', '0.3'));
    grad.addColorStop(1, getGlowColor(config.theme).replace('0.8', '0.6'));
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }
  ctx.restore();

  // Draw Center Circle Image
  drawCenterCircleImage(ctx, centerX, centerY, baseRadius - 15, config, bassEnergy, rotationAngle);
}

// 3C. LIQUID WAVE VISUALIZER (SMOOTH FLUID WAVES ACROSS HORIZON)
function renderLiquidWaveVisualizer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: EqualizerConfig,
  freqData: Uint8Array<ArrayBuffer>,
  _timeData: Uint8Array<ArrayBuffer>,
  bassEnergy: number
) {
  let baseY = height - 60;
  if (config.position === 'center') baseY = height / 2 + 30;
  else if (config.position === 'top') baseY = 100;

  const t = performance.now() * 0.002;
  const waveHeight = config.height * 0.8 * config.sensitivity;

  // Draw 3 layers of fluid waves
  const layers = [
    { alpha: 0.25, freqMul: 0.006, speed: 1.2, color: getGlowColor(config.theme).replace('0.8', '0.3'), offset: 0 },
    { alpha: 0.45, freqMul: 0.009, speed: -0.9, color: getGlowColor(config.theme).replace('0.8', '0.5'), offset: Math.PI / 3 },
    { alpha: 0.85, freqMul: 0.012, speed: 1.6, color: getGlowColor(config.theme), offset: Math.PI / 2 },
  ];

  layers.forEach((layer) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, baseY);

    const step = 8;
    for (let x = 0; x <= width; x += step) {
      const dataIdx = Math.floor((x / width) * 32);
      const audioVal = (freqData[dataIdx] || 0) / 255;
      const y =
        baseY -
        Math.sin(x * layer.freqMul + t * layer.speed + layer.offset) * (waveHeight * 0.35 + audioVal * waveHeight * 0.6) -
        bassEnergy * 20;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = layer.color;
    ctx.fill();
    ctx.restore();
  });
}

// 3D. CIRCULAR BARS (RADIAL SPECTRUM WITH OUTER PEAK GLOW)
function renderCircularBars(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: EqualizerConfig,
  freqData: Uint8Array<ArrayBuffer>,
  bassEnergy: number,
  rotationAngle: number
) {
  const centerX = width / 2;
  let centerY = height / 2;
  if (config.position === 'bottom') centerY = height * 0.75;
  else if (config.position === 'top') centerY = height * 0.25;

  const baseRadius = (config.centerImageRadius || 65) + 16 + bassEnergy * 10;
  const barCount = Math.min(72, config.barCount);
  const angleStep = (Math.PI * 2) / barCount;
  const binStep = Math.max(1, Math.floor(freqData.length / barCount));

  for (let i = 0; i < barCount; i++) {
    const angle = i * angleStep;
    const rawVal = freqData[i * binStep] || 0;
    const normalized = (rawVal / 255) * config.sensitivity;
    const h = Math.max(3, normalized * config.height);

    const x1 = centerX + Math.cos(angle) * baseRadius;
    const y1 = centerY + Math.sin(angle) * baseRadius;
    const x2 = centerX + Math.cos(angle) * (baseRadius + h);
    const y2 = centerY + Math.sin(angle) * (baseRadius + h);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = Math.max(2, (Math.PI * 2 * baseRadius) / barCount - 2);
    ctx.lineCap = 'round';
    ctx.strokeStyle = getThemeGradient(ctx, x1, y1, x2, y2, config.theme);
    ctx.stroke();

    // Floating peak dots
    if (config.showPeakCaps) {
      const px = centerX + Math.cos(angle) * (baseRadius + h + 5);
      const py = centerY + Math.sin(angle) * (baseRadius + h + 5);
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
  }

  // Draw Center Circle Image
  drawCenterCircleImage(ctx, centerX, centerY, baseRadius - 10, config, bassEnergy, rotationAngle);
}

// 3E. CIRCULAR NEON RING (DUAL CONCENTRIC ORBITING RINGS)
function renderCircularNeonRing(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: EqualizerConfig,
  freqData: Uint8Array<ArrayBuffer>,
  bassEnergy: number,
  rotationAngle: number
) {
  const centerX = width / 2;
  let centerY = height / 2;
  if (config.position === 'bottom') centerY = height * 0.75;
  else if (config.position === 'top') centerY = height * 0.25;

  const baseRadius = (config.centerImageRadius || 65) + 12;
  const glowColor = getGlowColor(config.theme);

  // Inner pulsing ring
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, baseRadius + bassEnergy * 18, 0, Math.PI * 2);
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = 3.5;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 18;
  ctx.stroke();

  // Outer orbital arc 1
  ctx.beginPath();
  ctx.arc(centerX, centerY, baseRadius + 22 + bassEnergy * 10, rotationAngle * 1.5, rotationAngle * 1.5 + Math.PI * 1.2);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Outer orbital arc 2
  ctx.beginPath();
  ctx.arc(centerX, centerY, baseRadius + 32, -rotationAngle * 2, -rotationAngle * 2 + Math.PI * 0.8);
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Wave ripple dots
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2 + rotationAngle;
    const val = (freqData[i * 2] || 0) / 255;
    const r = baseRadius + 14 + val * config.height * 0.5;
    const dx = centerX + Math.cos(angle) * r;
    const dy = centerY + Math.sin(angle) * r;
    ctx.beginPath();
    ctx.arc(dx, dy, 2.5 + val * 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }
  ctx.restore();

  // Draw Center Circle Image
  drawCenterCircleImage(ctx, centerX, centerY, baseRadius - 6, config, bassEnergy, rotationAngle);
}

// 3F. VINYL DISC WITH TURNTABLE GROOVES & STYLUS GLOW
function renderVinylDisc(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: EqualizerConfig,
  freqData: Uint8Array<ArrayBuffer>,
  bassEnergy: number,
  rotationAngle: number
) {
  const centerX = width / 2;
  let centerY = height / 2;
  if (config.position === 'bottom') centerY = height * 0.75;
  else if (config.position === 'top') centerY = height * 0.25;

  const discRadius = Math.max(90, (config.centerImageRadius || 65) + 55 + bassEnergy * 10);
  ctx.save();

  // Disc body
  ctx.beginPath();
  ctx.arc(centerX, centerY, discRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#0a0d14';
  ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Concentric vinyl grooves with audio sheen
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 1;
  for (let r = discRadius * 0.45; r < discRadius * 0.95; r += 4) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Light reflection sheen across vinyl
  const sheenGrad = ctx.createLinearGradient(
    centerX - discRadius,
    centerY - discRadius,
    centerX + discRadius,
    centerY + discRadius
  );
  sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
  sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
  sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
  ctx.beginPath();
  ctx.arc(centerX, centerY, discRadius - 2, 0, Math.PI * 2);
  ctx.fillStyle = sheenGrad;
  ctx.fill();

  // Subtle outer edge audio spikes
  const barCount = 36;
  const angleStep = (Math.PI * 2) / barCount;
  for (let i = 0; i < barCount; i++) {
    const angle = i * angleStep + rotationAngle;
    const val = (freqData[i * 3] || 0) / 255;
    const len = val * 16 * config.sensitivity;
    const x1 = centerX + Math.cos(angle) * discRadius;
    const y1 = centerY + Math.sin(angle) * discRadius;
    const x2 = centerX + Math.cos(angle) * (discRadius + len);
    const y2 = centerY + Math.sin(angle) * (discRadius + len);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = getGlowColor(config.theme);
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.restore();

  // Center Label / Custom Center Image
  drawCenterCircleImage(ctx, centerX, centerY, discRadius * 0.45, config, bassEnergy, rotationAngle);
}

// 3G. PARTICLE ORBIT VISUALIZER
function renderParticleOrbit(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: EqualizerConfig,
  freqData: Uint8Array<ArrayBuffer>,
  bassEnergy: number,
  rotationAngle: number
) {
  const centerX = width / 2;
  let centerY = height / 2;
  if (config.position === 'bottom') centerY = height * 0.75;
  else if (config.position === 'top') centerY = height * 0.25;

  const baseRadius = (config.centerImageRadius || 65) + 15;
  const particleCount = 48;
  const glowColor = getGlowColor(config.theme);

  ctx.save();
  for (let i = 0; i < particleCount; i++) {
    const speed = (i % 3 === 0 ? 1 : i % 2 === 0 ? -1.3 : 1.8) * 0.8;
    const angle = (i / particleCount) * Math.PI * 2 + rotationAngle * speed;
    const val = (freqData[i % freqData.length] || 0) / 255;
    const distance = baseRadius + (i % 4) * 16 + val * config.height * config.sensitivity;

    const px = centerX + Math.cos(angle) * distance;
    const py = centerY + Math.sin(angle) * distance;
    const pSize = Math.max(2, 2.5 + val * 4 + bassEnergy * 2);

    ctx.beginPath();
    ctx.arc(px, py, pSize, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? '#ffffff' : glowColor;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 8;
    ctx.fill();
  }
  ctx.restore();

  // Draw Center Circle Image
  drawCenterCircleImage(ctx, centerX, centerY, baseRadius - 8, config, bassEnergy, rotationAngle);
}

// 3H. CYBER RADIAL HUD GAUGES
function renderCyberRadial(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: EqualizerConfig,
  freqData: Uint8Array<ArrayBuffer>,
  bassEnergy: number,
  rotationAngle: number
) {
  const centerX = width / 2;
  let centerY = height / 2;
  if (config.position === 'bottom') centerY = height * 0.75;
  else if (config.position === 'top') centerY = height * 0.25;

  const baseRadius = (config.centerImageRadius || 65) + 18;
  const glowColor = getGlowColor(config.theme);

  ctx.save();
  // Segmented outer arc
  const segments = 24;
  const segAngle = (Math.PI * 2) / segments;
  for (let i = 0; i < segments; i++) {
    const val = (freqData[i * 2] || 0) / 255;
    const startA = i * segAngle + rotationAngle * 0.5;
    const endA = startA + segAngle * 0.7;

    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius + 10, startA, endA);
    ctx.strokeStyle = val > 0.4 ? glowColor : 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 4 + val * 6;
    ctx.stroke();
  }

  // Crosshair telemetry ticks
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1.5;
  const crossArms = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
  crossArms.forEach((a) => {
    const rot = a + rotationAngle * 0.2;
    const x1 = centerX + Math.cos(rot) * (baseRadius + 22);
    const y1 = centerY + Math.sin(rot) * (baseRadius + 22);
    const x2 = centerX + Math.cos(rot) * (baseRadius + 36);
    const y2 = centerY + Math.sin(rot) * (baseRadius + 36);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });
  ctx.restore();

  // Draw Center Circle Image
  drawCenterCircleImage(ctx, centerX, centerY, baseRadius - 10, config, bassEnergy, rotationAngle);
}

// 4. MIRRORED SPECTRUM (EXPANDS UP AND DOWN FROM HORIZONTAL CENTER)
function renderMirroredSpectrum(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: EqualizerConfig,
  freqData: Uint8Array<ArrayBuffer>
) {
  const barCount = config.barCount;
  const maxHeight = config.height / 2;
  const paddingX = 40;
  const usableWidth = width - paddingX * 2;
  const barSpacing = 3;
  const barWidth = Math.max(3, (usableWidth - (barCount - 1) * barSpacing) / barCount);

  let centerY = height / 2;
  if (config.position === 'bottom') centerY = height - 50;
  else if (config.position === 'top') centerY = 50;

  const binStep = Math.max(1, Math.floor(freqData.length / barCount));

  for (let i = 0; i < barCount; i++) {
    const rawVal = freqData[i * binStep] || 0;
    const normalized = (rawVal / 255) * config.sensitivity;
    const h = Math.max(2, Math.min(maxHeight, normalized * maxHeight));

    const x = paddingX + i * (barWidth + barSpacing);

    const grad = getThemeGradient(ctx, x, centerY - h, x, centerY + h, config.theme);
    ctx.fillStyle = grad;

    // Top half bar
    ctx.beginPath();
    ctx.roundRect(x, centerY - h, barWidth, h, [3, 3, 0, 0]);
    ctx.fill();

    // Bottom half bar
    ctx.beginPath();
    ctx.roundRect(x, centerY, barWidth, h, [0, 0, 3, 3]);
    ctx.fill();
  }
}

// 5. FLOATING DOT MATRIX
function renderDotMatrix(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: EqualizerConfig,
  freqData: Uint8Array<ArrayBuffer>
) {
  const columns = Math.min(48, config.barCount);
  const rows = 12;
  const paddingX = 40;
  const usableWidth = width - paddingX * 2;
  const colSpacing = usableWidth / columns;
  const dotSize = Math.max(2.5, Math.min(6, colSpacing - 4));
  const dotSpacingY = config.height / rows;

  let baseY = height - 28;
  if (config.position === 'center') baseY = height / 2 + config.height / 2;
  else if (config.position === 'top') baseY = config.height + 28;

  const binStep = Math.max(1, Math.floor(freqData.length / columns));

  for (let c = 0; c < columns; c++) {
    const rawVal = freqData[c * binStep] || 0;
    const normalized = (rawVal / 255) * config.sensitivity;
    const activeRows = Math.round(normalized * rows);

    const x = paddingX + c * colSpacing + dotSize / 2;

    for (let r = 0; r < rows; r++) {
      const y = baseY - r * dotSpacingY;
      const isActive = r < activeRows;

      if (isActive) {
        ctx.fillStyle = getThemeGradient(ctx, x, baseY, x, baseY - config.height, config.theme);
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Dim unlit LED dot
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.arc(x, y, dotSize * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

// Particle cache for audio-reactive ambient video spark particles
interface VideoParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  color: string;
}

let videoParticlesPool: VideoParticle[] | null = null;

function initVideoParticles(width: number, height: number): VideoParticle[] {
  const count = 38;
  const colors = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#34d399', '#fbbf24'];
  const list: VideoParticle[] = [];
  for (let i = 0; i < count; i++) {
    list.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(Math.random() * 0.9 + 0.3),
      size: Math.random() * 2.8 + 1.2,
      baseAlpha: Math.random() * 0.45 + 0.2,
      color: colors[i % colors.length],
    });
  }
  return list;
}

/**
 * Render lapisan efek visual video reaktif musik (Flash, Strobe, Shockwave Ring, & Floating Particles)
 */
export function renderAudioReactiveVideoOverlays(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  audioFx: AudioReactiveVideoFx,
  audioMetrics: AudioReactiveVideoMetrics
) {
  if (!audioFx.enabled) return;
  const intensity = audioFx.intensity || 1.0;

  // 1. BEAT FLASH & DROP STROBE OVERLAY
  if (audioFx.beatFlash && (audioMetrics.isBeatDrop || audioMetrics.bass > 0.65)) {
    const flashAlpha = Math.min(0.48, (audioMetrics.bass - 0.45) * 0.9 * intensity);
    if (flashAlpha > 0.04) {
      ctx.save();
      // White atmospheric ambient flash
      ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
      ctx.fillRect(0, 0, width, height);

      // Radial center bloom on intense beat drop
      const radial = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width * 0.65);
      radial.addColorStop(0, `rgba(255, 255, 255, ${Math.min(0.55, flashAlpha * 1.2)})`);
      radial.addColorStop(0.4, `rgba(56, 189, 248, ${Math.min(0.28, flashAlpha * 0.7)})`);
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  }

  // 2. BEAT SHOCKWAVE RIPPLES (Cincin Energi Melingkar saat Beat Hentakan)
  if (audioFx.beatParticles && audioMetrics.bass > 0.48) {
    ctx.save();
    const ringRadius = (width * 0.12) + (audioMetrics.bass * width * 0.38 * intensity);
    const ringAlpha = Math.min(0.7, (audioMetrics.bass - 0.4) * 1.1 * intensity);

    ctx.beginPath();
    ctx.arc(width / 2, height / 2, ringRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(56, 189, 248, ${ringAlpha})`;
    ctx.lineWidth = 2.5 + audioMetrics.bass * 3 * intensity;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 16;
    ctx.stroke();

    // Second concentric ripple on heavy bass drops
    if (audioMetrics.isBeatDrop || audioMetrics.bass > 0.7) {
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, ringRadius * 0.62, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(192, 132, 252, ${ringAlpha * 0.8})`;
      ctx.lineWidth = 2;
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 12;
      ctx.stroke();
    }
    ctx.restore();
  }

  // 3. FLOATING BEAT PARTICLES / SPARKS
  if (audioFx.beatParticles) {
    if (!videoParticlesPool || videoParticlesPool.length === 0) {
      videoParticlesPool = initVideoParticles(width, height);
    }

    ctx.save();
    const speedBoost = 1 + audioMetrics.bass * 2.8 * intensity;
    const alphaBoost = 1 + audioMetrics.volume * 1.5 * intensity;

    for (let i = 0; i < videoParticlesPool.length; i++) {
      const p = videoParticlesPool[i];
      p.y += p.vy * speedBoost;
      p.x += p.vx * speedBoost;

      // Wrap around bounds
      if (p.y < 0) {
        p.y = height;
        p.x = Math.random() * width;
      }
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      const dynamicSize = p.size * (1 + audioMetrics.bass * 0.8 * intensity);
      const dynamicAlpha = Math.min(0.9, p.baseAlpha * alphaBoost);

      ctx.beginPath();
      ctx.arc(p.x, p.y, dynamicSize, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = dynamicAlpha;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.fill();
    }
    ctx.restore();
  }

  // 4. NEON BORDER GLOW (Audio-Reactive Luminous Edge Border)
  if (audioFx.neonBorderGlow) {
    ctx.save();
    const borderAlpha = Math.min(0.85, 0.2 + audioMetrics.bass * 0.7 * intensity);
    const borderWidth = 3 + audioMetrics.bass * 10 * intensity;
    const fxColor = audioFx.customFxColor || '#ec4899';
    ctx.strokeStyle = fxColor;
    ctx.lineWidth = borderWidth;
    ctx.globalAlpha = borderAlpha;
    ctx.shadowColor = fxColor;
    ctx.shadowBlur = 18 + audioMetrics.bass * 16 * intensity;
    ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth);
    ctx.restore();
  }

  // 5. STROBE GLITCH LINES (Audio drop slice lines)
  if (audioFx.strobeGlitch && (audioMetrics.isBeatDrop || audioMetrics.bass > 0.62)) {
    ctx.save();
    const lineCount = Math.floor(3 + audioMetrics.bass * 6 * intensity);
    const fxColor = audioFx.customFxColor || '#38bdf8';
    for (let i = 0; i < lineCount; i++) {
      const y = Math.random() * height;
      const h = 2 + Math.random() * 8;
      ctx.fillStyle = i % 2 === 0 ? fxColor : '#ffffff';
      ctx.globalAlpha = Math.min(0.7, 0.2 + Math.random() * 0.5 * intensity);
      ctx.fillRect(0, y, width, h);
    }
    ctx.restore();
  }

  // 6. AUDIO WAVE RIBBON (Dynamic glowing sine ribbon)
  if (audioFx.audioWaveRibbon) {
    ctx.save();
    const fxColor = audioFx.customFxColor || '#a855f7';
    ctx.beginPath();
    const points = 40;
    const ribbonY = height * 0.65;
    const amp = 20 + audioMetrics.bass * 75 * intensity;
    const time = performance.now() * 0.003;

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      const y = ribbonY + Math.sin(i * 0.25 + time) * amp * Math.sin((i / points) * Math.PI);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = fxColor;
    ctx.lineWidth = 3 + audioMetrics.bass * 4 * intensity;
    ctx.globalAlpha = Math.min(0.85, 0.4 + audioMetrics.volume * 0.5 * intensity);
    ctx.shadowColor = fxColor;
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.restore();
  }
}

// =========================================================================
// NEW EQUALIZER & VISUAL EFFECT STYLES IMPLEMENTATION
// =========================================================================

// 4. MATRIX RAIN CODE VISUALIZER
function renderMatrixRainVisualizer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: EqualizerConfig,
  freqData: Uint8Array<ArrayBuffer>,
  bassEnergy: number
) {
  ctx.save();
  const columns = Math.min(config.barCount || 36, 48);
  const colWidth = width / columns;
  const chars = '0123456789ABCDEFHAMAPRO';
  const glow = getGlowColor(config.theme, config.customColor1);

  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';

  for (let c = 0; c < columns; c++) {
    const val = (freqData[c * 2] || 0) / 255;
    const dropHeight = Math.max(20, val * height * 0.75 * config.sensitivity);
    const charCount = Math.floor(dropHeight / 16);

    for (let j = 0; j < charCount; j++) {
      const y = height - j * 16;
      const char = chars[(c * 7 + j * 3) % chars.length];
      const isLead = j === charCount - 1;

      ctx.fillStyle = isLead ? '#ffffff' : glow;
      ctx.globalAlpha = isLead ? 1.0 : Math.max(0.15, (1 - j / charCount) * (0.4 + val * 0.6));
      ctx.fillText(char, c * colWidth + colWidth / 2, y);
    }
  }
  ctx.restore();
}

// 5. AUDIO TUNNEL 3D DEPTH VISUALIZER
function renderAudioTunnelVisualizer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: EqualizerConfig,
  freqData: Uint8Array<ArrayBuffer>,
  bassEnergy: number,
  rotationAngle: number
) {
  const centerX = width / 2;
  let centerY = height / 2;
  if (config.position === 'bottom') centerY = height * 0.75;
  else if (config.position === 'top') centerY = height * 0.25;

  ctx.save();
  const ringCount = 12;
  const maxRadius = Math.min(width, height) * 0.46;
  const glow = getGlowColor(config.theme, config.customColor1);

  for (let r = 0; r < ringCount; r++) {
    const progress = (r / ringCount + (rotationAngle * 0.1) % 1) % 1;
    const radius = 25 + Math.pow(progress, 2) * maxRadius;
    const freqIdx = Math.floor(progress * Math.min(freqData.length, 32));
    const val = (freqData[freqIdx] || 0) / 255;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + val * 24 * config.sensitivity, 0, Math.PI * 2);
    ctx.strokeStyle = glow;
    ctx.lineWidth = 1.5 + progress * 4 + val * 3;
    ctx.globalAlpha = Math.min(0.9, 0.15 + progress * 0.75);
    ctx.shadowColor = glow;
    ctx.shadowBlur = 10;
    ctx.stroke();
  }
  ctx.restore();
}

// 6. LASER PRISM BEAMS
function renderLaserPrismVisualizer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: EqualizerConfig,
  freqData: Uint8Array<ArrayBuffer>,
  bassEnergy: number,
  rotationAngle: number
) {
  const centerX = width / 2;
  let centerY = height / 2;
  if (config.position === 'bottom') centerY = height * 0.85;
  else if (config.position === 'top') centerY = height * 0.15;

  ctx.save();
  const beamCount = Math.min(config.barCount || 32, 48);
  const angleStep = Math.PI / (beamCount - 1);
  const maxLen = Math.sqrt(width * width + height * height);
  const grad = getThemeGradient(
    ctx,
    centerX,
    centerY,
    width,
    height,
    config.theme,
    config.customColor1,
    config.customColor2,
    config.customColor3
  );

  for (let i = 0; i < beamCount; i++) {
    const val = (freqData[i * 2] || 0) / 255;
    const a = -Math.PI + i * angleStep + Math.sin(rotationAngle + i * 0.2) * 0.08;
    const len = (maxLen * 0.35 + val * maxLen * 0.65) * config.sensitivity;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + Math.cos(a) * len, centerY + Math.sin(a) * len);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2 + val * 5;
    ctx.globalAlpha = Math.min(0.9, 0.2 + val * 0.8);
    ctx.shadowColor = getGlowColor(config.theme, config.customColor1);
    ctx.shadowBlur = 12;
    ctx.stroke();
  }
  ctx.restore();
}

// 7. GALAXY SPIRAL COSMIC AUDIO
function renderGalaxySpiralVisualizer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: EqualizerConfig,
  freqData: Uint8Array<ArrayBuffer>,
  bassEnergy: number,
  rotationAngle: number
) {
  const centerX = width / 2;
  let centerY = height / 2;
  if (config.position === 'bottom') centerY = height * 0.75;
  else if (config.position === 'top') centerY = height * 0.25;

  ctx.save();
  const arms = 3;
  const pointsPerArm = 50;
  const glow = getGlowColor(config.theme, config.customColor1);

  for (let arm = 0; arm < arms; arm++) {
    const armOffset = (arm * (Math.PI * 2)) / arms;
    for (let p = 0; p < pointsPerArm; p++) {
      const prog = p / pointsPerArm;
      const angle = armOffset + prog * 4.5 + rotationAngle;
      const dist = 30 + Math.pow(prog, 1.3) * (width * 0.38);

      const fIdx = Math.floor(prog * 32);
      const val = (freqData[fIdx] || 0) / 255;
      const size = (2 + prog * 4 + val * 7) * config.sensitivity;

      const x = centerX + Math.cos(angle) * dist;
      const y = centerY + Math.sin(angle) * dist;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = val > 0.5 ? '#ffffff' : glow;
      ctx.globalAlpha = Math.min(0.9, 0.25 + val * 0.75);
      ctx.shadowColor = glow;
      ctx.shadowBlur = 8;
      ctx.fill();
    }
  }
  ctx.restore();
}

// 8. STARBURST PULSE
function renderStarburstVisualizer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: EqualizerConfig,
  freqData: Uint8Array<ArrayBuffer>,
  bassEnergy: number,
  rotationAngle: number
) {
  const centerX = width / 2;
  let centerY = height / 2;
  if (config.position === 'bottom') centerY = height * 0.75;
  else if (config.position === 'top') centerY = height * 0.25;

  ctx.save();
  const spikes = Math.min(config.barCount || 32, 64);
  const step = (Math.PI * 2) / spikes;
  const innerR = (config.centerImageRadius || 60) + 10;
  const glow = getGlowColor(config.theme, config.customColor1);

  ctx.beginPath();
  for (let i = 0; i < spikes; i++) {
    const val = (freqData[i] || 0) / 255;
    const a = i * step + rotationAngle * 0.5;
    const outerR = innerR + 15 + val * (config.height || 100) * config.sensitivity;

    const x1 = centerX + Math.cos(a) * innerR;
    const y1 = centerY + Math.sin(a) * innerR;
    const x2 = centerX + Math.cos(a) * outerR;
    const y2 = centerY + Math.sin(a) * outerR;

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }

  ctx.strokeStyle = glow;
  ctx.lineWidth = 3 + bassEnergy * 4;
  ctx.lineCap = 'round';
  ctx.shadowColor = glow;
  ctx.shadowBlur = 14;
  ctx.stroke();
  ctx.restore();
}

// 9. FREQUENCY MESH GRID
function renderFrequencyMeshVisualizer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: EqualizerConfig,
  freqData: Uint8Array<ArrayBuffer>,
  bassEnergy: number
) {
  ctx.save();
  const cols = 20;
  const rows = 8;
  const colW = width / cols;
  const rowH = (config.height || 120) / rows;
  const baseY = config.position === 'top' ? 20 : height - (config.height || 120) - 20;
  const glow = getGlowColor(config.theme, config.customColor1);

  ctx.strokeStyle = glow;
  ctx.lineWidth = 1.2;
  ctx.shadowColor = glow;
  ctx.shadowBlur = 6;

  for (let r = 0; r < rows; r++) {
    ctx.beginPath();
    for (let c = 0; c <= cols; c++) {
      const val = (freqData[(c * 2 + r * 3) % freqData.length] || 0) / 255;
      const x = c * colW;
      const wave = Math.sin(c * 0.5 + performance.now() * 0.003) * 10;
      const y = baseY + r * rowH - val * 35 * config.sensitivity + wave;
      if (c === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.globalAlpha = 0.2 + (r / rows) * 0.7;
    ctx.stroke();
  }
  ctx.restore();
}
