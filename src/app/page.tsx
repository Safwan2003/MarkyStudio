"use client";

import React, { useState } from "react";
import { Player } from "@remotion/player";
import { SaasExplainerTemplate } from "@/remotion/templates/SaasExplainer";
import { generateVideoScript, generateVideoAudio } from "./actions";
import { VideoScript } from "@/lib/types";

// Default placeholder script
const DEFAULT_SCRIPT: VideoScript = {
  title: "Example Video",
  globalStyle: {
    primaryColor: "#3B82F6",
    backgroundColor: "#000000",
    fontFamily: "Inter"
  },
  scenes: [
    {
      id: "1",
      type: "Intro",
      text: "Transform Reality",
      subText: "AI-Powered Video",
      voiceOverFragment: "Welcome to the future of video creation.",
      durationInSeconds: 3,
      audioUrl: "/generated/test.mp3" // Fallback if exists
    }
  ]
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<VideoScript>(DEFAULT_SCRIPT);
  const [status, setStatus] = useState("");

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setStatus("Generating Script...");

      const generatedScript = await generateVideoScript(prompt);

      setStatus("Generating Audio (this may take a moment)...");
      const scriptWithAudio = await generateVideoAudio(generatedScript);

      setScript(scriptWithAudio);
      setStatus("Ready!");
    } catch (e) {
      console.error(e);
      setStatus("Error: " + (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Controls */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            SaaS Video AI
          </h1>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">What is your product?</label>
            <textarea
              className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. A CRM for freelance designers that automates invoicing."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold transition-all"
          >
            {loading ? "Generating..." : "Generate Video"}
          </button>

          {status && (
            <div className="p-4 bg-gray-900 rounded-lg border border-gray-800 text-sm font-mono text-cyan-400">
              > {status}
            </div>
          )}

          <div className="p-4 bg-gray-900 rounded-lg border border-gray-800 h-96 overflow-y-auto font-mono text-xs">
            <pre>{JSON.stringify(script, null, 2)}</pre>
          </div>
        </div>

        {/* Player */}
        <div className="flex flex-col items-center justify-start space-y-4">
          <div className="w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800 relative">
            <Player
              component={AgencyComposition}
              inputProps={{ script }}
              durationInFrames={script.scenes.reduce((acc, s) => acc + (s.durationInSeconds || 5) * 30, 0)}
              compositionWidth={1920}
              compositionHeight={1080}
              fps={30}
              style={{
                width: '100%',
                height: '100%',
              }}
              controls
            />
          </div>
          <p className="text-gray-500 text-sm">
            Total Duration: {script.scenes.reduce((acc, s) => acc + (s.durationInSeconds || 5), 0)}s
          </p>
        </div>

      </div>
    </div>
  );
}
