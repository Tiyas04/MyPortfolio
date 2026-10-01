import React from 'react';

export interface GridScanProps {
  enableWebcam?: boolean;
  showPreview?: boolean;
  modelsPath?: string;
  sensitivity?: number;
  lineThickness?: number;
  linesColor?: string;
  scanColor?: string;
  scanOpacity?: number;
  gridScale?: number;
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  lineJitter?: number;
  scanDirection?: 'forward' | 'backward' | 'pingpong';
  enablePost?: boolean;
  bloomIntensity?: number;
  bloomThreshold?: number;
  bloomSmoothing?: number;
  chromaticAberration?: number;
  noiseIntensity?: number;
  scanGlow?: number;
  scanSoftness?: number;
  scanPhaseTaper?: number;
  scanDuration?: number;
  scanDelay?: number;
  enableGyro?: boolean;
  scanOnClick?: boolean;
  snapBackDelay?: number;
  lightMode?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export declare const GridScan: React.FC<GridScanProps>;
export default GridScan;
