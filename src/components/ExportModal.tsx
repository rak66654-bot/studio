import React, { useState, useEffect } from 'react';
import {
  Film,
  Zap,
  Cpu,
  CheckCircle2,
  AlertCircle,
  X,
  Play,
  Settings,
  Sparkles,
  Monitor,
  Smartphone,
  Square,
  Gauge,
  Layers,
  Music,
  Image as ImageIcon,
  HardDrive,
  Info,
  Rocket,
} from 'lucide-react';
import {
  ExportSettings,
  ExportVideoFormat,
  ExportRenderEngine,
  ExportResolution,
  ExportFrameRate,
  ExportQuality,
  ExportSpeedMode,
} from '../types';

interface ExportModalProps {
  isOpen: boolean;
  isExporting: boolean;
  progress: number; // 0 to 1
  elapsedTime: number;
  totalTime: number;
  slideCount: number;
  musicName: string | null;
  onStartExport: (settings: ExportSettings) => void;
  onCancel: () => void;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  isExporting,
  progress,
  elapsedTime,
  totalTime,
  slideCount,
  musicName,
  onStartExport,
  onCancel,
  onClose,
}) => {
  // Check browser native MP4 MediaRecorder support
  const [nativeMp4Supported, setNativeMp4Supported] = useState<boolean>(true);

  // Export settings state
  const [format, setFormat] = useState<ExportVideoFormat>('mp4');
  const [engine, setEngine] = useState<ExportRenderEngine>('gpu');
  const [resolution, setResolution] = useState<ExportResolution>('1080p');
  const [fps, setFps] = useState<ExportFrameRate>(60);
  const [quality, setQuality] = useState<ExportQuality>('high');
  const [speed, setSpeed] = useState<ExportSpeedMode>('turbo');

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof MediaRecorder !== 'undefined') {
      const mp4Supported =
        MediaRecorder.isTypeSupported('video/mp4;codecs=avc1.42E01E,mp4a.40.2') ||
        MediaRecorder.isTypeSupported('video/mp4;codecs=avc1') ||
        MediaRecorder.isTypeSupported('video/mp4;codecs=h264,aac') ||
        MediaRecorder.isTypeSupported('video/mp4');
      setNativeMp4Supported(mp4Supported);
    }
  }, []);

  if (!isOpen) return null;

  const percentage = Math.min(100, Math.floor(progress * 100));

  const remainingSeconds =
    progress > 0 && elapsedTime > 0
      ? Math.max(0, Math.round((elapsedTime / progress) - elapsedTime))
      : Math.round(totalTime);

  const handleStart = () => {
    onStartExport({
      format,
      engine,
      resolution,
      fps,
      quality,
      speed,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20 shrink-0">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {isExporting ? 'Proses Rendering & Ekspor Sedang Berjalan' : 'Pengaturan Ekspor Video & Engine Render'}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isExporting ? 'Membakar Video' : 'Presisi Tinggi'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isExporting
                  ? `Sedang memproses dengan engine ${engine === 'gpu' ? 'GPU Hardware' : 'CPU Software'} ke format ${format.toUpperCase()}`
                  : 'Pilih akselerasi hardware GPU atau CPU Multi-Core, format MP4/WebM/GIF/WAV, resolusi & FPS.'}
              </p>
            </div>
          </div>
          {!isExporting && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {isExporting ? (
            /* RENDERING PROGRESS VIEW */
            <div className="space-y-6 py-2">
              <div className="text-center space-y-3">
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full border-4 border-slate-800 border-t-emerald-400 border-r-cyan-400 animate-spin" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white font-mono">{percentage}%</span>
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                      {engine === 'gpu' ? 'GPU Render' : 'CPU Render'}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">
                    Merender Frame Video ({fps} FPS • {resolution.toUpperCase()})
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    Membakar efek visualizer liquid, transisi foto ({slideCount} slide), lirik sinkron, dan audio trek ke file{' '}
                    <strong className="text-emerald-400 font-mono">{format.toUpperCase()}</strong>.
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>
                    Waktu Berjalan:{' '}
                    <strong className="text-slate-200">{elapsedTime.toFixed(1)}s</strong> / {totalTime.toFixed(1)}s
                  </span>
                  <span>
                    Estimasi Sisa:{' '}
                    <strong className="text-cyan-300">{remainingSeconds}s</strong>
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-150 shadow-md"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Active Engine Badge */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  {engine === 'gpu' ? (
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                      <Zap className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-slate-200 flex items-center gap-2">
                      <span>{engine === 'gpu' ? 'Akselerasi GPU (Hardware Accelerated)' : 'Prosesor (CPU Multi-Core Render)'}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Aktif
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Format: <span className="text-slate-200 font-mono font-bold">{format.toUpperCase()}</span> • Resolusi:{' '}
                      <span className="text-slate-200 font-mono">{resolution.toUpperCase()}</span> • Target:{' '}
                      <span className="text-slate-200 font-mono">{fps} FPS</span> • Mode:{' '}
                      <span className="text-amber-300 font-mono font-bold">{speed === 'turbo' ? '⚡ TURBO' : 'STANDARD'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-5 py-2 text-xs font-semibold text-red-300 hover:text-white bg-red-950/50 hover:bg-red-900/60 border border-red-800/60 rounded-xl transition shadow-sm"
                >
                  Batalkan Perekaman
                </button>
              </div>
            </div>
          ) : (
            /* CONFIGURATION VIEW */
            <div className="space-y-6">
              {/* 1. RENDER ENGINE: GPU vs CPU */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    1. Engine Render (GPU vs CPU)
                  </label>
                  <span className="text-[11px] text-slate-400">Pilih akselerasi hardware yang diinginkan</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* GPU Card */}
                  <button
                    type="button"
                    onClick={() => setEngine('gpu')}
                    className={`p-4 rounded-xl border text-left transition flex flex-col justify-between gap-2.5 relative cursor-pointer ${
                      engine === 'gpu'
                        ? 'bg-gradient-to-br from-cyan-950/60 via-slate-900 to-indigo-950/50 border-cyan-500 ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-lg ${engine === 'gpu' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-1.5">
                            <span>Akselerasi GPU</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
                              Cepat
                            </span>
                          </div>
                          <div className="text-[10px] text-cyan-400 font-mono">Hardware Graphics Card</div>
                        </div>
                      </div>
                      {engine === 'gpu' && <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Memanfaatkan GPU kartu grafis (NVIDIA GeForce, AMD Radeon, Intel Iris, Apple M1/M2/M3) untuk render video 60 FPS real-time ultra cepat dan rendering partikel cair.
                    </p>
                  </button>

                  {/* CPU Card */}
                  <button
                    type="button"
                    onClick={() => setEngine('cpu')}
                    className={`p-4 rounded-xl border text-left transition flex flex-col justify-between gap-2.5 relative cursor-pointer ${
                      engine === 'cpu'
                        ? 'bg-gradient-to-br from-purple-950/60 via-slate-900 to-indigo-950/50 border-purple-500 ring-2 ring-purple-500/40 shadow-lg shadow-purple-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-lg ${engine === 'cpu' ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-400'}`}>
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-1.5">
                            <span>Prosesor (CPU)</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">
                              Presisi
                            </span>
                          </div>
                          <div className="text-[10px] text-purple-400 font-mono">Multi-Core Software Engine</div>
                        </div>
                      </div>
                      {engine === 'cpu' && <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Menggunakan core CPU komputer untuk perenderan frame-by-frame presisi tinggi. Bebas drop frame bahkan jika komputer sibuk, serta smoothing grafis software maksimal.
                    </p>
                  </button>
                </div>
              </div>

              {/* 2. FORMAT OUTPUT: MP4, WebM, GIF, MKV, WAV */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-emerald-400" />
                    2. Format File Output (MP4, WebM, GIF, dll.)
                  </label>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                    {format === 'mp4' ? 'Kompatibel Semua HP & Sosmed' : format === 'gif' ? 'Sticker Animasi Looping' : format === 'wav' ? 'Audio Master Saja' : 'Format High-Bitrate'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {/* MP4 Card */}
                  <button
                    type="button"
                    onClick={() => setFormat('mp4')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-1.5 cursor-pointer ${
                      format === 'mp4'
                        ? 'bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/40 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-black text-white flex items-center gap-1.5">
                        <span>MP4 Video</span>
                        <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                          H.264
                        </span>
                      </span>
                      {format === 'mp4' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      Format universal HP Android, iPhone, WhatsApp, Instagram, Reels, TikTok & YouTube.
                    </p>
                  </button>

                  {/* WebM Card */}
                  <button
                    type="button"
                    onClick={() => setFormat('webm')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-1.5 cursor-pointer ${
                      format === 'webm'
                        ? 'bg-cyan-950/50 border-cyan-500 ring-2 ring-cyan-500/40 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-black text-white flex items-center gap-1.5">
                        <span>WebM Video</span>
                        <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                          VP9
                        </span>
                      </span>
                      {format === 'webm' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      Kompresi web modern ultra-efisien, ukuran file lebih hemat dengan ketajaman tinggi.
                    </p>
                  </button>

                  {/* GIF Animasi Card */}
                  <button
                    type="button"
                    onClick={() => setFormat('gif')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-1.5 cursor-pointer ${
                      format === 'gif'
                        ? 'bg-pink-950/50 border-pink-500 ring-2 ring-pink-500/40 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-black text-white flex items-center gap-1.5">
                        <span>GIF Animasi</span>
                        <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-pink-500/20 text-pink-300 font-bold">
                          GIF89a
                        </span>
                      </span>
                      {format === 'gif' && <CheckCircle2 className="w-4 h-4 text-pink-400" />}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      Gambar animasi looping tanpa audio untuk sticker chat WhatsApp, Discord, & media sosial.
                    </p>
                  </button>

                  {/* MKV Container Card */}
                  <button
                    type="button"
                    onClick={() => setFormat('mkv')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-1.5 cursor-pointer ${
                      format === 'mkv'
                        ? 'bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/40 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-black text-white flex items-center gap-1.5">
                        <span>MKV Studio</span>
                        <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                          Matroska
                        </span>
                      </span>
                      {format === 'mkv' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      Format master studio untuk editing profesional di Premiere, DaVinci, atau arsip HD.
                    </p>
                  </button>

                  {/* WAV Audio-only Card */}
                  <button
                    type="button"
                    onClick={() => setFormat('wav')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-1.5 cursor-pointer ${
                      format === 'wav'
                        ? 'bg-amber-950/50 border-amber-500 ring-2 ring-amber-500/40 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-black text-white flex items-center gap-1.5">
                        <span>Audio Master</span>
                        <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                          WAV PCM
                        </span>
                      </span>
                      {format === 'wav' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      Hanya mengekspor trek audio master berkualitas 16-bit 48kHz tanpa rekaman video.
                    </p>
                  </button>
                </div>
              </div>

              {/* 3. RESOLUTION & ASPECT RATIO (If not audio-only) */}
              {format !== 'wav' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Monitor className="w-3.5 h-3.5 text-amber-400" />
                      3. Resolusi & Rasio Aspek Layar
                    </label>
                    <span className="text-[11px] text-slate-400">Pilih tata letak kanvas</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <button
                      type="button"
                      onClick={() => setResolution('1080p')}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                        resolution === '1080p'
                          ? 'bg-amber-950/40 border-amber-500 text-white font-bold ring-1 ring-amber-500/40 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                      }`}
                    >
                      <Monitor className="w-4 h-4 text-amber-400" />
                      <span className="text-xs">1080p FHD</span>
                      <span className="text-[10px] font-mono text-slate-400">16:9 Lanskap</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setResolution('portrait')}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                        resolution === 'portrait'
                          ? 'bg-pink-950/40 border-pink-500 text-white font-bold ring-1 ring-pink-500/40 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-pink-400" />
                      <span className="text-xs">TikTok / Reels</span>
                      <span className="text-[10px] font-mono text-slate-400">9:16 Potret</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setResolution('square')}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                        resolution === 'square'
                          ? 'bg-cyan-950/40 border-cyan-500 text-white font-bold ring-1 ring-cyan-500/40 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                      }`}
                    >
                      <Square className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs">Feed IG</span>
                      <span className="text-[10px] font-mono text-slate-400">1:1 Persegi</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setResolution('720p')}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                        resolution === '720p'
                          ? 'bg-indigo-950/40 border-indigo-500 text-white font-bold ring-1 ring-indigo-500/40 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                      }`}
                    >
                      <Gauge className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs">720p HD</span>
                      <span className="text-[10px] font-mono text-slate-400">Hemat Kuota</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setResolution('2k')}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                        resolution === '2k'
                          ? 'bg-emerald-950/40 border-emerald-500 text-white font-bold ring-1 ring-emerald-500/40 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs">2K QHD</span>
                      <span className="text-[10px] font-mono text-slate-400">Sinematik</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 4. FPS & BITRATE QUALITY (If not audio-only) */}
              {format !== 'wav' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Frame Rate Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                      Frame Rate (FPS)
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFps(60)}
                        className={`py-2 px-2 text-center rounded-lg border text-xs font-semibold transition cursor-pointer ${
                          fps === 60
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        60 FPS (Ultra Halus)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFps(30)}
                        className={`py-2 px-2 text-center rounded-lg border text-xs font-semibold transition cursor-pointer ${
                          fps === 30
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        30 FPS (Standar)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFps(24)}
                        className={`py-2 px-2 text-center rounded-lg border text-xs font-semibold transition cursor-pointer ${
                          fps === 24
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        24 FPS (Sinema)
                      </button>
                    </div>
                  </div>

                  {/* Quality / Bitrate Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      Kualitas Bitrate Video
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setQuality('ultra')}
                        className={`py-2 px-1 text-center rounded-lg border text-[11px] font-semibold transition cursor-pointer ${
                          quality === 'ultra'
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Ultra (15 Mbps)
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuality('high')}
                        className={`py-2 px-1 text-center rounded-lg border text-[11px] font-semibold transition cursor-pointer ${
                          quality === 'high'
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Tinggi (8 Mbps)
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuality('medium')}
                        className={`py-2 px-1 text-center rounded-lg border text-[11px] font-semibold transition cursor-pointer ${
                          quality === 'medium'
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Hemat (4 Mbps)
                      </button>
                    </div>
                  </div>

                  {/* 4. Kecepatan Export Rendering (Turbo vs Normal) */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                        <Rocket className="w-3.5 h-3.5 text-amber-400" />
                        Mode Kecepatan Render Ekspor
                      </label>
                      <span className="text-[10px] text-amber-400 font-mono">
                        {speed === 'turbo' ? '⚡ 2x - 4x Lebih Cepat' : 'Standard Pacing'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSpeed('turbo')}
                        className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                          speed === 'turbo'
                            ? 'bg-gradient-to-r from-amber-950/60 to-orange-950/40 border-amber-500/80 ring-1 ring-amber-500/50 shadow-md'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${speed === 'turbo' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
                            <Rocket className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>Turbo Render</span>
                              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                                Cepat
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400">Zero-delay pipeline + frame burst</div>
                          </div>
                        </div>
                        {speed === 'turbo' && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setSpeed('normal')}
                        className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                          speed === 'normal'
                            ? 'bg-slate-800 border-cyan-500/80 ring-1 ring-cyan-500/50 shadow-md text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${speed === 'normal' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                            <Gauge className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>Standard</span>
                            </div>
                            <div className="text-[10px] text-slate-400">Pacing 1x real-time seimbang</div>
                          </div>
                        </div>
                        {speed === 'normal' && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Accuracy Notice */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Akurasi Audio-Visual 100%:</strong> Seluruh slide ({slideCount} foto), equalizer liquid, efek reaktif bass musik, dan lirik sinkron akan dibakar dengan sinkronisasi ketukan presisi menggunakan engine{' '}
                  <strong className="text-cyan-300">{engine === 'gpu' ? 'GPU Hardware' : 'CPU Software'}</strong> dalam format{' '}
                  <strong className="text-emerald-300">{format.toUpperCase()}</strong>.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isExporting && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/90">
            <span className="text-xs text-slate-400">
              Target: <strong className="text-slate-200">{format.toUpperCase()}</strong> ({engine === 'gpu' ? 'GPU' : 'CPU'}, {resolution.toUpperCase()}{format !== 'wav' ? `, ${fps} FPS` : ''}, {speed === 'turbo' ? '⚡ Turbo' : 'Standard'})
            </span>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleStart}
                className="px-5 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Mulai Render & Ekspor Video</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
