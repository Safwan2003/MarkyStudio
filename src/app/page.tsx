
"use client";

import { useState, useRef } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { PretaaTemplate } from "@/remotion/templates/Pretaa";
import { ViableTemplate } from "@/remotion/templates/Viable";
import { JustCallTemplate } from "@/remotion/templates/JustCall";
import { DesklogTemplate } from "@/remotion/templates/Desklog";
import { FronterTemplate } from "@/remotion/templates/Fronter";
import { generateVideoScript, generateVideoAudio, analyzeScreenshotsAndCreateSubscenes, TemplateType } from "./actions";
import { VideoScript, Subscene } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { ScreenshotUploader } from "@/components/ScreenshotUploader";
import { SubscenePreview } from "@/components/SubscenePreview";

// Default placeholder script for Fronter
const DEFAULT_SCRIPT: VideoScript = {
  brandName: "Fronter AI",
  globalDesign: {
    primaryColor: "#2563EB",
    secondaryColor: "#1e293b",
    accentColor: "#f59e0b",
    backgroundColor: "#ffffff",
    textColor: "#0f172a",
    headingFont: "Inter",
    bodyFont: "Inter"
  },
  scenes: [
    {
      id: "1",
      type: "hook",
      mainText: "Feedback Loop Chaos",
      subText: "Stop hunting for final assets",
      voiceoverScript: "Is your agency stuck in a feedback loop chaos?",
      duration: 5,
    },
    {
      id: "2",
      type: "problem",
      mainText: "Too many cooks?",
      subText: "Zero coordination.",
      voiceoverScript: "Too many stakeholders, too little coordination.",
      duration: 5,
    },
    {
      id: "3",
      type: "solution",
      mainText: "Meet Fronter",
      subText: "Launch Project",
      voiceoverScript: "Enter Fronter. The unified OS for your agency.",
      duration: 5,
    },
    {
      id: "4",
      type: "showcase",
      mainText: "Complete Control",
      voiceoverScript: "Manage projects, assets, and teams in one place.",
      duration: 6,
    },
    {
      id: "5",
      type: "social_proof",
      mainText: "Trusted by Agencies",
      voiceoverScript: "Join hundreds of top-tier agencies moving faster with Fronter.",
      duration: 5,
      testimonials: [
        { quote: "Fronter cut our feedback loops in half.", author: "Sarah J., Creative Director" }
      ]
    },
    {
      id: "6",
      type: "cta",
      mainText: "Agency OS",
      ctaText: "Get Started",
      voiceoverScript: "Upgrade your agency to Fronter today.",
      duration: 5,
    }
  ]
};

