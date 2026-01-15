import { Composition } from "remotion";
import { SaasExplainerTemplate } from "./templates/SaasExplainer";
import "./style.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SaaS-Explainer"
        component={SaasExplainerTemplate}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          script: {
            title: "Default",
            scenes: [],
            globalStyle: {
              primaryColor: "#000",
              backgroundColor: "#fff",
              fontFamily: "Inter"
            }
          }
        }}
      />
    </>
  );
};
