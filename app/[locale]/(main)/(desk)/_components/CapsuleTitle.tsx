import { fetchCapsuleTitle } from '@/app/api/_actions/room2';
import { Text, TextProps, Skeleton, IconButton, Flex } from '@radix-ui/themes';
import { Suspense } from 'react';
import { SquarePen } from 'lucide-react';
import EditTitlePopover from './EditTitlePopover';

interface TitleProps  {
    capsuleId: string;
    /**
     * If true, the input won't be editable
     */
    editable?: boolean;
}



function EditButton() {
    return (
        <IconButton size='1' variant='ghost' style={{opacity:'0.5'}}>
            <SquarePen size='20' color='var(--accent-contrast)'/>
        </IconButton>
    )
}


async function CapsuleTitleS({ capsuleId, editable=true , ...props }: TitleProps & TextProps) {
    const title = await fetchCapsuleTitle(capsuleId)

    return (
        <Flex gap='2' align='center'>
            <Text {...props} >{title}</Text>
            {editable &&
                <EditTitlePopover capsuleId={capsuleId} trigger={<EditButton />} />
            }
        </Flex>
    )
}

export default function CapsuleTitle({ capsuleId, editable=true, ...props }: TitleProps & TextProps) {
    return (
        <Suspense fallback={<Text {...props}><Skeleton>Title capsule</Skeleton></Text>}>
            <CapsuleTitleS capsuleId={capsuleId} editable={editable} {...props} />
        </Suspense>
    )
}