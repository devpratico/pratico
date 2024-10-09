import { IconProps, iconSizeMap } from '@/app/_utils/icons/IconProps';


export default function EmptyDottedShapesIcon({className,  size}: IconProps) {

    const EmptyPath = () => (
        <g>
            <path d="M0.870124 0.911715L10.1262 0.911715L10.1262 10.0512L0.870124 10.0512L0.870124 0.911715Z" fill="none" opacity="1" stroke="currentColor" strokeDasharray="0.0,2.3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3"/>
            <path d="M7.63988 5.72668C10.0282 4.35352 13.0776 5.17651 14.4507 7.56487C15.8239 9.95324 15.0009 13.0026 12.6125 14.3757C10.2242 15.7489 7.17485 14.9259 5.80169 12.5375C4.42854 10.1492 5.25152 7.09984 7.63988 5.72668Z" fill="none" opacity="1" stroke="currentColor" strokeDasharray="0.0,2.55" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3"/>
        </g>
    )

    const style = size ? {width: iconSizeMap[size], height: iconSizeMap[size]} : {width: "100%", height: "100%"}

    return (
        <div className={className} style={style}>
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16" overflow="visible" shapeRendering="auto">
                <EmptyPath/>
            </svg>
        </div>
    )
}