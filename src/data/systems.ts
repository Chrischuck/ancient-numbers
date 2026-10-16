import { coreSystems } from './core';
import { africaSystems } from './africa';
import { asiaSystems } from './asia';
import { oceaniaSystems } from './oceania';
import { americanOralSystems } from './american-oral';
import { gestureSystems } from './gestures';
import { polynesianSystemUpdates } from './polynesian-expansions';
import { pacificSystemUpdates } from './pacific-expansions';
import { writtenSystemUpdates } from './written-expansions';
export const systems = [
  ...coreSystems,
  ...africaSystems,
  ...asiaSystems,
  ...oceaniaSystems,
  ...americanOralSystems,
  ...gestureSystems,
].map((system) => ({
  ...system,
  // Source-backed productive adapters supersede the earlier specimen metadata.
  ...polynesianSystemUpdates[system.id],
  ...pacificSystemUpdates[system.id],
  ...writtenSystemUpdates[system.id],
}));
export const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'] as const;
export const getSystem = (id: string) => systems.find((s) => s.id === id);
export const converters = systems.filter((s) => s.engine !== 'explainer');
