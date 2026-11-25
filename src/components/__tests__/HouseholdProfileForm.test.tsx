import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HouseholdProfileForm } from '../HouseholdProfileForm';
import { TRANSLATIONS } from '../../i18n';
import type { HouseholdProfile } from '../../types';

describe('components/HouseholdProfileForm', () => {
  const initialProfile: HouseholdProfile = {
    tags: ['toddler_kids'],
    customTagDetails: '',
    setup: {
      airPurifier: false,
      stoveType: 'gas',
      commuteMode: 'metro_bus',
    },
  };

  it('renders form, toggles tags, updates setup, and submits', () => {
    const onChangeProfile = vi.fn();
    const onGeneratePlan = vi.fn();

    const { rerender } = render(
      <HouseholdProfileForm
        profile={initialProfile}
        t={TRANSLATIONS.en}
        onChangeProfile={onChangeProfile}
        onGeneratePlan={onGeneratePlan}
        isLoading={false}
        statusMessage="Engine active"
      />
    );

    expect(screen.getByText(TRANSLATIONS.en.profileTitle)).toBeInTheDocument();
    expect(screen.getByText('Engine active')).toBeInTheDocument();

    // Toggle elderly tag
    const elderlyBtn = screen.getByRole('checkbox', { name: /elderly/i });
    fireEvent.click(elderlyBtn);
    expect(onChangeProfile).toHaveBeenCalledWith({
      ...initialProfile,
      tags: ['toddler_kids', 'elderly'],
    });

    // Toggle already active toddler tag off
    const toddlerBtn = screen.getByRole('checkbox', { name: /toddler/i });
    fireEvent.click(toddlerBtn);
    expect(onChangeProfile).toHaveBeenCalledWith({
      ...initialProfile,
      tags: [],
    });

    // Toggle air purifier switch
    const purifierSwitch = screen.getByRole('switch');
    fireEvent.click(purifierSwitch);
    expect(onChangeProfile).toHaveBeenCalledWith({
      ...initialProfile,
      setup: {
        ...initialProfile.setup,
        airPurifier: true,
      },
    });

    // Change stove selector
    const stoveSelect = screen.getByLabelText(TRANSLATIONS.en.stoveLabel);
    fireEvent.change(stoveSelect, { target: { value: 'other' } });
    expect(onChangeProfile).toHaveBeenCalledWith({
      ...initialProfile,
      setup: {
        ...initialProfile.setup,
        stoveType: 'other',
      },
    });

    // Change commute selector
    const commuteSelect = screen.getByLabelText(TRANSLATIONS.en.commuteLabel);
    fireEvent.change(commuteSelect, { target: { value: 'other' } });
    expect(onChangeProfile).toHaveBeenCalledWith({
      ...initialProfile,
      setup: {
        ...initialProfile.setup,
        commuteMode: 'other',
      },
    });

    // Test with "other" tag active to reveal custom condition input
    const profileWithOther: HouseholdProfile = {
      ...initialProfile,
      tags: ['other'],
      setup: {
        airPurifier: false,
        stoveType: 'other',
        commuteMode: 'other',
        customStove: '',
        customCommute: '',
      },
    };

    rerender(
      <HouseholdProfileForm
        profile={profileWithOther}
        t={TRANSLATIONS.en}
        onChangeProfile={onChangeProfile}
        onGeneratePlan={onGeneratePlan}
        isLoading={false}
      />
    );

    const customInput = screen.getByPlaceholderText(TRANSLATIONS.en.otherConditionPlaceholder);
    fireEvent.change(customInput, { target: { value: 'Asthma patient' } });
    expect(onChangeProfile).toHaveBeenCalledWith({
      ...profileWithOther,
      customTagDetails: 'Asthma patient',
    });

    // Click generate button
    const submitBtn = screen.getByRole('button', {
      name: new RegExp(TRANSLATIONS.en.updatePlanBtn, 'i'),
    });
    fireEvent.click(submitBtn);
    expect(onGeneratePlan).toHaveBeenCalled();
  });
});
