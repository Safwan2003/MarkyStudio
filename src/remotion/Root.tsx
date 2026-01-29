import { Composition } from "remotion";
import { FronterTemplate } from "./templates/Fronter";
import { Intro } from "./templates/Fronter/scenes/Intro";
import "./style.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SaaS-Explainer"
        component={FronterTemplate}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          plan: {
            brandName: "Fronter",
            globalDesign: {
              primaryColor: "#3b82f6",
              secondaryColor: "#1e293b",
              accentColor: "#f43f5e",
              backgroundColor: "#ffffff",
              textColor: "#0f172a",
              headingFont: "Inter",
              bodyFont: "Inter",
              borderRadius: "8px"
            },
            scenes: []
          }
        }}
      />
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={150} // 5 seconds
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          scene: {
            id: "intro-1",
            type: "intro",
            duration: 5,
            mainText: "Mockups connects the conceptual structure"
          },
          themeStyles: {
            primary: "#3b82f6",
            secondary: "#1e293b",
            accent: "#f43f5e",
            background: "#ffffff",
            text: "#0f172a",
            headingFont: "Inter",
            bodyFont: "Inter",
            borderRadius: "8px"
          }
        }}
      />
    </>
  );
};
