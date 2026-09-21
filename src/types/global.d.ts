declare namespace JSX {
  interface IntrinsicElements {
    "model-viewer": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        "ios-src"?: string;
        poster?: string;
        alt?: string;
        shadowIntensity?: string | number;
        cameraControls?: boolean;
        autoRotate?: boolean;
        ar?: boolean;
        arModes?: string;
        arScale?: string;
        loading?: "auto" | "lazy" | "eager";
        reveal?: "auto" | "interaction" | "manual";
        environmentImage?: string;
        exposure?: string | number;
      },
      HTMLElement
    >;
  }
}
