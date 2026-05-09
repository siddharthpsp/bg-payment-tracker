import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTrackerBin, loadTrackerState, saveTrackerState, TrackerState } from './jsonbin';

describe('JsonBin Storage', () => {
  let testBinId: string;
  const testData: TrackerState = {
    invoices: [{ id: 1, amount: 1000 }],
    bgs: [{ id: 1, bgAmount: 5000 }],
    paymentHistory: [],
    lastUpdated: Date.now(),
  };

  it('should create a new bin in JsonBin', async () => {
    try {
      testBinId = await createTrackerBin(testData);
      expect(testBinId).toBeDefined();
      expect(typeof testBinId).toBe('string');
      expect(testBinId.length).toBeGreaterThan(0);
    } catch (error) {
      console.error('JsonBin creation failed:', error);
      throw error;
    }
  });

  it('should load tracker state from JsonBin', async () => {
    if (!testBinId) {
      throw new Error('Bin ID not set from previous test');
    }
    try {
      const loadedData = await loadTrackerState(testBinId);
      expect(loadedData).toBeDefined();
      expect(loadedData.invoices).toEqual(testData.invoices);
      expect(loadedData.bgs).toEqual(testData.bgs);
    } catch (error) {
      console.error('JsonBin load failed:', error);
      throw error;
    }
  });

  it('should save updated tracker state to JsonBin', async () => {
    if (!testBinId) {
      throw new Error('Bin ID not set from previous test');
    }
    try {
      const updatedData: TrackerState = {
        ...testData,
        invoices: [{ id: 1, amount: 2000 }, { id: 2, amount: 3000 }],
        lastUpdated: Date.now(),
      };
      await saveTrackerState(testBinId, updatedData);
      
      const loadedData = await loadTrackerState(testBinId);
      expect(loadedData.invoices.length).toBe(2);
      expect(loadedData.invoices[1].amount).toBe(3000);
    } catch (error) {
      console.error('JsonBin save failed:', error);
      throw error;
    }
  });
});
