// VayuShield PDF Export Service
// Encapsulates all document layout, sanitization, page breaks, and dynamic jsPDF loading

import type { ActionPlan, AirQualityData } from '../types';
import { getSwapById } from '../data/swapCatalog';
import { logger } from '../utils/logger';

/**
 * Sanitize text for jsPDF: replace non-Latin characters
 * with ASCII-safe equivalents since jsPDF's default helvetica font only supports Latin-1.
 * Uses printable ASCII range (0x20 to 0xFF) + whitespace to avoid control-regex issues.
 */
export function sanitizeForPdf(text: string): string {
  if (!text) return '';
  return text.replace(/[^\t\n\r\x20-\xFF]/g, (char) => {
    const map: Record<string, string> = {
      '\u2018': "'",
      '\u2019': "'",
      '\u201C': '"',
      '\u201D': '"',
      '\u2013': '-',
      '\u2014': '-',
      '\u2026': '...',
      '\u00B7': '.',
      '\u2022': '*',
      '\u2192': '->',
      '\u2190': '<-',
      '\u2714': '[done]',
      '\u2716': '[x]',
      '\u2605': '*',
      '\u00B0': 'deg',
      '\u00B5': 'u',
      '\u03BC': 'u',
    };
    return map[char] ?? '?';
  });
}

/**
 * Generate and download a printable PDF summary of the current ActionPlan and AQI data.
 */
export async function generateActionPlanPdf(
  airData: AirQualityData,
  plan: ActionPlan,
  score: number
): Promise<void> {
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const s = sanitizeForPdf;

  // Background header banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 38, 'F');

  // Title & Logo
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('VAYUSHIELD', 15, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Personalized Family Smog Protection Action Plan', 15, 26);
  doc.text(s(`Generated: ${new Date().toLocaleDateString()} | ${airData.cityName}`), 15, 32);

  // Section 1: AQI & Protection Overview Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(15, 45, 180, 30, 3, 3, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(s(`AIR QUALITY INDEX: ${airData.currentAqi} (${airData.category.label})`), 22, 55);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(
    s(
      `PM2.5: ${airData.currentPm25} ug/m3 (${airData.whoMultiplier}x WHO Clean Air Limit) | PM10: ${airData.currentPm10} ug/m3`
    ),
    22,
    62
  );
  doc.text(
    s(
      `Family Protection Score: ${score}% | Recommended Mask: ${
        airData.currentAqi > 150 ? 'N95 / FFP2 Respirator' : 'Surgical / KN95'
      }`
    ),
    22,
    69
  );

  // Section 2: The #1 Most Important Action Today
  doc.setFillColor(245, 158, 11); // amber-500
  doc.roundedRect(15, 82, 180, 25, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('THE #1 MOST IMPORTANT ACTION TODAY:', 22, 91);

  doc.setFontSize(12);
  const oneThingText = s(plan.oneThingToDo);
  const oneThingLines = doc.splitTextToSize(oneThingText, 165);
  doc.text(oneThingLines, 22, 99);

  // Section 3: Safe Ventilation & Inversion Timing
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('ATMOSPHERIC INVERSION SCHEDULE', 15, 118);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(22, 101, 52); // emerald-800
  doc.text(
    s(
      `* SAFEST TIME TO GO OUT / AERATE: ${airData.bestWindow.startTime} to ${airData.bestWindow.endTime}`
    ),
    15,
    126
  );

  doc.setTextColor(153, 27, 27); // red-800
  doc.text(
    '* CRITICAL DANGER INVERSION HOURS (STAY INDOORS): 5:00 AM - 9:00 AM & 5:00 PM - 9:00 PM',
    15,
    133
  );

  let yPos = 146;

  const checkPageBreak = (neededMm: number) => {
    if (yPos + neededMm > 270) {
      doc.addPage();
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 15, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(s(`VAYUSHIELD - ${airData.cityName} Action Plan (Continued)`), 15, 10);
      yPos = 25;
    }
  };

  // Section 4: Daily 4-Block Routine Summary
  checkPageBreak(25);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('DAILY 4-BLOCK ROUTINE & WINDOW RULES', 15, yPos);
  yPos += 8;

  plan.dailyRoutine.forEach((b) => {
    const titleText = s(`${b.title} [${b.badge}]`);
    const windowLines = doc.splitTextToSize(s(`Window: ${b.windowRule}`), 170);
    const guidanceLines = doc.splitTextToSize(s(`Guidance: ${b.memberGuidance}`), 170);
    const needed = 8 + windowLines.length * 4.5 + guidanceLines.length * 4.5 + 4;
    checkPageBreak(needed);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(titleText, 15, yPos);
    yPos += 5;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(windowLines, 18, yPos);
    yPos += windowLines.length * 4.5;

    doc.text(guidanceLines, 18, yPos);
    yPos += guidanceLines.length * 4.5 + 4;
  });

  // Section 5: Top Low-Cost Home Hacks
  checkPageBreak(30);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('PRIORITY INDOOR HACKS', 15, yPos + 4);
  yPos += 12;

  plan.indoorHacks.forEach((h, idx) => {
    const hackTitle = s(`${idx + 1}. ${h.title} (${h.difficulty})`);
    const stepLines = doc.splitTextToSize(s(`Steps: ${h.steps.join('  |  ')}`), 170);
    const reductionLines = doc.splitTextToSize(s(`Benefit: ${h.estimatedReduction}`), 170);
    const needed = 6 + stepLines.length * 4.5 + reductionLines.length * 4.5 + 5;
    checkPageBreak(needed);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(hackTitle, 15, yPos);
    yPos += 5;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(stepLines, 18, yPos);
    yPos += stepLines.length * 4.5;

    doc.setTextColor(13, 148, 136); // teal-600
    doc.text(reductionLines, 18, yPos);
    yPos += reductionLines.length * 4.5 + 4;
  });

  // Section 6: Recommended Swaps
  if (plan.swaps && plan.swaps.length > 0) {
    checkPageBreak(25);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('RECOMMENDED CLEAN AIR SWAPS', 15, yPos + 4);
    yPos += 10;

    plan.swaps.forEach((sw) => {
      const swapItem = getSwapById(sw.catalogId);
      const title = swapItem ? swapItem.title : sw.catalogId;
      const reasonLines = doc.splitTextToSize(s(`${title}: ${sw.customReason}`), 172);
      checkPageBreak(reasonLines.length * 4.5 + 4);

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(reasonLines, 18, yPos);
      yPos += reasonLines.length * 4.5 + 3;
    });
  }

  // Footer & Medical Disclaimer
  checkPageBreak(15);
  yPos += 5;
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  const disclaimerLines = doc.splitTextToSize(
    'IMPORTANT DISCLAIMER: VayuShield is an atmospheric science informational utility, not a medical device. Always consult certified physicians for acute respiratory symptoms.',
    180
  );
  doc.text(disclaimerLines, 15, yPos);

  // Save PDF
  doc.save(`VayuShield-${airData.cityName.replace(/\s+/g, '-')}-ActionPlan.pdf`);
  logger.info('PDF generated and downloaded successfully.');
}
