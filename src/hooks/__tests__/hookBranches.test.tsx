import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import App from '../../App';
import { useActionPlan } from '../useActionPlan';
import { useAirQuality } from '../useAirQuality';
import { saveCachedPlan } from '../../services/planCache';
import { DEMO_PLANS } from '../../data/demoPlans';
import * as airQualityService from '../../services/airQualityService';
import { AIR_PRESETS } from '../../services/airQualityService';

describe('Hook and App remaining branches', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders and dismisses cachedNotice in App when cached plan exists', () => {
    saveCachedPlan(DEMO_PLANS['delhi-severe']!, AIR_PRESETS['delhi-severe']!);
    render(<App />);

    expect(screen.getByText(/Showing cached offline plan/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Dismiss notice/i }));
    expect(screen.queryByText(/Showing cached offline plan/i)).not.toBeInTheDocument();
  });

  it('useActionPlan syncPlanForLanguage is a no-op when isDemo is false', () => {
    const { result } = renderHook(() => useActionPlan());
    const customPlan = { ...DEMO_PLANS['lahore-hazardous']!, isDemo: false };

    act(() => {
      result.current.setPlanDirectly(customPlan, false);
    });
    act(() => {
      result.current.syncPlanForLanguage(350, 'Delhi', 'hi');
    });
    expect(result.current.plan.oneThingToDo).toBe(customPlan.oneThingToDo);
  });

  it('useAirQuality sets airError when selectLocation throws a non-Error', async () => {
    vi.spyOn(airQualityService, 'fetchLiveAirQuality').mockRejectedValueOnce('raw error');
    const { result } = renderHook(() => useAirQuality());
    let live: unknown;
    await act(async () => {
      live = await result.current.selectLocation('TestCity', 10, 20);
    });
    expect(live).toBeNull();
    expect(result.current.airError).toBe('raw error');
  });
});
