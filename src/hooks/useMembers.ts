import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { MembershipStatus, BoardRole } from '@/types/database';

export interface Member {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  membership_status: MembershipStatus;
  activities: string[];
  created_at: string;
}

export interface BoardMember {
  id: string;
  user_id: string;
  board_role: BoardRole;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  profile?: Member;
}

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const updateMemberStatus = async (memberId: string, status: MembershipStatus) => {
    const { error } = await supabase
      .from('profiles')
      .update({ membership_status: status })
      .eq('id', memberId);

    if (error) throw error;
    await fetchMembers();
  };

  const updateMemberActivities = async (memberId: string, activities: string[]) => {
    const { error } = await supabase
      .from('profiles')
      .update({ activities })
      .eq('id', memberId);

    if (error) throw error;
    await fetchMembers();
  };

  return {
    members,
    isLoading,
    error,
    fetchMembers,
    updateMemberStatus,
    updateMemberActivities,
  };
}

export function useBoardMembers() {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBoardMembers = async () => {
    setIsLoading(true);
    try {
      // First fetch board members
      const { data: boardData, error: boardError } = await supabase
        .from('board_members')
        .select('*')
        .eq('is_active', true)
        .order('board_role', { ascending: true });

      if (boardError) throw boardError;

      // Then fetch their profiles
      if (boardData && boardData.length > 0) {
        const userIds = boardData.map(b => b.user_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        const boardWithProfiles = boardData.map(board => ({
          ...board,
          profile: profilesData?.find(p => p.id === board.user_id),
        }));

        setBoardMembers(boardWithProfiles as BoardMember[]);
      } else {
        setBoardMembers([]);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardMembers();
  }, []);

  const addBoardMember = async (userId: string, boardRole: BoardRole) => {
    // First add board_member role if not exists
    await supabase
      .from('user_roles')
      .upsert({ user_id: userId, role: 'board_member' });

    const { error } = await supabase
      .from('board_members')
      .insert({
        user_id: userId,
        board_role: boardRole,
      });

    if (error) throw error;
    await fetchBoardMembers();
  };

  const removeBoardMember = async (boardMemberId: string) => {
    const { error } = await supabase
      .from('board_members')
      .update({ is_active: false, end_date: new Date().toISOString().split('T')[0] })
      .eq('id', boardMemberId);

    if (error) throw error;
    await fetchBoardMembers();
  };

  return {
    boardMembers,
    isLoading,
    error,
    fetchBoardMembers,
    addBoardMember,
    removeBoardMember,
  };
}
