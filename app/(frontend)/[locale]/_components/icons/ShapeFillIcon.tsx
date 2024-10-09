import {IconProps, iconSizeMap} from "../../../../_utils/icons/IconProps"


export default function ShapeFillIcon({className, size}: IconProps) {
    
    const style = size ? {width: iconSizeMap[size], height: iconSizeMap[size]} : {}

    return (
        <div className={className} style={style}>
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16" overflow="visible">
            <path d="M3.05311e-16 8C3.05311e-16 3.58172 3.58172 3.05311e-16 8 3.05311e-16C12.4183 3.05311e-16 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 3.05311e-16 12.4183 3.05311e-16 8Z" fill="currentColor" fillRule="nonzero" opacity="0.5" stroke="none"/>
            <use fill="none" mask="url(#StrokeMask)" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="2" xlinkHref="#Fill"/>
            </svg>
        </div>
    )
}