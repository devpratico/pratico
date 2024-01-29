import { IconProps, iconSizeMap } from '@/utils/icons/IconProps';


export default function ShapesIcon({className, fill=true, size}: IconProps) {

    const EmptyPath = () => (
        <g>
            <path d="M5.13473 10.0512L0.986726 10.0512L0.986726 0.911715L10.1262 0.911715L10.1262 5.06289" fill="none" opacity="1" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="1"/>
            <path d="M5.1379 10.0512C5.1379 7.29623 7.37124 5.06289 10.1262 5.06289C12.8812 5.06289 15.1145 7.29623 15.1145 10.0512C15.1145 12.8062 12.8812 15.0395 10.1262 15.0395C7.37124 15.0395 5.1379 12.8062 5.1379 10.0512Z" fill="none" opacity="1" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="1"/>
        </g>
    )

    const FillPath = () => (
        <g>
            <path d="M5.1379 10.0512C5.1379 7.29623 7.37124 5.06289 10.1262 5.06289C12.8812 5.06289 15.1145 7.29623 15.1145 10.0512C15.1145 12.8062 12.8812 15.0395 10.1262 15.0395C7.37124 15.0395 5.1379 12.8062 5.1379 10.0512Z" fill="currentColor" fillRule="nonzero" opacity="1" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="1"/>
            <path d="M1 0.40625C0.723858 0.40625 0.5 0.630108 0.5 0.90625C0.5 2.04869 0.5 8.92006 0.5 10.0625C0.5 10.3386 0.723857 10.5625 1 10.5625L3.52836 10.5669C3.51496 10.3943 3.5 10.2386 3.5 10.0625C3.5 6.3954 6.4579 3.40625 10.125 3.40625C10.3011 3.40625 10.4523 3.40884 10.625 3.42237L10.625 0.90625C10.625 0.630108 10.4011 0.40625 10.125 0.40625L1 0.40625Z" fill="currentColor" fillRule="nonzero" opacity="1" stroke="none"/>
        </g>
    )

    const style = size ? {width: iconSizeMap[size], height: iconSizeMap[size]} : {width: "100%", height: "100%"}

    return (
        <div className={className} style={style}>
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16" overflow="visible" shapeRendering="auto">
                {fill ? <FillPath/> : <EmptyPath/>}
            </svg>
        </div>
    )
}