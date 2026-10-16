import { coreSystems } from './core';
import { africaSystems } from './africa';
import { asiaSystems } from './asia';
import { oceaniaSystems } from './oceania';
import { americanOralSystems } from './american-oral';
import { gestureSystems } from './gestures';
import { modernSystems } from './modern';
import type { Region } from '../lib/types';
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
  ...modernSystems,
].map((system) => ({
  ...system,
  // Source-backed productive adapters supersede the earlier specimen metadata.
  ...polynesianSystemUpdates[system.id],
  ...pacificSystemUpdates[system.id],
  ...writtenSystemUpdates[system.id],
}));
export const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Global'] as const;
export const regionLabel = (region: Region) => (region === 'Global' ? 'Modern' : region);
export const getSystem = (id: string) => systems.find((s) => s.id === id);
export const converters = systems.filter((s) => s.engine !== 'explainer');
