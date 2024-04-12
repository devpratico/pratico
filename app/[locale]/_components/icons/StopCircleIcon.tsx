import { IconProps } from '@/app/_utils/icons/IconProps';


export default function StopCircleIcon({className, fill=true}: IconProps) {

    const FillPath = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16" overflow="visible">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.5 5A1.5 1.5 0 0 0 5 6.5v3A1.5 1.5 0 0 0 6.5 11h3A1.5 1.5 0 0 0 11 9.5v-3A1.5 1.5 0 0 0 9.5 5z"/>
        </svg>
    )

    const EmptyPath = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16" overflow="visible">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5z"/>
        </svg>
    )

    return (
        <div className={className}>
            {fill ? <FillPath/> : <EmptyPath/>}
        </div>
    )
}