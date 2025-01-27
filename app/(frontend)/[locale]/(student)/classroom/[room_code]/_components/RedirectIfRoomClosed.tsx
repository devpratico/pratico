'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import createClient from '@/supabase/clients/client';
import { Tables } from '@/supabase/types/database.types';
import logger from '@/app/_utils/logger';
import { useOnWake } from '@/app/(frontend)/_hooks/standalone/useOnWake';
import { Room } from '@/app/(backend)/api/room/types';



export default function RedirectIfRoomClosed(props: {
    children: React.ReactNode;
    roomId: string;
}) {
    const { children, roomId } = props;
    const router = useRouter();
    const fetchInitialStatus = useCallback(async () => {
        if (!roomId) return
        const supabase = createClient();
        const { data, error } = await supabase
            .from('rooms')
            .select('status, code')
            .eq('id', roomId)
            .order('end_of_session', { ascending: false })
            .limit(1)
            .single<Room>();

        if (error) {
            logger.log('supabase:database', 'useRoom.tsx', `error fetching room with id ${roomId}...`, error.message);
            return;
        }
        logger.log('supabase:database', 'useRoom.tsx', `fetched room ${data.code}...`, data);
        if (data.status === 'closed')
            router.push(`/classroom/closed/${roomId}`);
    }, [roomId, router]);

    useEffect(() => {
        fetchInitialStatus();
    }, [fetchInitialStatus]);

    useOnWake(fetchInitialStatus);

    useEffect(() => {

        const supabase = createClient();
        const subscription = supabase
            .channel('check_room_status')
            .on<Tables<'rooms'>>('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'rooms',
                filter: `id=eq.${roomId}`,

            }, payload => {
                const newRecord = payload.new;
                if (newRecord.status === 'closed') {
                    router.push(`/classroom/closed/${roomId}`);
                }
            }).subscribe();

        return () => {subscription.unsubscribe()};
    }, [router, roomId]);

    return children;
}