// --- Scene Timeline Component ---
const SceneTimeline = ({ scenes, totalDuration, selectedIndex, onSceneClick }: { scenes: any[], totalDuration: number, selectedIndex: number | null, onSceneClick?: (index: number, time: number) => void }) => {
  return (
    <div className="w-full h-12 flex gap-1 mt-4 relative group">
      {scenes.map((scene, idx) => {
        const widthPercent = ((scene.duration || 5) / totalDuration) * 100;
        const isSelected = selectedIndex === idx;
        return (
          <div
            key={idx}
            className={`h-full border first:rounded-l-lg last:rounded-r-lg relative overflow-hidden transition-all cursor-pointer group/scene ${isSelected ? 'bg-indigo-500/30 border-indigo-500 z-10' : 'bg-zinc-900 border-white/10 hover:bg-zinc-800'}`}
            style={{ width: `${widthPercent}%` }}
            onClick={() => {
              let startTime = 0;
              for (let i = 0; i < idx; i++) {
                startTime += (scenes[i].duration || 5);
              }
              onSceneClick?.(idx, startTime);
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center p-1">
              <span className={`text-[10px] font-mono truncate transition-colors ${isSelected ? 'text-white' : 'text-gray-500 group-hover/scene:text-white'}`}>
                {scene.type.replace('_', ' ')}
              </span>
            </div>
            {isSelected && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500" />}
          </div>
        )
      })}
    </div>
  );
};

export default function Home() {
  const [prompt, setPrompt] = useState("Fronter is an AI-powered operating system for modern creative agencies. It centralizes feedback, project management, and asset delivery into one sleek dashboard. It eliminates 'feedback loop chaos' and helps teams stay coordinated.");
  const [productUrl, setProductUrl] = useState("https://fronter.ai/");
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardStep, setWizardStep] = useState<'aesthetic' | 'screenshots' | 'prompt'>('aesthetic');
  const [script, setScript] = useState<VideoScript>(DEFAULT_SCRIPT);
  const [status, setStatus] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('Fronter');
  const [loading, setLoading] = useState(false);
  const [uploadedScreenshots, setUploadedScreenshots] = useState<File[]>([]);
  const [screenshotUrls, setScreenshotUrls] = useState<string[]>([]);
  const [generatedSubscenes, setGeneratedSubscenes] = useState<Subscene[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number | null>(null);

  const playerRef = useRef<PlayerRef>(null);

  const handleGenerate = async () => {
    try {
      setCurrentStep(1);
      setStatus("🧠 Creative Director is brainstorming script...");

      const fullPrompt = `Product URL: ${productUrl}\n\nDescription:\n${prompt}`;
      const generatedScript = await generateVideoScript(fullPrompt, selectedTemplate);

      setStatus("🎙️ Recording Voiceovers (AI)...");
      const scriptWithAudio = await generateVideoAudio(generatedScript, selectedTemplate);

      setScript(scriptWithAudio);
      setStatus("✨ Rendering Preview...");
      setCurrentStep(2);
    } catch (e) {
      console.error(e);
      setCurrentStep(0);
      alert("Error: " + (e as Error).message);
    }
  };

  const TEMPLATES = {
    'Pretaa': PretaaTemplate,
    'Viable': ViableTemplate,
    'JustCall': JustCallTemplate,
    'Desklog': DesklogTemplate,
    'Fronter': FronterTemplate,
  };
  const TemplateComponent = TEMPLATES[selectedTemplate];

  const totalDuration = script.scenes.reduce((acc, s) => acc + (s.duration || 5), 0);

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-indigo-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black pointer-events-none z-0" />

      <header className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/20 cursor-pointer" onClick={() => setCurrentStep(0)}>M</div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Marky Studio</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto p-6 mt-6 box-border">

        {currentStep === 0 && (
          <div className={`mx-auto transition-all duration-500 ${wizardStep === 'screenshots' ? 'max-w-7xl' : 'max-w-5xl'}`}>
            <AnimatePresence mode="wait">
              {wizardStep === 'aesthetic' && (
                <motion.div
                  key="aesthetic"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold">Choose your aesthetic.</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Fronter */}
                    <div
                      onClick={() => setSelectedTemplate('Fronter')}
                      className={`relative group aspect-video rounded-3xl border-2 transition-all overflow-hidden cursor-pointer ${selectedTemplate === 'Fronter' ? 'border-yellow-500 shadow-2xl shadow-yellow-500/20' : 'border-white/10 hover:border-white/30'}`}
                    >
                      <div className="absolute inset-x-0 bottom-0 p-6 z-10 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="text-xl font-bold mb-1 flex items-center gap-2 text-yellow-500">💠 Fronter</div>
                        <p className="text-xs text-gray-300">Agency Quality, Collaborative Chaos.</p>
                      </div>
                    </div>

                    {/* Desklog */}
                    <div
                      onClick={() => setSelectedTemplate('Desklog')}
                      className={`relative group aspect-video rounded-3xl border-2 transition-all overflow-hidden cursor-pointer ${selectedTemplate === 'Desklog' ? 'border-emerald-500 shadow-2xl shadow-emerald-500/20' : 'border-white/10 hover:border-white/30'}`}
                    >
                      <div className="absolute inset-x-0 bottom-0 p-6 z-10 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="text-xl font-bold mb-1 flex items-center gap-2 text-emerald-500">⏱️ Desklog</div>
                        <p className="text-xs text-gray-300">Clean Productivity, Emerald Theme.</p>
                      </div>
                    </div>

                    {/* Pretaa */}
                    <div
                      onClick={() => setSelectedTemplate('Pretaa')}
                      className={`relative group aspect-video rounded-3xl border-2 transition-all overflow-hidden cursor-pointer ${selectedTemplate === 'Pretaa' ? 'border-indigo-500 shadow-2xl shadow-indigo-500/20' : 'border-white/10 hover:border-white/30'}`}
                    >
                      <div className="absolute inset-x-0 bottom-0 p-6 z-10 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="text-xl font-bold mb-1 flex items-center gap-2 text-indigo-500">🌌 Pretaa</div>
                        <p className="text-xs text-gray-300">Isometric 3D, High-Tech Dark Mode.</p>
                      </div>
                    </div>

                    {/* Viable */}
                    <div
                      onClick={() => setSelectedTemplate('Viable')}
                      className={`relative group aspect-video rounded-3xl border-2 transition-all overflow-hidden cursor-pointer ${selectedTemplate === 'Viable' ? 'border-slate-400 shadow-2xl shadow-slate-400/20' : 'border-white/10 hover:border-white/30'}`}
                    >
                      <div className="absolute inset-x-0 bottom-0 p-6 z-10 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="text-xl font-bold mb-1 flex items-center gap-2 text-slate-200">⚪ Viable</div>
                        <p className="text-xs text-gray-300">Minimalist Flat, Apple-Style Light.</p>
                      </div>
                    </div>

                    {/* JustCall */}
                    <div
                      onClick={() => setSelectedTemplate('JustCall')}
                      className={`relative group aspect-video rounded-3xl border-2 transition-all overflow-hidden cursor-pointer ${selectedTemplate === 'JustCall' ? 'border-pink-500 shadow-2xl shadow-pink-500/20' : 'border-white/10 hover:border-white/30'}`}
                    >
                      <div className="absolute inset-x-0 bottom-0 p-6 z-10 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="text-xl font-bold mb-1 flex items-center gap-2 text-pink-500">⚡ JustCall</div>
                        <p className="text-xs text-gray-300">Kinetic Typography, Energetic Vibez.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center pt-4 gap-4">
                    <button
                      onClick={() => setWizardStep('screenshots')}
                      className="px-8 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-100 transition"
                    >
                      Add Interactive Showcase →
                    </button>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-8 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                    >
                      Skip to Preview →
                    </button>
                  </div>
                </motion.div>
              )}

              {wizardStep === 'screenshots' && (
                <motion.div
                  key="screenshots"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center space-y-2">
                    <button
                      onClick={() => setWizardStep('aesthetic')}
                      className="text-sm text-gray-400 hover:text-white mb-4 inline-flex items-center gap-2"
                    >
                      ← Back to Templates
                    </button>
                    <h2 className="text-3xl font-bold">Upload Product Screenshots</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                      Upload screenshots of your digital product UI. Our AI will analyze them and create
                      an interactive demonstration with cursor animations.
                    </p>
                  </div>

                  <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8">
                    <ScreenshotUploader
                      maxFiles={5}
                      onUploadComplete={async (files) => {
                        setUploadedScreenshots(files);
                        setLoading(true);

                        try {
                          // Create FormData for server action
                          const formData = new FormData();
                          files.forEach((file, index) => {
                            formData.append(`screenshot-${index}`, file);
                          });

                          // Analyze screenshots and generate subscenes
                          const subscenes = await analyzeScreenshotsAndCreateSubscenes(formData);
                          setGeneratedSubscenes(subscenes);

                          // Create screenshot URLs for preview
                          const urls = files.map(file => URL.createObjectURL(file));
                          setScreenshotUrls(urls);

                          // Show preview instead of immediately adding to video
                          setShowPreview(true);

                        } catch (error) {
                          console.error('Screenshot analysis failed:', error);
                          alert('Failed to analyze screenshots. Please try again.');
                        } finally {
                          setLoading(false);
                        }
                      }}
                    />
                  </div>

                  {loading && (
                    <div className="text-center space-y-3">
                      <div className="inline-block w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <p className="text-sm text-gray-400">Analyzing screenshots with Llama 4 Scout Vision...</p>
                    </div>
                  )}

                  {/* Preview Generated Subscenes */}
                  {showPreview && generatedSubscenes.length > 0 && (
                    <div className="mt-8">
                      <SubscenePreview
                        subscenes={generatedSubscenes}
                        originalScreenshots={screenshotUrls}
                        onApprove={() => {
                          // Create a new interactive_showcase scene
                          const showcaseScene = {
                            id: `showcase-${Date.now()}`,
                            type: 'interactive_showcase' as const,
                            mainText: 'Interactive Product Demo',
                            subText: 'See it in action',
                            voiceoverScript: `Watch how our product works through this interactive demonstration.`,
                            duration: generatedSubscenes.reduce((acc, sub) => acc + sub.duration, 0),
                            subscenes: generatedSubscenes
                          };

                          // Insert showcase scene after solution, before CTA
                          const updatedScript = { ...script };
                          const insertIndex = updatedScript.scenes.findIndex(s => s.type === 'cta');
                          updatedScript.scenes.splice(
                            insertIndex > -1 ? insertIndex : updatedScript.scenes.length,
                            0,
                            showcaseScene
                          );

                          setScript(updatedScript);

                          alert(`✅ Created interactive showcase with ${generatedSubscenes.length} subscenes!`);
                          setCurrentStep(2); // Go to preview
                        }}
                        onReject={() => {
                          // Reset and allow re-upload
                          setShowPreview(false);
                          setGeneratedSubscenes([]);
                          setUploadedScreenshots([]);
                          setScreenshotUrls([]);
                        }}
                      />
                    </div>
                  )}

                  <div className="flex justify-center pt-4">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-8 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                    >
                      Skip to Preview →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {currentStep === 1 && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin" />
            </div>
            <h3 className="text-2xl font-bold animate-pulse">{status || 'Processing...'}</h3>
          </div>
        )}

        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-8">
              <div className="bg-[#050505] border border-white/10 rounded-3xl p-2 shadow-2xl">
                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-zinc-950 relative">
                  <Player
                    ref={playerRef}
                    component={TemplateComponent as any}
                    inputProps={{ plan: script }}
                    durationInFrames={Math.ceil(Math.max(1, totalDuration * 30))}
                    compositionWidth={1920}
                    compositionHeight={1080}
                    fps={30}
                    style={{ width: '100%', height: '100%' }}
                    controls
                    autoPlay
                    acknowledgeRemotionLicense
                  />
                </div>
              </div>

              <SceneTimeline
                scenes={script.scenes}
                totalDuration={totalDuration}
                selectedIndex={selectedSceneIndex}
                onSceneClick={(idx, time) => {
                  setSelectedSceneIndex(idx);
                  if (playerRef.current) playerRef.current.seekTo(time * 30);
                }}
              />
            </div>

            <div className="lg:col-span-4 space-y-6">
              {/* Scene Editor */}
              <div className="p-6 border border-white/10 bg-zinc-900/50 backdrop-blur-sm rounded-2xl space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">Scene Editor</h3>
                  {selectedSceneIndex !== null && (
                    <span className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-full font-mono">
                      Scene {selectedSceneIndex + 1}
                    </span>
                  )}
                </div>

                {selectedSceneIndex === null ? (
                  <p className="text-gray-500 text-sm">Select a scene in the timeline to edit its contents.</p>
                ) : (
                  <div className="space-y-4">
                    {/* Editor inputs will go here */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Main Text</label>
                      <input
                        type="text"
                        className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none transition-colors"
                        value={script.scenes[selectedSceneIndex].mainText || ""}
                        onChange={(e) => {
                          const newScenes = [...script.scenes];
                          newScenes[selectedSceneIndex] = { ...newScenes[selectedSceneIndex], mainText: e.target.value };
                          setScript({ ...script, scenes: newScenes });
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Sub Text</label>
                      <input
                        type="text"
                        className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none transition-colors"
                        value={script.scenes[selectedSceneIndex].subText || ""}
                        onChange={(e) => {
                          const newScenes = [...script.scenes];
                          newScenes[selectedSceneIndex] = { ...newScenes[selectedSceneIndex], subText: e.target.value };
                          setScript({ ...script, scenes: newScenes });
                        }}
                      />
                    </div>

                    {(script.scenes[selectedSceneIndex].type === 'intro' || script.scenes[selectedSceneIndex].type === 'cta') && (
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">CTA Text</label>
                        <input
                          type="text"
                          className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none transition-colors"
                          value={script.scenes[selectedSceneIndex].ctaText || ""}
                          onChange={(e) => {
                            const newScenes = [...script.scenes];
                            newScenes[selectedSceneIndex] = { ...newScenes[selectedSceneIndex], ctaText: e.target.value };
                            setScript({ ...script, scenes: newScenes });
                          }}
                        />
                      </div>
                    )}

                    {/* Screenshot Upload Helpers */}
                    <div className="pt-2 space-y-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Desktop Screenshot</label>
                          {script.scenes[selectedSceneIndex].screenshotUrl && (
                            <button
                              onClick={() => {
                                const newScenes = [...script.scenes];
                                delete newScenes[selectedSceneIndex].screenshotUrl;
                                setScript({ ...script, scenes: newScenes });
                              }}
                              className="text-[10px] text-red-400 hover:text-red-300 transition-colors"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          id="desktop-upload"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const newScenes = [...script.scenes];
                                newScenes[selectedSceneIndex] = { ...newScenes[selectedSceneIndex], screenshotUrl: event.target?.result as string };
                                setScript({ ...script, scenes: newScenes });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <label htmlFor="desktop-upload" className="relative group flex flex-col items-center justify-center gap-2 p-1 border border-dashed border-white/20 rounded-lg hover:border-indigo-500/50 hover:bg-indigo-500/5 cursor-pointer transition-all overflow-hidden min-h-[80px]">
                          {script.scenes[selectedSceneIndex].screenshotUrl ? (
                            <img src={script.scenes[selectedSceneIndex].screenshotUrl} className="w-full h-full object-contain max-h-[120px] rounded" alt="Preview" />
                          ) : (
                            <span className="text-sm text-gray-400 py-4">Click to upload Desktop view</span>
                          )}
                        </label>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Mobile Screenshot</label>
                          {script.scenes[selectedSceneIndex].mobileScreenshotUrl && (
                            <button
                              onClick={() => {
                                const newScenes = [...script.scenes];
                                delete newScenes[selectedSceneIndex].mobileScreenshotUrl;
                                setScript({ ...script, scenes: newScenes });
                              }}
                              className="text-[10px] text-red-400 hover:text-red-300 transition-colors"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          id="mobile-upload"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const newScenes = [...script.scenes];
                                newScenes[selectedSceneIndex] = { ...newScenes[selectedSceneIndex], mobileScreenshotUrl: event.target?.result as string };
                                setScript({ ...script, scenes: newScenes });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <label htmlFor="mobile-upload" className="relative group flex flex-col items-center justify-center gap-2 p-1 border border-dashed border-white/20 rounded-lg hover:border-indigo-500/50 hover:bg-indigo-500/5 cursor-pointer transition-all overflow-hidden min-h-[80px]">
                          {script.scenes[selectedSceneIndex].mobileScreenshotUrl ? (
                            <img src={script.scenes[selectedSceneIndex].mobileScreenshotUrl} className="w-full h-full object-contain max-h-[120px] rounded" alt="Preview" />
                          ) : (
                            <span className="text-sm text-gray-400 py-4">Click to upload Mobile view</span>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border border-white/5 bg-white/5 rounded-2xl">
                <h3 className="font-bold mb-4">Current Template: {selectedTemplate}</h3>
                <button onClick={() => setCurrentStep(0)} className="w-full py-3 bg-white text-black rounded-xl font-bold transition hover:bg-gray-200">Change Template</button>
              </div>
            </div>
          </motion.div>
        )}

      </main>
    </div>
  );
}
