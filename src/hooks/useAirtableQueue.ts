import { useState, useEffect, useCallback } from 'react';
import { getCampaignRecords, type CampaignRecord } from '../services/airtableApi';

export function useAirtableQueue() {
  const [records, setRecords] = useState<CampaignRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY as string | undefined;
    if (!apiKey) {
      setError('Add VITE_AIRTABLE_API_KEY to your .env file to load the queue.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getCampaignRecords(apiKey);
      setRecords(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  return { records, loading, error, refresh: fetchRecords };
}
