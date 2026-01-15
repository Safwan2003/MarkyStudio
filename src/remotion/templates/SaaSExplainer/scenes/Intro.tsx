import React from 'react';
import { Scene } from "@/lib/types";
import { KineticText } from "@/remotion/components/KineticText";

export const Intro: React.FC<{ scene: Scene }> = ({ scene }) => {
    return (
        <KineticText
            text={scene.text}
            subText={scene.subText}
        />
    );
};
