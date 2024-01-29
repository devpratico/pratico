import { IconProps, iconSizeMap } from '@/utils/icons/IconProps';


export default function TransparentShapesIcon({className,  size}: IconProps) {

    const EmptyPath = () => (
        <g>
            <path d="M0.986726 0.911715L10.1262 0.911715L10.1262 10.0512L0.986726 10.0512L0.986726 0.911715Z" fill="none" opacity="1" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="1"/>
            <path d="M5.1379 10.0512C5.1379 7.29623 7.37124 5.06289 10.1262 5.06289C12.8812 5.06289 15.1145 7.29623 15.1145 10.0512C15.1145 12.8062 12.8812 15.0395 10.1262 15.0395C7.37124 15.0395 5.1379 12.8062 5.1379 10.0512Z" fill="none" opacity="1" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="1"/>
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