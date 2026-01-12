import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { KeyStatus } from '@/types/database';

export interface Key {
  id: string;
  key_number: number;
  current_holder_id: string | null;
  status: KeyStatus;
  updated_at: string;
  holder_name?: string;
}

export interface KeyTransfer {
  id: string;
  key_id: string;
  from_user_id: string | null;
  to_user_id: string;
  transfer_date: string;
  confirmed: boolean;
  confirmed_at: string | null;
  from_user_name?: string;
  to_user_name?: string;
}

export function useKeys() {
  const [keys, setKeys] = useState<Key[]>([]);
  const [pendingTransfers, setPendingTransfers] = useState<KeyTransfer[]>([]);
  const [transferHistory, setTransferHistory] = useState<KeyTransfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchKeys = async () => {
    setIsLoading(true);
    try {
      const { data: keysData, error: keysError } = await supabase
        .from('keys')
        .select('*')
        .order('key_number', { ascending: true });

      if (keysError) throw keysError;

      // Fetch holder names
      if (keysData) {
        const holderIds = keysData
          .filter(k => k.current_holder_id)
          .map(k => k.current_holder_id as string);

        if (holderIds.length > 0) {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', holderIds);

          const keysWithHolders = keysData.map(key => ({
            ...key,
            holder_name: profilesData?.find(p => p.id === key.current_holder_id)?.full_name || 'Inconnu',
          }));

          setKeys(keysWithHolders);
        } else {
          setKeys(keysData);
        }
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransfers = async () => {
    try {
      // Pending transfers
      const { data: pendingData, error: pendingError } = await supabase
        .from('key_transfers')
        .select('*')
        .eq('confirmed', false)
        .order('transfer_date', { ascending: false });

      if (pendingError) throw pendingError;
      setPendingTransfers(pendingData || []);

      // Transfer history
      const { data: historyData, error: historyError } = await supabase
        .from('key_transfers')
        .select('*')
        .eq('confirmed', true)
        .order('confirmed_at', { ascending: false })
        .limit(20);

      if (historyError) throw historyError;
      setTransferHistory(historyData || []);
    } catch (err) {
      console.error('Error fetching transfers:', err);
    }
  };

  useEffect(() => {
    fetchKeys();
    fetchTransfers();
  }, []);

  const initiateTransfer = async (keyId: string, fromUserId: string | null, toUserId: string) => {
    const { error } = await supabase
      .from('key_transfers')
      .insert({
        key_id: keyId,
        from_user_id: fromUserId,
        to_user_id: toUserId,
      });

    if (error) throw error;
    await fetchTransfers();
  };

  const confirmTransfer = async (transferId: string) => {
    // Get transfer details
    const { data: transfer, error: fetchError } = await supabase
      .from('key_transfers')
      .select('*')
      .eq('id', transferId)
      .single();

    if (fetchError) throw fetchError;

    // Update transfer as confirmed
    const { error: updateError } = await supabase
      .from('key_transfers')
      .update({
        confirmed: true,
        confirmed_at: new Date().toISOString(),
      })
      .eq('id', transferId);

    if (updateError) throw updateError;

    // Update key holder
    const { error: keyError } = await supabase
      .from('keys')
      .update({
        current_holder_id: transfer.to_user_id,
        status: 'held' as KeyStatus,
      })
      .eq('id', transfer.key_id);

    if (keyError) throw keyError;

    await fetchKeys();
    await fetchTransfers();
  };

  const cancelTransfer = async (transferId: string) => {
    const { error } = await supabase
      .from('key_transfers')
      .delete()
      .eq('id', transferId);

    if (error) throw error;
    await fetchTransfers();
  };

  return {
    keys,
    pendingTransfers,
    transferHistory,
    isLoading,
    error,
    fetchKeys,
    fetchTransfers,
    initiateTransfer,
    confirmTransfer,
    cancelTransfer,
  };
}
