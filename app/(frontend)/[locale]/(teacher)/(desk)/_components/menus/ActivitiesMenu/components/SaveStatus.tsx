import { Cloud, CloudOff, CloudUpload, LucideProps } from 'lucide-react'
import { Tooltip, TooltipProps } from '@radix-ui/themes'


/** A cloud icon indicating the status of the saving process */
export default function SaveStatus({ isSaving, savingError }: { isSaving: boolean, savingError: boolean }) {
    const tooltipProps: Omit<TooltipProps, 'content'> = { side: 'left' }
    const iconProps: LucideProps = { size: 18, strokeWidth: 2, absoluteStrokeWidth: true }

    if (isSaving) {
        return (
            <Tooltip content='Sauvegarde en cours...' {...tooltipProps}>
                <CloudUpload color='var(--gray-9)' {...iconProps} />
            </Tooltip>
        )
    }

    if (savingError) {
        return (
            <Tooltip content='Erreur lors de la sauvegarde' {...tooltipProps}>
                <CloudOff color='var(--red-9)' {...iconProps} />
            </Tooltip>
        )
    }

    return (
        <Tooltip content='Sauvegardé' {...tooltipProps}>
            <Cloud color='var(--gray-9)' {...iconProps} />
        </Tooltip>
    )
}