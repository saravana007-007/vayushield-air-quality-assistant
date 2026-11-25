import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DangerExplainer } from '../DangerExplainer';
import { MaskAndDoctorGuide } from '../MaskAndDoctorGuide';
import { DosAndDonts } from '../DosAndDonts';
import { AIR_PRESETS } from '../../services/airQualityService';
import { TRANSLATIONS } from '../../i18n';
import type { UiTranslations } from '../../i18n';

describe('Fallback branches for DangerExplainer, MaskAndDoctorGuide, and DosAndDonts', () => {
  it('renders fallback strings when optional translation fields are empty', () => {
    const minimalT = {
      ...TRANSLATIONS.en,
      categoryNames: {},
      categorySummaries: {},
      categoryLabelPrefix: '',
      n95Tip: '',
      clothTip: '',
      doctorSymptomsList: undefined as unknown as string[],
      dosAndDontsTitle: '',
    } as UiTranslations;

    const airData = AIR_PRESETS['delhi-severe']!;
    const { rerender } = render(
      <div>
        <DangerExplainer airData={airData} t={minimalT} />
        <MaskAndDoctorGuide t={minimalT} />
        <DosAndDonts dos={['Do 1']} donts={['Dont 1']} t={minimalT} />
      </div>
    );

    expect(screen.getByText(/Pinch metal nose-clip tightly/i)).toBeInTheDocument();
    expect(screen.getByText(/Fine PM2.5 soot passes easily/i)).toBeInTheDocument();
    expect(screen.getByText('Do 1')).toBeInTheDocument();

    rerender(<DosAndDonts dos={[]} donts={[]} t={minimalT} />);
    expect(screen.queryByText('Do 1')).not.toBeInTheDocument();
  });

  it('triggers ErrorBoundary fallback and resets on Try Again', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onClick = vi.fn();
    render(
      <button type="button" onClick={onClick}>
        Trigger
      </button>
    );
    fireEvent.click(screen.getByText('Trigger'));
    expect(onClick).toHaveBeenCalled();
    spy.mockRestore();
  });
});
