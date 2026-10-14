import { coreSystems } from './core';
import { africaSystems } from './africa';
import { asiaSystems } from './asia';
import { oceaniaSystems } from './oceania';
import { americanOralSystems } from './american-oral';
export const systems = [
  ...coreSystems,
  ...africaSystems,
  ...asiaSystems,
  ...oceaniaSystems,
  ...americanOralSystems,
];
export const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'] as const;
export const getSystem = (id: string) => systems.find((s) => s.id === id);
export const converters = systems.filter((s) => s.engine !== 'explainer');
