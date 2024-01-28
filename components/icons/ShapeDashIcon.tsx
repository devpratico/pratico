import {IconProps, iconSizeMap} from "../../utils/icons/IconProps"


export default function ShapeDashIcon({className, size}: IconProps) {
    
    const style = size ? {width: iconSizeMap[size], height: iconSizeMap[size]} : {}

    return (
        <div className={className} style={style}>
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16" overflow="visible">
            <path d="M8 0.512437C12.1353 0.512437 15.4876 3.86473 15.4876 8C15.4876 12.1353 12.1353 15.4876 8 15.4876C3.86473 15.4876 0.512437 12.1353 0.512437 8C0.512437 3.86473 3.86473 0.512437 8 0.512437Z"
            fill="none" opacity="1" stroke="currentColor" strokeDasharray="0.0,2.6001279356088145" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.996218"/>
            </svg>
        </div>
    )
}