import { useState, useEffect, useRef } from 'react';
import type { GeocodingResult } from '../types';
import { searchCities } from '../services/airQualityService';

interface UseCitySearchOptions {
  onSelectResult: (hit: GeocodingResult) => void;
}

/**
 * Manage debounced city search, abortable fetch, dropdown state, and keyboard navigation.
 */
export function useCitySearch({ onSelectResult }: UseCitySearchOptions) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSearchError(null);
    setActiveIndex(-1);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
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
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const hits = await searchCities(value, controller.signal);
        setResults(hits);
        if (hits.length === 0) {
          setSearchError(`No cities matching "${value}" were found.`);
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        const message = err instanceof Error ? err.message : 'Location lookup failed. Check connection.';
        setSearchError(message);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
  };

  const resetSearch = (focusInput: boolean = false) => {
    setSearchTerm('');
    setResults([]);
    setIsOpen(false);
    if (focusInput) {
      inputRef.current?.focus();
    }
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
        const item = results[activeIndex];
        if (item) {
          onSelectResult(item);
        }
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return {
    searchTerm,
    results,
    isSearching,
    searchError,
    isOpen,
    activeIndex,
    setActiveIndex,
    setIsOpen,
    containerRef,
    inputRef,
    handleInputChange,
    handleKeyDown,
    resetSearch,
  };
}
