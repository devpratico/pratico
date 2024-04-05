'use client'
import { useEditor, useComputed, useValue } from 'tldraw'
import { useRoom } from '@/app/_hooks/useRoom'
import { roomParams } from '@/supabase/services/rooms'
import { useEffect, useMemo } from 'react'
import logger from '@/app/_utils/logger'


const NavigatorSync = () => {
    const editor  = useEditor()
    const { room } = useRoom()

    
    const idToFollow = useMemo(() => {
        const params = room?.params
        const paramsObject = params ? JSON.parse(String(params)) as roomParams : null
        const follow = paramsObject?.navigation?.follow
        logger.log('tldraw:editor', 'Id to follow:', follow)
        return follow
    }, [room])

    

    const $pageToBeOn = useComputed( 'presence to follow', () => {
            if (!idToFollow) return undefined
            return editor.store.query.record("instance_presence", () => ({ userId: { eq: idToFollow }})).get()?.currentPageId
        },
        { isEqual: (a, b) => `${a}` == `${b}` },
        [idToFollow, editor]
    )

    
    const pageToBeOn = useValue($pageToBeOn)
    
    
    useEffect(() => {
        if (pageToBeOn) {
            logger.log('tldraw:editor', 'Following page:', pageToBeOn)
            editor.setCurrentPage(pageToBeOn)
        }
    }, [editor, pageToBeOn])
    
    
    
    return null
}

export default NavigatorSync