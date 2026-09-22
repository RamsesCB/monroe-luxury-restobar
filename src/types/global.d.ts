import * as React from "react";

type ModelViewerProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement> & {
    src?: string;
    "ios-src"?: string;
    poster?: string;
    alt?: string;
    scale?: string;
    "shadow-intensity"?: string | number;
    "shadow-softness"?: string | number;
    shadowIntensity?: string | number;
    "camera-controls"?: boolean;
    cameraControls?: boolean;
    "auto-rotate"?: boolean;
    autoRotate?: boolean;
    ar?: boolean;
    "ar-modes"?: string;
    arModes?: string;
    "ar-placement"?: string;
    arPlacement?: string;
    "ar-scale"?: string;
    arScale?: string;
    loading?: "auto" | "lazy" | "eager";
    reveal?: "auto" | "interaction" | "manual";
    "environment-image"?: string;
    environmentImage?: string;
    exposure?: string | number;
    "camera-orbit"?: string;
    "min-camera-orbit"?: string;
    "max-camera-orbit"?: string;
    "field-of-view"?: string;
    slot?: string;
    onLoad?: () => void;
  },
  HTMLElement
>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerProps;
    }
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerProps;
    }
  }
}

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerProps;
    }
  }
}
