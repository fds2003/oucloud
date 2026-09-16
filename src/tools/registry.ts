import React from 'react';
import { ColorPicker } from './color/ColorPicker';
import { RmbUppercase } from './number/RmbUppercase';
import { FaviconGenerator } from './favicon/FaviconGenerator';
import { GradientGenerator } from './css/GradientGenerator';

export const toolComponents: Record<string, React.ComponentType> = {
  ColorPicker,
  RmbUppercase,
  FaviconGenerator,
  GradientGenerator,
};

export function getToolComponent(componentName: string): React.ComponentType | null {
  return toolComponents[componentName] || null;
}
