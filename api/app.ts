import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { ZipArchive } from "archiver";

dotenv.config();

const app = express();

// Support large audio payloads for base64 audio processing
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Enable permissive CORS for Vercel preview and production environments
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );
  if (_req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  next();
});

// Lazy initialization of Gemini client
export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Router containing all API endpoints
const apiRouter = express.Router();

// Health check endpoint
apiRouter.get("/health", (_req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: "ok",
    app: "HAMA PRO EDITING",
    platform: process.env.VERCEL ? "vercel-serverless" : "node-server",
    geminiConfigured: hasKey,
    timestamp: new Date().toISOString(),
  });
});

/**
 * 1. Transcribe audio/music into timestamped lyrics lines
 */
apiRouter.post("/lyrics/transcribe", async (req, res) => {
  try {
    const { audioBase64, mimeType = "audio/mp3", fileName, audioDuration = 30, songTitle } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        success: false,
        error: "GEMINI_API_KEY is not configured on the server.",
      });
    }

    const duration = Math.max(5, Math.min(600, Number(audioDuration) || 30));

    // If audioBase64 is provided, transcribe with multimodal audio input
    if (audioBase64) {
      try {
        const audioPart = {
          inlineData: {
            mimeType: mimeType.includes("wav")
              ? "audio/wav"
              : mimeType.includes("webm")
              ? "audio/webm"
              : "audio/mp3",
            data: audioBase64,
          },
        };

        const prompt = `Transkripsikan audio lagu ini menjadi lirik lagu berurutan lengkap dengan perkiraan waktu mulai (startTime) dan waktu selesai (endTime) dalam detik (total durasi lagu adalah sekitar ${duration.toFixed(
          1
        )} detik).
Penting: 
- Tiap baris lirik harus memiliki startTime dan endTime yang sinkron dan bertahap dari awal hingga akhir durasi.
- Teks lirik harus rapi dan bersih.
- Jika lagu dominan instrumental atau kata-kata vokal minim, berikan lirik puitis/refrain ritmis yang indah sesuai beat musik.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-transcribe",
          contents: {
            parts: [audioPart, { text: prompt }],
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                lyrics: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      startTime: { type: Type.NUMBER, description: "Waktu mulai baris dalam detik" },
                      endTime: { type: Type.NUMBER, description: "Waktu selesai baris dalam detik" },
                      text: { type: Type.STRING, description: "Teks lirik lagu baris ini" },
                    },
                    required: ["startTime", "endTime", "text"],
                  },
                },
              },
              required: ["lyrics"],
            },
          },
        });

        const parsed = JSON.parse(response.text || "{}");
        if (parsed.lyrics && Array.isArray(parsed.lyrics) && parsed.lyrics.length > 0) {
          const formatted = parsed.lyrics.map((l: any, idx: number) => ({
            id: `lyric-${Date.now()}-${idx}`,
            startTime: Math.max(0, parseFloat(l.startTime) || 0),
            endTime: Math.max(parseFloat(l.startTime) + 1, parseFloat(l.endTime) || parseFloat(l.startTime) + 3),
            text: String(l.text || "").trim(),
          }));
          return res.json({ success: true, lyrics: formatted, title: parsed.title || fileName || "Lirik Musik" });
        }
      } catch (err) {
        console.warn("Direct audio transcription failed, falling back to smart rhythmic generator:", err);
      }
    }

    // Fallback or text-informed smart lyric generation
    const trackName = songTitle || fileName || "Lagu Musik Harmoni";
    const prompt = `Buatlah lirik lagu yang sangat indah, estetik, dan sinkron berirama untuk lagu berjudul "${trackName}".
Total durasi audio adalah tepat ${duration.toFixed(1)} detik.
Bagikan lirik menjadi sekitar ${Math.max(4, Math.min(24, Math.floor(duration / 3.5)))} baris berurutan secara merata dari detik 0.0 hingga ${duration.toFixed(1)} detik.
Pastikan startTime dan endTime mencakup seluruh rentang lagu tanpa tumpang tindih berlebihan.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            genre: { type: Type.STRING },
            lyrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  startTime: { type: Type.NUMBER },
                  endTime: { type: Type.NUMBER },
                  text: { type: Type.STRING },
                },
                required: ["startTime", "endTime", "text"],
              },
            },
          },
          required: ["lyrics"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    const formatted = (parsed.lyrics || []).map((l: any, idx: number) => ({
      id: `lyric-${Date.now()}-${idx}`,
      startTime: Math.max(0, parseFloat(l.startTime) || 0),
      endTime: Math.max(parseFloat(l.startTime) + 1, parseFloat(l.endTime) || parseFloat(l.startTime) + 3),
      text: String(l.text || "").trim(),
    }));

    return res.json({
      success: true,
      lyrics: formatted,
      title: parsed.title || trackName,
      genre: parsed.genre || "Pop/Cinematic",
    });
  } catch (error: any) {
    console.error("Transcribe error:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Gagal memproses lirik lagu",
    });
  }
});

