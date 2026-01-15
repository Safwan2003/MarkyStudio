import React from 'react';
import { Series, AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { flip } from '@remotion/transitions/flip';

interface TransitionConfig {
    type: 'fade' | 'slide' | 'flip' | 'none';
    durationInFrames: number;
}

interface MotionSeriesProps {
    children: React.ReactNode;
    defaultTransition?: TransitionConfig;
}

/**
 * MotionSeries - A production-grade wrapper for Remotion Series
 * that automatically injects transitions between scenes.
 */
export const MotionSeries: React.FC<MotionSeriesProps> = ({
    children,
    defaultTransition = { type: 'fade', durationInFrames: 15 }
}) => {
    // We use TransitionSeries from @remotion/transitions for high-quality FX
    return (
        <TransitionSeries>
            {React.Children.map(children, (child, index) => {
                const isFirst = index === 0;

                // Extract properties if it's a Series.Sequence or TransitionSeries.Sequence
                const sequenceChild = child as React.ReactElement<any>;
                const transitionInfo = sequenceChild.props.transition || defaultTransition;

                return (
                    <>
                        {!isFirst && transitionInfo.type !== 'none' && (
                            <TransitionSeries.Transition
                                presentation={getPresentation(transitionInfo.type) as any}
                                timing={linearTiming({ durationInFrames: transitionInfo.durationInFrames })}
                            />
                        )}
                        <TransitionSeries.Sequence
                            durationInFrames={sequenceChild.props.durationInFrames}
                        >
                            {sequenceChild.props.children}
                        </TransitionSeries.Sequence>
                    </>
                );
            })}
        </TransitionSeries>
    );
};

/**
 * Helper to map transition strings to presentation objects
 */
function getPresentation(type: string) {
    switch (type) {
        case 'fade': return fade();
        case 'slide': return slide();
        case 'flip': return flip();
        default: return fade();
    }
}
