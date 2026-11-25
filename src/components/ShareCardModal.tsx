import React, { useState, useRef } from 'react';
import { X, Copy, Check, Share2, Download, MessageCircle, Shield, FileText } from 'lucide-react';
import type { ActionPlan, AirQualityData, HouseholdProfile } from '../types';
import type { UiTranslations } from '../i18n';
import { getSwapById } from '../data/swapCatalog';
import { calculateProtectionScore } from '../utils/aqiCalculator';
import { logger } from '../utils/logger';
import { generateActionPlanPdf } from '../services/pdfService';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  airData: AirQualityData;
  profile: HouseholdProfile;
  plan: ActionPlan;
  completedHackIds: string[];
  completedSwapIds: string[];
  t: UiTranslations;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  airData,
  profile,
  plan,
  completedHackIds,
  completedSwapIds,
  t,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'whatsapp' | 'text'>('pdf');
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useModalAccessibility(isOpen, onClose, containerRef);

  if (!isOpen) return null;

  const score = calculateProtectionScore(
    profile,
    completedHackIds,
    plan.indoorHacks.length,
    completedSwapIds,
    plan.swaps.length
  ).total;

  const shareText = `🛡️ *VAYUSHIELD DAILY FAMILY SMOG ACTION PLAN*
📍 *Location:* ${airData.cityName} | *AQI:* ${airData.currentAqi} (${airData.category.label})
📊 *Protection Score:* ${score}% | *Mask:* ${airData.currentAqi > 150 ? 'N95 / FFP2 Required' : 'Surgical / KN95'}

⭐ *#1 MOST IMPORTANT ACTION TODAY:*
"${plan.oneThingToDo}"

☀️ *BEST TIME TO GO OUT / AERATE:*
• ${airData.bestWindow.plainSentence}

🚫 *DANGER INVERSION HOURS (STAY INDOORS):*
• Morning (5:00 – 9:00 AM) & Evening (5:00 – 9:00 PM)

✅ *TODAY'S TOP HOME ACTIONS:*
1. ${plan.indoorHacks[0]?.title ?? 'Seal entry doors with damp rolled towels'}
2. ${plan.indoorHacks[1]?.title ?? 'Keep lids tightly on cookware during frying'}
3. ${getSwapById(plan.swaps[0]?.catalogId ?? '')?.title ?? 'Simmer pot aromatics over burning incense'}

_Created with VayuShield — GenAI Urban Air Quality Protection_`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err: unknown) {
      logger.warn('Clipboard copy failed:', err);
    }
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generateActionPlanPdf(airData, plan, score);
    } catch (err: unknown) {
      logger.error('PDF generation error:', err);
      // User-friendly fallback: download as plain text if PDF fails
      try {
        const blob = new Blob([shareText.replace(/[*_]/g, '')], {
          type: 'text/plain;charset=utf-8',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `VayuShield-${airData.cityName.replace(/\s+/g, '-')}-ActionPlan.txt`;
        a.click();
        URL.revokeObjectURL(url);
      } catch {
        alert('Could not generate PDF. Please try the Plain Text or WhatsApp format instead.');
      }
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-card-title"
    >
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 id="share-card-title" className="text-lg font-bold text-slate-900 font-display">
              {t.shareCardBtn}
            </h3>
            <p className="text-xs text-slate-500">
              Select your preferred export format before sending or downloading.
            </p>
          </div>
        </div>

        {/* STEP 1: Format Selector Cards */}
        <div className="mb-4">
          <label className="text-xs font-bold text-slate-700 block mb-2">1. Choose Format:</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedFormat('pdf')}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                selectedFormat === 'pdf'
                  ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-300 text-sky-950 shadow-xs'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <FileText
                  className={`w-4 h-4 ${selectedFormat === 'pdf' ? 'text-sky-600' : 'text-slate-400'}`}
                />
                {selectedFormat === 'pdf' && <span className="w-2 h-2 rounded-full bg-sky-600" />}
              </div>
              <strong className="text-xs font-bold block">PDF File</strong>
              <span className="text-[10px] text-slate-500 leading-tight">Document</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat('whatsapp')}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                selectedFormat === 'whatsapp'
                  ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-300 text-emerald-950 shadow-xs'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <MessageCircle
                  className={`w-4 h-4 ${selectedFormat === 'whatsapp' ? 'text-emerald-600' : 'text-slate-400'}`}
                />
                {selectedFormat === 'whatsapp' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                )}
              </div>
              <strong className="text-xs font-bold block">WhatsApp</strong>
              <span className="text-[10px] text-slate-500 leading-tight">Chat Text</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat('text')}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                selectedFormat === 'text'
                  ? 'border-purple-500 bg-purple-50/80 ring-2 ring-purple-300 text-purple-950 shadow-xs'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <Copy
                  className={`w-4 h-4 ${selectedFormat === 'text' ? 'text-purple-600' : 'text-slate-400'}`}
                />
                {selectedFormat === 'text' && (
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                )}
              </div>
              <strong className="text-xs font-bold block">Plain Text</strong>
              <span className="text-[10px] text-slate-500 leading-tight">Clipboard</span>
            </button>
          </div>
        </div>

        {/* STEP 2: Format Preview & Details */}
        <div className="mb-4">
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            2. Preview & Options:
          </label>

          {selectedFormat === 'pdf' && (
            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 text-xs text-sky-950 space-y-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="font-bold">Official Formatted PDF Document</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Includes today's AQI ({airData.currentAqi}), safe ventilation window, 4-block
                inversion routine, and all 4 indoor hacks with no text overlap. Ideal for printing
                or sending as a WhatsApp document.
              </p>
            </div>
          )}

          {selectedFormat === 'whatsapp' && (
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 font-mono space-y-1.5 max-h-36 overflow-y-auto">
              <div className="flex items-center justify-between font-sans text-emerald-800 font-bold mb-1">
                <span>WhatsApp Message Preview</span>
                <span className="text-[10px] text-emerald-600">Emojis enabled</span>
              </div>
              <p className="whitespace-pre-line text-[11px] leading-snug text-slate-700 font-sans">
                {shareText}
              </p>
            </div>
          )}

          {selectedFormat === 'text' && (
            <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-1 max-h-36 overflow-y-auto">
              <span className="font-bold text-slate-900 block">Plain Text Summary:</span>
              <p className="whitespace-pre-line text-[11px] leading-snug">
                {shareText.replace(/[*_]/g, '')}
              </p>
            </div>
          )}
        </div>

        {/* Visual Badge Card */}
        <div
          ref={cardRef}
          className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white shadow-md mb-4 border border-slate-700 flex items-center justify-between"
        >
          <div>
            <div className="flex items-center space-x-1.5 mb-0.5">
              <Shield className="w-4 h-4 text-sky-400" />
              <span className="text-xs text-slate-300 font-medium">{airData.cityName}</span>
            </div>
            <span className="text-xl font-black font-display text-amber-400">
              AQI {airData.currentAqi} {airData.category.emoji}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">{t.protectionScore}</span>
            <span className="text-xl font-black font-display text-emerald-400">{score}%</span>
          </div>
        </div>

        {/* STEP 3: Action Execution Buttons based on Selected Format */}
        <div className="space-y-2">
          {selectedFormat === 'pdf' && (
            <>
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-sky-200"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGeneratingPdf ? t.downloadingPdf : 'Download Clean PDF Document'}
              </button>
              <p className="text-[11px] text-slate-500 text-center">
                💡 Tip: Once downloaded, you can attach this PDF directly into any WhatsApp chat or
                email.
              </p>
            </>
          )}

          {selectedFormat === 'whatsapp' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-emerald-200"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Send via WhatsApp
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold transition-colors border border-slate-300"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1.5 text-emerald-600" />
                    Copied ✓
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1.5 text-slate-600" />
                    Copy WhatsApp Text
                  </>
                )}
              </button>
            </div>
          )}

          {selectedFormat === 'text' && (
            <button
              type="button"
              onClick={handleCopy}
              className="w-full inline-flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-purple-200"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-white" />
                  Copied Text to Clipboard ✓
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Clean Text to Clipboard
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
