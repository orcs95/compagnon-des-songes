import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { EventType } from '@/types/database';

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_type: EventType;
  start_date: string;
  end_date: string | null;
  location: string | null;
  price: number;
  max_participants: number | null;
  payment_link: string | null;
  is_recurring: boolean;
  recurrence_pattern: string | null;
  created_by: string;
  created_at: string;
  registrations_count?: number;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  status: 'registered' | 'cancelled' | 'waitlist';
  registered_at: string;
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const createEvent = async (event: Omit<Event, 'id' | 'created_at' | 'registrations_count'>) => {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single();

    if (error) throw error;
    await fetchEvents();
    return data;
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    await fetchEvents();
    return data;
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchEvents();
  };

  return {
    events,
    isLoading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}

export function useEventRegistrations(eventId?: string) {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [userRegistration, setUserRegistration] = useState<EventRegistration | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRegistrations = async () => {
    if (!eventId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId);

      if (error) throw error;
      setRegistrations(data || []);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserRegistration = async (userId: string) => {
    if (!eventId) return;

    const { data } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle();

    setUserRegistration(data);
  };

  useEffect(() => {
    fetchRegistrations();
  }, [eventId]);

  const register = async (userId: string) => {
    if (!eventId) throw new Error('Event ID required');

    const { data, error } = await supabase
      .from('event_registrations')
      .insert({
        event_id: eventId,
        user_id: userId,
        status: 'registered',
      })
      .select()
      .single();

    if (error) throw error;
    await fetchRegistrations();
    setUserRegistration(data);
    return data;
  };

  const cancelRegistration = async (userId: string) => {
    if (!eventId) throw new Error('Event ID required');

    const { error } = await supabase
      .from('event_registrations')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);

    if (error) throw error;
    await fetchRegistrations();
    setUserRegistration(null);
  };

  return {
    registrations,
    userRegistration,
    isLoading,
    fetchRegistrations,
    fetchUserRegistration,
    register,
    cancelRegistration,
  };
}
