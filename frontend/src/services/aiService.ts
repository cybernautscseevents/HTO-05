import { AIExtractionResult } from '../types';

/**
 * AI Work Record Extractor based on docs/06-ai-evidence-engine.md
 * Extracts structured parameters from natural language descriptions.
 */

const PREDEFINED_PATTERNS: Array<{
  keywords: string[];
  result: AIExtractionResult;
}> = [
  {
    keywords: ['commercial', 'panel', 'panels', 'six'],
    result: {
      title: 'Commercial Panel Installation',
      trade: 'Electrical',
      skills: ['Panel Installation', 'Industrial Maintenance'],
      quantity: 6,
      quantity_unit: 'panels',
      date: '2026-10-07',
      location: 'Commercial Building, Mangaluru',
      confidence: 0.94,
    },
  },
  {
    keywords: ['house', 'wiring', 'bhk', 'residential'],
    result: {
      title: 'Residential 3BHK Wiring & DB Setup',
      trade: 'Electrical',
      skills: ['Residential Wiring', 'Panel Installation'],
      quantity: 1,
      quantity_unit: 'residence',
      date: '2026-10-05',
      location: 'Greenwood Enclave, Mangaluru',
      confidence: 0.92,
    },
  },
  {
    keywords: ['motor', 'induction', 'rewind', 'stator', 'pump'],
    result: {
      title: '3-Phase Motor Stator Rewind',
      trade: 'Electrical',
      skills: ['Motor Repair', 'Industrial Maintenance'],
      quantity: 1,
      quantity_unit: 'motor',
      date: '2026-10-03',
      location: 'Pumpwell Industrial Estate',
      confidence: 0.89,
    },
  },
  {
    keywords: ['ac', 'air conditioner', 'inverter', 'ton'],
    result: {
      title: 'Split AC Power Cabling & Isolator',
      trade: 'Electrical',
      skills: ['AC Installation', 'Residential Wiring'],
      quantity: 2,
      quantity_unit: 'units',
      date: '2026-10-06',
      location: 'Bejai, Mangaluru',
      confidence: 0.91,
    },
  },
  {
    keywords: ['solar', 'inverter', 'grid', 'panels', 'rooftop'],
    result: {
      title: 'Rooftop Solar Inverter Sync & Earthing',
      trade: 'Electrical',
      skills: ['Panel Installation', 'Industrial Maintenance'],
      quantity: 5,
      quantity_unit: 'kW array',
      date: '2026-10-04',
      location: 'Chilimbi, Mangaluru',
      confidence: 0.93,
    },
  },
];

export async function extractWorkFromNaturalLanguage(text: string): Promise<AIExtractionResult> {
  // Simulate AI parsing latency for realistic feel (600ms)
  await new Promise(r => setTimeout(r, 650));

  const lower = text.toLowerCase();

  for (const item of PREDEFINED_PATTERNS) {
    if (item.keywords.some(k => lower.includes(k))) {
      // If numbers are explicitly found in text, extract quantity
      const numberMatch = text.match(/\b(\d+)\b/);
      const parsedQty = numberMatch ? parseInt(numberMatch[1], 10) : item.result.quantity;

      return {
        ...item.result,
        quantity: parsedQty,
      };
    }
  }

  // Dynamic entity fallback extraction
  const quantityMatch = text.match(/\b(\d+)\b/);
  const detectedQuantity = quantityMatch ? parseInt(quantityMatch[1], 10) : 1;

  // Derive title from text
  const words = text.trim().split(/\s+/).slice(0, 5).join(' ');
  const capitalizedTitle = words.charAt(0).toUpperCase() + words.slice(1);

  return {
    title: capitalizedTitle || 'Skilled Electrical Installation',
    trade: 'Electrical',
    skills: ['Residential Wiring', 'Panel Installation'],
    quantity: detectedQuantity,
    quantity_unit: 'units',
    date: new Date().toISOString().split('T')[0],
    location: 'Mangaluru',
    confidence: 0.85,
  };
}
