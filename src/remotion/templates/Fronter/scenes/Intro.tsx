import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
} from 'remotion';
import { Mail, Phone, Zap } from 'lucide-react';
import { Scene } from '@/lib/types';
import { ThemeStyles } from '../components/ThemeEngine';

// Note: Ensure images are in public/fronter/ or use absolute paths if configured
const INTRO_BG = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1920&q=80"; // High-res fallback
// We will assume the local image is available via staticFile if copied to public, 
// but for this implementation we'll use a placeholder that looks like a desk if not found.

const AVATARS = [
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
];

const FloatingIcon = ({ Icon, x, y, delay, color, badge }: { Icon: any, x: number, y: number, delay: number, color: string, badge?: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { stiffness: 100, damping: 14 } });
  const float = Math.sin((frame + delay) / 35) * 12;

  if (frame < delay) return null;

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      transform: `scale(${pop}) translateY(${float}px)`,
      width: 90, height: 90,
      background: 'white',
      borderRadius: 24,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      boxShadow: '0 12px 25px rgba(0,0,0,0.1)',
      zIndex: 45
    }}>
      <Icon size={50} color={color} fill={color + '33'} />
      {badge && (
        <div style={{
          position: 'absolute', top: -10, right: -10,
          background: '#ef4444', color: 'white',
          fontSize: 18, fontWeight: 900,
          width: 36, height: 36, borderRadius: '50%',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          border: '4px solid white',
          boxShadow: '0 5px 15px rgba(239, 68, 68, 0.4)'
        }}>
          {badge}
        </div>
      )}
    </div>
  );
};

const GlassBubble = ({ text, subtext, x, y, delay, color, direction = 'left' }: { text: string, subtext?: string, x: number, y: number, delay: number, color: string, direction?: 'left' | 'right' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { stiffness: 80, damping: 12 } });
  const float = Math.sin((frame + delay * 2) / 40) * 8;

  if (frame < delay) return null;

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      transform: `scale(${pop}) translateY(${float}px)`,
      background: '#fff',
      backdropFilter: 'blur(16px)',
      padding: '24px 32px',
      borderRadius: direction === 'left' ? '0 32px 32px 32px' : '32px 0 32px 32px',
      boxShadow: '0 30px 60px -12px rgba(0,0,0,0.15)',
      border: '1px solid rgba(255,255,255,0.8)',
      maxWidth: 420,
      zIndex: 60
    }}>
      <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1e293b', lineHeight: 1.3 }}>{text}</p>
      {subtext && <p style={{ margin: '8px 0 0', fontSize: 16, fontWeight: 600, color: '#64748b', textAlign: 'right' }}>{subtext}</p>}
    </div>
  );
};

const FloatingAvatar = ({ src, x, y, delay }: { src: string, x: number, y: number, delay: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { stiffness: 120, damping: 14 } });
  const float = Math.cos((frame + delay) / 40) * 15;

  if (frame < delay) return null;

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      transform: `scale(${pop}) translateY(${float}px)`,
      width: 100, height: 100,
      borderRadius: '50%',
      border: '6px solid white',
      boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
      overflow: 'hidden',
      zIndex: 40
    }}>
      <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
};

const ColorSquare = ({ x, y, size, color, delay }: { x: number, y: number, size: number, color: string, delay: number }) => {
  const frame = useCurrentFrame();
  const pop = spring({ frame: frame - delay, fps: 30 });
  const float = Math.sin((frame + delay) / 50) * 20;

  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: size, height: size,
      background: color, borderRadius: size * 0.2,
      transform: `scale(${pop}) translateY(${float}px) rotate(${float}deg)`,
      opacity: 0.8,
      zIndex: 10
    }} />
  );
};

export const Intro: React.FC<{ scene: Scene, themeStyles: ThemeStyles }> = ({ scene, themeStyles }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Cinematic drivers
  const zoom = interpolate(frame, [0, 60, 120], [1, 1.1, 1.8], { extrapolateRight: 'clamp' });
  const blur = interpolate(frame, [90, 120], [0, 12], { extrapolateRight: 'clamp' });
  const opacity = interpolate(frame, [100, 120], [1, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#fff', overflow: 'hidden' }}>

      <AbsoluteFill style={{ transform: `scale(${zoom})`, filter: `blur(${blur}px)`, opacity }}>
        <Img
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1920&q=80"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* ACT 2: FLOATING NOISE (AGENCY CHAOS) */}
      <AbsoluteFill style={{ opacity }}>
        {/* Decorative Squares */}
        <ColorSquare x={200} y={100} size={50} color="#fbbf24" delay={5} />
        <ColorSquare x={1700} y={150} size={40} color="#60a5fa" delay={15} />
        <ColorSquare x={300} y={800} size={60} color="#34d399" delay={25} />

        <FloatingAvatar src={AVATARS[0]} x={250} y={250} delay={10} />
        <FloatingAvatar src={AVATARS[1]} x={1550} y={650} delay={35} />

        <GlassBubble
          text="Can you increase the font of the second paragraph on the features page?"
          subtext="v2 requested"
          x={1100} y={280} delay={20} color="#3b82f6" direction="right"
        />
        <GlassBubble
          text="Please change the header of image of the product page to the image I sent you by email!"
          subtext="16:40"
          x={220} y={580} delay={45} color="#ef4444"
        />

        <FloatingIcon Icon={Mail} x={500} y={350} delay={15} color="#ea4335" badge="5" />
        <FloatingIcon Icon={Phone} x={1650} y={750} delay={30} color="#22c55e" />
        <FloatingIcon Icon={Zap} x={1000} y={150} delay={40} color="#6366f1" badge="!" />
      </AbsoluteFill>

      {/* ACT 3: KINETIC HEADLINE */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
        <div style={{
          transform: `scale(${spring({ frame: frame - 10, fps })})`,
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(4px)',
          padding: '60px 100px',
          borderRadius: 60,
          opacity: interpolate(frame, [0, 10, 100, 120], [0, 1, 1, 0])
        }}>
          <h1 style={{
            ...themeStyles.typography.h1,
            fontSize: 120,
            margin: 0,
            color: frame > 90 ? 'white' : '#0f172a',
            textShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            {scene.mainText || "Agency Chaos."}
          </h1>
          <p style={{
            ...themeStyles.typography.body,
            fontSize: 36,
            marginTop: 20,
            fontWeight: 700
          }}>
            {scene.subText || "Met with complete control."}
          </p>
        </div>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};