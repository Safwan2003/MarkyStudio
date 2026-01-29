import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Scene, ThemeStyles } from '@/lib/types';

export const Solution: React.FC<{ scene: Scene, themeStyles: ThemeStyles }> = () => {
    return (
        <AbsoluteFill style={{
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <h1 style={{ color: 'white', fontFamily: 'sans-serif', fontSize: 100 }}>Solution</h1>
        </AbsoluteFill>
    );
};
