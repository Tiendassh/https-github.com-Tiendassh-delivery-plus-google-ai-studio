import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dns from "dns";
import dotenv from "dotenv";

dotenv.config();

// Fix dns resolution issues if they occur
dns.setDefaultResultOrder("ipv4first");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ElevenLabs Text-to-Speech Proxy Route
  app.post("/api/elevenlabs/tts", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text parameter is required." });
      }

      // Get key from request headers, request body, env of server, or fallback
      const customKey = req.headers["x-elevenlabs-key"] || req.body.apiKey;
      const apiKey = typeof customKey === "string" && customKey.trim() !== "" 
        ? customKey.trim() 
        : (process.env.ELEVENLABS_API_KEY || "7b55c915bb8d4340967067f22da1d64c3735e244df78448274519ae7a112afef");
      
      const voiceId = typeof req.body.voiceId === "string" && req.body.voiceId.trim() !== ""
        ? req.body.voiceId.trim()
        : "4wDRKlxcHNOFO5kBvE81"; // Default Voice ID provided by the user
      
      const elevenlabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

      console.log(`ElevenLabs Proxy Request: "${text.substring(0, 60)}..." using Voice ID: ${voiceId}`);

      const response = await fetch(elevenlabsUrl, {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("ElevenLabs API Call Failed:", errText);

        const isPaymentRequired = response.status === 402 || 
          errText.includes("paid_plan_required") || 
          errText.includes("payment_required") || 
          errText.includes("library voices");

        if (isPaymentRequired) {
          // Fallback to official default pre-made voices which are free and don't require custom subscriptions
          let fallbackVoiceId = "21m00Tcm4TlvDq8ikWAM"; // Rachel (female)
          const voiceProfile = req.body.voiceProfile || "";
          
          if (voiceProfile === "carlos") {
            fallbackVoiceId = "ErXwobaYWBteAsidvWS9"; // Antoni (male)
          } else if (voiceProfile === "vendedor_bot") {
            fallbackVoiceId = "pNInz6obpgfr9S92pWrH"; // Adam (male)
          } else if (voiceProfile === "agustina") {
            fallbackVoiceId = "21m00Tcm4TlvDq8ikWAM"; // Rachel (female)
          } else {
            // Default based on original requested voice
            fallbackVoiceId = "ErXwobaYWBteAsidvWS9"; // Antoni (male)
          }

          console.log(`ElevenLabs subscription limit hit for Library Voice. Retrying with free-tier compatible Voice ID: ${fallbackVoiceId}`);
          
          const retryUrl = `https://api.elevenlabs.io/v1/text-to-speech/${fallbackVoiceId}`;
          const retryResponse = await fetch(retryUrl, {
            method: "POST",
            headers: {
              "xi-api-key": apiKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: text,
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
                style: 0.0,
                use_speaker_boost: true
              }
            }),
          });

          if (retryResponse.ok) {
            const arrayBuffer = await retryResponse.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            res.setHeader("Content-Type", "audio/mpeg");
            res.setHeader("Content-Length", buffer.length);
            res.setHeader("x-applied-fallback-voice", "true");
            res.setHeader("x-fallback-used-id", fallbackVoiceId);
            return res.send(buffer);
          } else {
            const retryErrText = await retryResponse.text();
            console.error("Fallback ElevenLabs API Call also failed:", retryErrText);
            return res.status(retryResponse.status).json({
              error: "ElevenLabs API error response (Fallback)",
              details: retryErrText
            });
          }
        }

        return res.status(response.status).json({
          error: "ElevenLabs API error response",
          details: errText
        });
      }

      // Read audio data and return it as professional audio stream
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Content-Length", buffer.length);
      res.send(buffer);

    } catch (err: any) {
      console.error("Exception in ElevenLabs TTS API Route:", err);
      res.status(500).json({ error: "Internal Server Error", message: err.message });
    }
  });

  // Simple API health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", serverMode: "Full-Stack Express + Vite Integration" });
  });

  // Apply Vite middlewares in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting up on http://localhost:${PORT}`);
  });
}

startServer();
