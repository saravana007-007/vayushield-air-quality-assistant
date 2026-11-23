import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CitySelector } from '../CitySelector';
import { DangerExplainer } from '../DangerExplainer';
import { MaskAndDoctorGuide } from '../MaskAndDoctorGuide';
import { getTranslation } from '../../i18n';
import { AIR_PRESETS } from '../../services/airQualityService';

const t = getTranslation('en');

describe('components/CitySelector', () => {
  it('renders presets and triggers selection on click', () => {
    const handleSelectPreset = vi.fn();
    const handleSelectLocation = vi.fn();

    render(
      <CitySelector
        currentCityName="Delhi"
        onSelectPreset={handleSelectPreset}
        onSelectLocation={handleSelectLocation}
        isLoading={false}
        t={t}
      />
    );

    const delhiPresetBtn = screen.getByText(t.presetDelhi);
    expect(delhiPresetBtn).toBeDefined();
    fireEvent.click(delhiPresetBtn);
    expect(handleSelectPreset).toHaveBeenCalledWith('delhi-severe');
  });
});

describe('components/DangerExplainer', () => {
  it('renders air data information and category correctly', () => {
    const airData = AIR_PRESETS['delhi-severe']!;
    render(<DangerExplainer airData={airData} t={t} />);
    expect(screen.getByText('385')).toBeDefined();
    expect(screen.getByText('Delhi (Severe Smog)')).toBeDefined();
    expect(screen.getByText('US AQI')).toBeDefined();
  });
});

describe('components/MaskAndDoctorGuide', () => {
  it('renders mask guidance and red flag warning symptoms', () => {
    render(<MaskAndDoctorGuide t={t} />);
    expect(screen.getByText(t.maskGuideTitle)).toBeDefined();
    expect(screen.getByText(t.seeDoctorTitle)).toBeDefined();
    expect(screen.getByText(t.doctorWarningSymptoms)).toBeDefined();
  });
});
