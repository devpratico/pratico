import {IconProps, iconSizeMap} from "../../../_utils/icons/IconProps"


export default function SquareIcon({className, fill=true, size}: IconProps) {

    const EmptyPath = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16" overflow="visible">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
        </svg>
    )

    const FilledPath = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16" overflow="visible">
            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z"/>
        </svg>
    )
    
    const style = size ? {width: iconSizeMap[size], height: iconSizeMap[size]} : {width: "100%", height: "100%"}

    return (
        <div className={className} style={style}>
            {fill ? <FilledPath/> : <EmptyPath/>}
        </div>
    )
}