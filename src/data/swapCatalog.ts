// VayuShield Catalog of Community & Personal Smog Swaps
// Estimated exposure reduction and CO2 values are codified here and always labeled as estimates.

import type { SwapCatalogItem } from '../types';

export const SWAP_CATALOG: SwapCatalogItem[] = [
  {
    id: 'carpool-metro-transit',
    title: 'Switch Commute to Metro or Shared Electric Transit',
    description: 'Opt for underground rapid transit or verified carpooling instead of individual combustion vehicle travel during peak inversion hours.',
    category: 'commute',
    exposureReductionBadge: '-30% to -45% personal PM2.5 exposure during commute (est.)',
    co2SavedBadge: '-3.2 kg CO2/day (est.)',
    exposurePoints: 25,
    co2SavedKg: 3.2,
  },
  {
    id: 'simmer-pot-aromatics',
    title: 'Simmer Pot Aromatics over Incense, Dhoop, or Candles',
    description: 'Simmer citrus peels, cinnamon, and cloves in water on low heat instead of burning incense sticks or scented candles indoors.',
    category: 'home',
    exposureReductionBadge: '-85% indoor particulate spike elimination (est.)',
    co2SavedBadge: '-0.4 kg CO2/day (est.)',
    exposurePoints: 20,
    co2SavedKg: 0.4,
  },
  {
    id: 'batch-cooking-covered',
    title: 'Covered Batch Cooking Outside Peak Inversion Hours',
    description: 'Prepare day-long meals in one covered cycle during noon, avoiding open high-heat tadka or shallow frying during evening temperature inversion.',
    category: 'cooking',
    exposureReductionBadge: '-40% evening indoor PM2.5 kitchen spike (est.)',
    co2SavedBadge: '-0.9 kg CO2/day (est.)',
    exposurePoints: 20,
    co2SavedKg: 0.9,
  },
  {
    id: 'zero-waste-mulching',
    title: 'Mulch & Bag Dry Leaves (Zero Backyard/Alley Burning)',
    description: 'Collect yard foliage into compost bins or damp bags rather than burning dried waste or street litter in neighborhood curb piles.',
    category: 'community',
    exposureReductionBadge: '-50% micro-neighborhood toxic smoke exposure (est.)',
    co2SavedBadge: '-4.8 kg CO2/day (est.)',
    exposurePoints: 25,
    co2SavedKg: 4.8,
  },
  {
    id: 'damp-microfiber-mopping',
    title: 'Damp Microfiber Mopping over Dry Broom Sweeping',
    description: 'Use a damp microfiber mop with plain water instead of dry broom sweeping, which resuspends fine settled particulate back into breathing zones.',
    category: 'home',
    exposureReductionBadge: '-60% resuspended indoor dust & PM10 (est.)',
    co2SavedBadge: '-0.1 kg CO2/day (est.)',
    exposurePoints: 15,
    co2SavedKg: 0.1,
  },
  {
    id: 'rolled-towel-draft-sealing',
    title: 'Damp Towel Sealing on Entry Doors & Window Gaps',
    description: 'Place rolled moist towels or draft stoppers across exterior door bases and drafty balcony window sills before 5 PM inversion.',
    category: 'home',
    exposureReductionBadge: '-25% ambient smog infiltration into living areas (est.)',
    co2SavedBadge: '-0.2 kg CO2/day (est.)',
    exposurePoints: 15,
    co2SavedKg: 0.2,
  },
  {
    id: 'midday-errand-scheduling',
    title: 'Shift Essential Errands to Midday Solar Clearing Window',
    description: 'Conduct unavoidable outdoor runs strictly between 12:00 PM and 2:30 PM when solar heating breaks the surface boundary trap.',
    category: 'commute',
    exposureReductionBadge: '-35% lower outdoor inhalation dosage (est.)',
    co2SavedBadge: '-0.5 kg CO2/day (est.)',
    exposurePoints: 20,
    co2SavedKg: 0.5,
  },
  {
    id: 'diy-hepa-boxfan-rig',
    title: 'Secondary MERV-13 Filter Rig for Sleeping Quarters',
    description: 'Attach a standard MERV-13 furnace filter to a quiet box fan in secondary bedrooms to maintain clean bedroom micro-climates without buying a full second unit.',
    category: 'home',
    exposureReductionBadge: '-70% overnight bedroom PM2.5 levels (est.)',
    co2SavedBadge: '-1.1 kg CO2/day (est.)',
    exposurePoints: 25,
    co2SavedKg: 1.1,
  }
];

export function getSwapById(id: string): SwapCatalogItem | undefined {
  return SWAP_CATALOG.find(item => item.id === id);
}

export function getAllSwapCatalogIds(): string[] {
  return SWAP_CATALOG.map(s => s.id);
}
