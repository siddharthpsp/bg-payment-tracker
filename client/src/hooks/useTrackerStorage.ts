import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { createTrackerBin, loadTrackerState, saveTrackerState, TrackerState, getOrCreateBinId } from '@/lib/jsonbin';

export interface UseTrackerStorageResult {
  state: any | null;
  isLoading: boolean;
  isError: boolean;
  isSaving: boolean;
  error: Error | null;
  saveState: (state: any) => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Hook that provides a unified storage interface
 * Uses JsonBin for GitHub Pages, tRPC for Manus hosting
 */
export function useTrackerStorage(): UseTrackerStorageResult {
  const isGitHubPages = window.location.hostname.includes('github.io');
  
  // tRPC version
  const cloudStateQuery = trpc.tracker.getSharedState.useQuery(undefined, {
    enabled: !isGitHubPages,
    retry: 1,
  });
  const saveTrackerStateMutation = trpc.tracker.saveSharedState.useMutation();

  // JsonBin version
  const [jsonbinState, setJsonbinState] = useState<any | null>(null);
  const [jsonbinLoading, setJsonbinLoading] = useState(isGitHubPages);
  const [jsonbinError, setJsonbinError] = useState<Error | null>(null);
  const [jsonbinSaving, setJsonbinSaving] = useState(false);

  // Load JsonBin state on mount
  useEffect(() => {
    if (!isGitHubPages) return;

    const loadJsonBinState = async () => {
      try {
        setJsonbinLoading(true);
        setJsonbinError(null);
        const binId = getOrCreateBinId();
        const state = await loadTrackerState(binId);
        setJsonbinState(state);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setJsonbinError(error);
        console.error('Failed to load JsonBin state:', error);
      } finally {
        setJsonbinLoading(false);
      }
    };

    loadJsonBinState();
  }, [isGitHubPages]);

  // Save JsonBin state
  const saveJsonBinState = async (state: any) => {
    try {
      setJsonbinSaving(true);
      const binId = getOrCreateBinId();
      const trackerState: TrackerState = {
        invoices: state.invoices || [],
        bgs: state.bgs || [],
        paymentHistory: state.paymentHistory || [],
        lastUpdated: Date.now(),
      };
      await saveTrackerState(binId, trackerState);
      setJsonbinState(state);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setJsonbinError(error);
      console.error('Failed to save JsonBin state:', error);
      throw error;
    } finally {
      setJsonbinSaving(false);
    }
  };

  // Return unified interface
  if (isGitHubPages) {
    return {
      state: jsonbinState,
      isLoading: jsonbinLoading,
      isError: !!jsonbinError,
      isSaving: jsonbinSaving,
      error: jsonbinError,
      saveState: saveJsonBinState,
      refetch: async () => {
        setJsonbinLoading(true);
        try {
          const binId = getOrCreateBinId();
          const state = await loadTrackerState(binId);
          setJsonbinState(state);
          setJsonbinError(null);
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          setJsonbinError(error);
        } finally {
          setJsonbinLoading(false);
        }
      },
    };
  }

  // tRPC version
  return {
    state: cloudStateQuery.data,
    isLoading: cloudStateQuery.isLoading,
    isError: cloudStateQuery.isError,
    isSaving: saveTrackerStateMutation.isPending,
    error: cloudStateQuery.error as Error | null,
    saveState: async (state: any) => {
      return new Promise((resolve, reject) => {
        saveTrackerStateMutation.mutate(
          { invoices: state.invoices, bgs: state.bgs, paymentHistory: state.paymentHistory },
          {
            onSuccess: () => resolve(),
            onError: (err) => reject(err),
          }
        );
      });
    },
    refetch: () => cloudStateQuery.refetch().then(() => {}),
  };
}
