import {IconProps, iconSizeMap} from "../../utils/icons/IconProps"


export default function ShapeEmptyIcon({className, size}: IconProps) {
    
    const style = size ? {width: iconSizeMap[size], height: iconSizeMap[size]} : {}

    return (
        <div className={className} style={style}>
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16" overflow="visible">
                <defs>
                <path d="M3.05311e-16 8C3.05311e-16 3.58172 3.58172 3.05311e-16 8 3.05311e-16C12.4183 3.05311e-16 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 3.05311e-16 12.4183 3.05311e-16 8Z" id="Fill"/>
                </defs>
                <g id="Calque-1">
                <path d="M12.9255 2.31817L2.94569 13.4115" fill="none" opacity="1" stroke="#e94420" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="1"/>
                <g opacity="1">
                <mask height="16" id="StrokeMask" maskUnits="userSpaceOnUse" width="16" x="3.05311e-16" y="3.05311e-16">
                <rect fill="#000000" height="16" stroke="none" width="16" x="3.05311e-16" y="3.05311e-16"/>
                <use fill="#ffffff" fillRule="evenodd" stroke="none" xlinkHref="#Fill"/>
                </mask>
                <use fill="none" mask="url(#StrokeMask)" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="2" xlinkHref="#Fill"/>
                </g>
                </g>
            </svg>
        </div>
    )
}