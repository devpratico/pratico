'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import createClient from '@/supabase/clients/client';
import { Tables } from '@/supabase/types/database.types';



export default function RedirectIfRoomClosed(props: {
    children: React.ReactNode;
    roomId: string;
}) {
    const { children, roomId } = props;
    const router = useRouter();

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