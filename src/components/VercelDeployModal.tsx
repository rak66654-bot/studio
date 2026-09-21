import React, { useState } from 'react';
import {
  X,
  Check,
  Copy,
  ExternalLink,
  Globe,
  Github,
  Terminal,
  Sparkles,
  Monitor,
  PackageCheck,
  Play,
  FileCode,
  Layers,
  Download,
  FolderArchive,
  Loader2,
} from 'lucide-react';

interface VercelDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelDeployModal: React.FC<VercelDeployModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'exe' | 'vercel'>('exe');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const gitCommands = `# 1. Inisialisasi Git di folder project
git init

# 2. Tambahkan semua file dan buat commit
git add .
git commit -m "feat: inisialisasi HAMA PRO EDITING siap deploy Vercel"

# 3. Ganti dengan URL repositori GitHub Anda
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA_REPO.git

# 4. Upload ke GitHub
git push -u origin main`;

  const exeBuildCommands = `# 1. Install dependensi
npm install

# 2. Build aplikasi dan paketkan menjadi file .EXE installer & portable
npm run build:exe

# File .exe akan otomatis tersedia di folder dist_electron/`;

  const localRunCommands = `# 1. Install dependensi (hanya pertama kali)
npm install

# 2. Jalankan server lokal
npm run dev

# Buka browser di http://localhost:3000`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
              {activeTab === 'exe' ? <Monitor className="w-5 h-5 text-white" /> : <Globe className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Jalankan di PC Lokal, .EXE & Vercel
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Pilih opsi menjalankan di PC Windows (.exe) atau deploy online ke Vercel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('exe')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition border-b-2 ${
              activeTab === 'exe'
                ? 'border-cyan-500 text-cyan-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>🖥️ PC Lokal & Buat .EXE</span>
          </button>
          <button
            onClick={() => setActiveTab('vercel')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition border-b-2 ${
              activeTab === 'vercel'
                ? 'border-indigo-500 text-indigo-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>🌐 Deploy Vercel (GitHub)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {activeTab === 'exe' ? (
            /* TAB 1: PC LOKAL & BUILD .EXE */
            <div className="space-y-6">
              {/* Instant ZIP Download Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 border border-emerald-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <FolderArchive className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      Download File ZIP Proyek (Siap Jadikan .EXE)
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                        Windows Ready
                      </span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Paket ZIP lengkap berisi source code, file <code className="text-emerald-300 font-mono">build-exe.bat</code>, icon aplikasi, dan konfigurasi Electron.
                    </p>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    if (isDownloadingZip) return;
                    setIsDownloadingZip(true);
                    try {
                      const response = await fetch('/api/download-project-zip');
                      if (!response.ok) throw new Error('Gagal mengunduh file ZIP');
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `HAMA_PRO_EDITING_WINDOWS_EXE_SOURCE_${Date.now()}.zip`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      window.URL.revokeObjectURL(url);
                    } catch (err) {
                      console.error('Download error:', err);
                      // Fallback direct navigation if blob fails
                      window.location.href = '/api/download-project-zip';
                    } finally {
                      setIsDownloadingZip(false);
                    }
                  }}
                  className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/50 border border-emerald-400/30 transition transform active:scale-95 cursor-pointer"
                >
                  {isDownloadingZip ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sedang Mengemas ZIP...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download File ZIP Proyek</span>
                    </>
                  )}
                </button>
              </div>

              {/* Feature summary cards */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[11px] font-bold text-cyan-400 flex items-center gap-1.5 mb-1">
                    <Play className="w-3.5 h-3.5" /> 1-Click Run
                  </div>
                  <div className="text-[11px] text-slate-300">File <code className="text-white">start-windows.bat</code> siap double-click</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                    <PackageCheck className="w-3.5 h-3.5" /> Build .EXE
                  </div>
                  <div className="text-[11px] text-slate-300">File <code className="text-white">build-exe.bat</code> otomatis membuat installer</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[11px] font-bold text-purple-400 flex items-center gap-1.5 mb-1">
                    <Layers className="w-3.5 h-3.5" /> Electron Shell
                  </div>
                  <div className="text-[11px] text-slate-300"><code className="text-white">electron/main.cjs</code> terkonfigurasi</div>
                </div>
              </div>

              {/* OPTION 1: Cara Cepat Jalankan di Windows (Tanpa Compile) */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-cyan-300 text-xs">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">
                      1
                    </span>
                    <span>CARA PALING CEPAT: Jalankan di PC Lokal (1-Click)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                    Sangat Direkomendasikan
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Di dalam folder project yang Anda download, sudah tersedia file <b><code className="text-cyan-400 font-mono">start-windows.bat</code></b>:
                </p>
                <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside pl-1">
                  <li>Pastikan <b>Node.js</b> sudah terpasang di PC Anda (unduh di <a href="https://nodejs.org" target="_blank" rel="noreferrer" className="text-cyan-400 underline">nodejs.org</a> jika belum ada).</li>
                  <li>Cukup <b>Double-Click</b> file <b><code className="text-cyan-300 font-mono">start-windows.bat</code></b>.</li>
                  <li>Aplikasi akan otomatis menginstal dependensi dan membuka browser di <b><code className="text-white font-mono">http://localhost:3000</code></b>.</li>
                </ol>
              </div>

              {/* OPTION 2: Membuat File Standalone .EXE Installer */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-indigo-300 text-xs">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">
                      2
                    </span>
                    <span>Jadikan File Standalone .EXE (Installer & Portable)</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(exeBuildCommands, 'exe')}
                    className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    {copiedKey === 'exe' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'exe' ? 'Tersalin!' : 'Salin Perintah'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Untuk menghasilkan file <b>.exe</b> yang bisa dibagikan dan diinstal di komputer mana saja tanpa perlu membuka browser:
                </p>
                <div className="p-3 rounded-lg bg-slate-900 font-mono text-[11px] text-indigo-200 border border-slate-800">
                  <pre className="whitespace-pre overflow-x-auto leading-relaxed">{exeBuildCommands}</pre>
                </div>
                <p className="text-[11px] text-slate-400">
                  <b>Tips Praktis:</b> Anda juga bisa langsung men-double-click file <b><code className="text-white font-mono">build-exe.bat</code></b> di Windows Explorer untuk kompilasi otomatis! Hasilnya berupa file <code className="text-emerald-300 font-mono">HAMA PRO EDITING-1.0.0-win-x64.exe</code> di folder <code className="text-emerald-300 font-mono">dist_electron/</code>.
                </p>
              </div>

              {/* OPTION 3: Menjalankan via Terminal / CMD biasa */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-slate-300 text-xs">
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <span>Perintah Terminal Manual (CMD / PowerShell)</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(localRunCommands, 'local')}
                    className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    {copiedKey === 'local' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'local' ? 'Tersalin!' : 'Salin'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 font-mono text-[11px] text-slate-300 border border-slate-800">
                  <pre className="whitespace-pre overflow-x-auto">{localRunCommands}</pre>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: DEPLOY VERCEL VIA GITHUB */
            <div className="space-y-6">
              {/* Status Badges */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium text-slate-300 truncate">vercel.json</div>
                    <div className="text-[10px] text-emerald-400">Terkonfigurasi</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium text-slate-300 truncate">api/index.ts</div>
                    <div className="text-[10px] text-emerald-400">Serverless AI Ready</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium text-slate-300 truncate">Build Output</div>
                    <div className="text-[10px] text-emerald-400">dist (Vite 60FPS)</div>
                  </div>
                </div>
              </div>

              {/* STEP 1: Git Push */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-slate-200 text-xs">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">
                      1
                    </span>
                    <Github className="w-4 h-4 text-indigo-400" />
                    <span>Upload Kode ke Repositori GitHub</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(gitCommands, 'git')}
                    className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    {copiedKey === 'git' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'git' ? 'Tersalin!' : 'Salin Perintah'}</span>
                  </button>
                </div>
                <div className="relative rounded-xl bg-slate-950 p-3.5 font-mono text-xs text-slate-300 border border-slate-800/80">
                  <pre className="overflow-x-auto whitespace-pre leading-relaxed text-[11px] text-indigo-200/90">
                    {gitCommands}
                  </pre>
                </div>
              </div>

              {/* STEP 2: Import to Vercel */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-slate-200 text-xs">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">
                    2
                  </span>
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Import Project di Vercel Dashboard</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-2">
                  <p>
                    1. Buka{' '}
                    <a
                      href="https://vercel.com/new"
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline font-medium inline-flex items-center gap-0.5"
                    >
                      vercel.com/new <ExternalLink className="w-3 h-3" />
                    </a>{' '}
                    dan login dengan akun GitHub Anda.
                  </p>
                  <p>2. Pilih repositori GitHub yang baru saja Anda buat, lalu klik tombol <b>Import</b>.</p>
                  <p className="text-slate-400">
                    Framework preset (<code className="text-cyan-300 font-mono">Vite</code>) dan build output (<code className="text-cyan-300 font-mono">dist</code>) akan otomatis terdeteksi dari file <code className="text-slate-200 font-mono">vercel.json</code>.
                  </p>
                </div>
              </div>

              {/* STEP 3: Environment Variable */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-slate-200 text-xs">
                  <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-xs">
                    3
                  </span>
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>Environment Variable untuk Fitur AI (Opsional)</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-2">
                  <p>
                    Pada bagian <b>Environment Variables</b> di halaman konfigurasi Vercel:
                  </p>
                  <div className="flex items-center gap-2 font-mono bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 text-[11px]">
                    <span className="text-pink-400">GEMINI_API_KEY</span>
                    <span className="text-slate-500">=</span>
                    <span className="text-slate-400">AIzaSy... (API Key dari Google AI Studio)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Jika tanpa API key, seluruh fungsi video equalizer, slide foto, efek video, pemutar lagu, dan lirik manual tetap bekerja normal 100%!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <span className="text-xs text-slate-400">
            File instruksi lengkap juga ada di <code className="text-slate-200 font-mono">README.md</code>
          </span>
          <div className="flex items-center gap-2">
            {activeTab === 'vercel' && (
              <a
                href="https://vercel.com/new"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-md flex items-center gap-1.5 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Vercel</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
