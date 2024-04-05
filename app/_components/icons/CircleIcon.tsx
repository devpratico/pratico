import {IconProps, iconSizeMap} from "../../_utils/icons/IconProps"


export default function CircleIcon({className, fill=true, size}: IconProps) {

    const EmptyPath = () => (
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
    )

    const FilledPath = () => (
        <circle cx="8" cy="8" r="8"/>
    )
    
    const style = size ? {width: iconSizeMap[size], height: iconSizeMap[size]} : {}

    return (
        <div className={className} style={style}>
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16" overflow="visible">
                {fill ? <FilledPath/> : <EmptyPath/>}
            </svg>
        </div>
    )
}