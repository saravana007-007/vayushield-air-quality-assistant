import React, { useState, useEffect, useRef, useId } from 'react';
import { Search, MapPin, Loader2, AlertCircle, X, Zap, Navigation } from 'lucide-react';
import type { GeocodingResult } from '../types';
import type { UiTranslations } from '../i18n';
import { searchCities } from '../services/airQualityService';

interface CitySelectorProps {
  currentCityName: string;
  isPresetActive?: boolean;
  activePresetId?: string;
  isLoading: boolean;
  t: UiTranslations;
  onSelectLocation: (name: string, lat: number, lon: number, country?: string) => void;
  onSelectPreset: (presetKey: string) => void;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  currentCityName,
  isPresetActive,
  activePresetId,
  isLoading,
  t,
  onSelectLocation,
  onSelectPreset,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const listboxId = useId();

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Debounced search handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSearchError(null);
    setActiveIndex(-1);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value.trim() || value.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      setIsOpen(false);
      return;
    }

    setIsSearching(true);
    setIsOpen(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const hits = await searchCities(value);
        setResults(hits);
        if (hits.length === 0) {
          setSearchError(`No cities matching "${value}" were found.`);
        }
      } catch (err: any) {
        setSearchError(err?.message || 'Location lookup failed. Check connection.');
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
  };

  const handleSelectHit = (hit: GeocodingResult) => {
    const label = hit.admin1 ? `${hit.name}, ${hit.admin1}` : hit.name;
    onSelectLocation(label, hit.latitude, hit.longitude, hit.country);
    setSearchTerm('');
    setIsOpen(false);
    setResults([]);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        onSelectLocation('My Current Location', latitude, longitude, 'Local');
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        alert('Could not access your location. Please check browser permissions or type your city.');
      },
      { timeout: 10000 }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        handleSelectHit(results[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <section aria-label="City Selection" className="space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* City Input + GPS Button */}
        <div ref={containerRef} className="relative flex-1 max-w-2xl flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              {isSearching || isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-sky-600" aria-hidden="true" />
              ) : (
                <Search className="w-5 h-5" aria-hidden="true" />
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={isOpen}
              aria-controls={listboxId}
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (results.length > 0) setIsOpen(true);
              }}
              placeholder={`${t.searchCityPlaceholder} (Now: ${currentCityName})`}
              className="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              autoComplete="off"
              spellCheck="false"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setResults([]);
                  setIsOpen(false);
                  inputRef.current?.focus();
                }}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* GPS Button */}
          <button
            type="button"
            onClick={handleUseLocation}
            disabled={isLocating}
            className="px-3.5 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-2xl text-slate-700 shadow-sm transition-all focus:ring-2 focus:ring-sky-500 shrink-0 inline-flex items-center text-xs font-bold"
            title={t.useMyLocation}
          >
            {isLocating ? (
              <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
            ) : (
              <>
                <Navigation className="w-4 h-4 mr-1.5 text-sky-600" />
                <span className="hidden sm:inline">GPS</span>
              </>
            )}
          </button>

          {/* Autocomplete Dropdown */}
          {isOpen && (
            <ul
              id={listboxId}
              role="listbox"
              aria-label="City search results"
              className="absolute top-full left-0 z-40 mt-1.5 w-full bg-white rounded-2xl shadow-xl border border-slate-200 py-2 max-h-60 overflow-y-auto focus:outline-none"
            >
              {searchError && (
                <li className="px-4 py-3 text-xs sm:text-sm text-slate-600 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{searchError}</span>
                </li>
              )}
              {results.map((hit, idx) => (
                <li
                  key={hit.id}
                  role="option"
                  aria-selected={activeIndex === idx}
                  onClick={() => handleSelectHit(hit)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`px-4 py-2.5 cursor-pointer flex items-center justify-between text-sm transition-colors ${
                    activeIndex === idx ? 'bg-sky-50 text-sky-900 font-semibold' : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                    <span>{hit.name}{hit.admin1 ? `, ${hit.admin1}` : ''}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-normal">{hit.country}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 1-Click Presets */}
        <div className="flex items-center flex-wrap gap-2" role="group" aria-label="Quick pollution presets">
          <span className="text-xs font-bold text-slate-500 flex items-center uppercase tracking-wider mr-1">
            <Zap className="w-3.5 h-3.5 mr-1 text-amber-500" aria-hidden="true" />
            Presets:
          </span>

          <button
            type="button"
            onClick={() => onSelectPreset('delhi-severe')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-2xs focus:ring-2 focus:ring-purple-500 ${
              isPresetActive && activePresetId === 'delhi-severe'
                ? 'bg-purple-900 text-white border-purple-900 ring-2 ring-purple-400'
                : 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100'
            }`}
          >
            {t.presetDelhi}
          </button>

          <button
            type="button"
            onClick={() => onSelectPreset('lahore-hazardous')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-2xs focus:ring-2 focus:ring-rose-500 ${
              isPresetActive && activePresetId === 'lahore-hazardous'
                ? 'bg-rose-900 text-white border-rose-900 ring-2 ring-rose-400'
                : 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100'
            }`}
          >
            {t.presetLahore}
          </button>

          <button
            type="button"
            onClick={() => onSelectPreset('moderate-haze')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-2xs focus:ring-2 focus:ring-amber-500 ${
              isPresetActive && activePresetId === 'moderate-haze'
                ? 'bg-amber-800 text-white border-amber-800 ring-2 ring-amber-400'
                : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
          >
            {t.presetModerate}
          </button>
        </div>
      </div>
    </section>
  );
};