/**
 * 2. Generate synchronized lyrics by topic/mood/genre for current song length
 */
apiRouter.post("/lyrics/generate-sync", async (req, res) => {
  try {
    const { topic = "Cinta & Perjalanan Hidup", mood = "emotif", duration = 30, language = "id" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        success: false,
        error: "GEMINI_API_KEY is not configured on the server.",
      });
    }

    const dur = Math.max(5, Math.min(600, Number(duration) || 30));
    const lineCount = Math.max(4, Math.min(24, Math.floor(dur / 3.2)));

    const prompt = `Buatkan lirik lagu yang sangat puitis dan keren dalam bahasa ${
      language === "id" ? "Indonesia" : "Inggris"
    }.
Tema/Mood: ${topic} (${mood}).
Durasi total audio: ${dur.toFixed(1)} detik.
Jumlah baris: tepat sekitar ${lineCount} baris.
Berikan timestamps startTime dan endTime dalam detik untuk setiap baris agar pas dinyanyikan mengikuti ritme audio dari 0.0s sampai ${dur.toFixed(
      1
    )}s.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            lyrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  startTime: { type: Type.NUMBER },
                  endTime: { type: Type.NUMBER },
                  text: { type: Type.STRING },
                },
                required: ["startTime", "endTime", "text"],
              },
            },
          },
          required: ["lyrics"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    const formatted = (parsed.lyrics || []).map((l: any, idx: number) => ({
      id: `lyric-gen-${Date.now()}-${idx}`,
      startTime: Math.max(0, parseFloat(l.startTime) || 0),
      endTime: Math.max(parseFloat(l.startTime) + 0.8, parseFloat(l.endTime) || parseFloat(l.startTime) + 2.5),
      text: String(l.text || "").trim(),
    }));

    return res.json({
      success: true,
      lyrics: formatted,
      title: parsed.title || topic,
    });
  } catch (error: any) {
    console.error("Generate lyrics error:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Gagal membuat lirik lagu",
    });
  }
});

/**
 * 3. Distribute user-provided text/lyrics evenly across song duration
 */
apiRouter.post("/lyrics/sync-text", async (req, res) => {
  try {
    const { rawText = "", duration = 30 } = req.body;
    const lines = String(rawText)
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      return res.status(400).json({ success: false, error: "Teks lirik kosong." });
    }

    const dur = Math.max(5, Number(duration) || 30);
    const step = dur / lines.length;

    const formatted = lines.map((text, idx) => {
      const start = parseFloat((idx * step).toFixed(2));
      const end = parseFloat(Math.min(dur, (idx + 1) * step).toFixed(2));
      return {
        id: `lyric-custom-${Date.now()}-${idx}`,
        startTime: start,
        endTime: end,
        text,
      };
    });

    return res.json({ success: true, lyrics: formatted });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || "Gagal sinkronisasi teks lirik" });
  }
});

/**
 * 4. Download entire project as a clean ZIP package ready for building Windows .EXE
 */
apiRouter.get("/download-project-zip", async (_req, res) => {
  try {
    const rootDir = process.cwd();
    const zipFileName = `HAMA_PRO_EDITING_WINDOWS_EXE_SOURCE_${Date.now()}.zip`;

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${zipFileName}"`);

    const archive = new ZipArchive({
      zlib: { level: 6 },
    });

    archive.on("error", (err: any) => {
      console.error("Archive zip error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Gagal membuat file ZIP project" });
      }
    });

    archive.pipe(res);

    // List of files and folders to ignore in ZIP to keep it lightweight and clean
    const excludedPatterns = new Set([
      "node_modules",
      "dist",
      "dist_electron",
      ".git",
      ".env",
      ".aistudio",
      ".system_generated",
      ".vite",
    ]);

    function addDirectoryToArchive(dirPath: string, zipSubDir: string = "") {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const name = entry.name;
        if (excludedPatterns.has(name) || name.startsWith(".cache")) {
          continue;
        }

        const fullPath = path.join(dirPath, name);
        const zipEntryPath = zipSubDir ? `${zipSubDir}/${name}` : name;

        if (entry.isDirectory()) {
          addDirectoryToArchive(fullPath, zipEntryPath);
        } else if (entry.isFile()) {
          archive.file(fullPath, { name: zipEntryPath });
        }
      }
    }

    addDirectoryToArchive(rootDir);

    await archive.finalize();
  } catch (error: any) {
    console.error("Zip generation error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error?.message || "Gagal membuat file ZIP" });
    }
  }
});

// Dual-mount router to handle both /api/xxx and /xxx (in case Vercel rewrites strip /api)
app.use("/api", apiRouter);
app.use("/", apiRouter);

export default app;
