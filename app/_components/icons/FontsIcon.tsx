import { IconProps, iconSizeMap } from '@/app/_utils/icons/IconProps';


export default function FontsIcon({className, size}: IconProps) {

    const FillPath = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16" overflow="visible">
            <path d="M1.71013 1.71013L14.2899 1.71013" fill="none" opacity="1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
            <path d="M8 1.71013L8 14.2899" fill="none" opacity="1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
        </svg>
    )

    const style = size ? {width: iconSizeMap[size], height: iconSizeMap[size]} : {}

    return (
        <div className={className} style={style}>
            <FillPath/>
        </div>
    )
}