import {IconProps, iconSizeMap} from "../../../_utils/icons/IconProps"

export default function BlankPenIcon({className, fill=true, size}: IconProps) {

    const FillPath = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16" overflow="visible">
            <path d="M13.8777 0.417809L15.5847 2.12481C16.1139 2.7183 16.088 3.6216 15.5257 4.18381L4.854 14.854C4.78966 14.918 4.70912 14.9633 4.621 14.985L0.621 15.985C0.450734 16.0274 0.270703 15.9774 0.146631 15.8534C0.0225578 15.7293-0.0273981 15.5493 0.015 15.379L1.015 11.379C1.03688 11.2912 1.08215 11.2111 1.146 11.147C1.146 11.147 11.5909 0.701416 11.8797 0.418809C12.4486-0.089572 13.3084-0.0900023 13.8777 0.417809"/>
        </svg>
    )

    const EmptyPath = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16" overflow="visible">
            <path d="M13.8777 0.417809L15.5847 2.12481C16.1139 2.7183 16.088 3.6216 15.5257 4.18381L4.854 14.854C4.78966 14.918 4.70912 14.9633 4.621 14.985L0.621 15.985C0.450734 16.0274 0.270703 15.9774 0.146631 15.8534C0.0225578 15.7293-0.0273981 15.5493 0.015 15.379L1.015 11.379C1.03688 11.2912 1.08215 11.2111 1.146 11.147C1.146 11.147 11.5909 0.701416 11.8797 0.418809C12.4486-0.089572 13.3084-0.0900023 13.8777 0.417809M13.2337 1.18381C13.0385 0.988618 12.722 0.988618 12.5267 1.18381L1.95 11.756L1.186 14.813L4.243 14.049L14.8197 3.47681C14.9138 3.38301 14.9666 3.25564 14.9666 3.12281C14.9666 2.98998 14.9138 2.86261 14.8197 2.76881L13.2337 1.18381Z" fillRule="nonzero" opacity="1" stroke="none"/>
        </svg>
    )

    const style = size ? {width: iconSizeMap[size], height: iconSizeMap[size]} : {}

    return (
        <div className={className} style={style}>
            {fill ? <FillPath/> : <EmptyPath/>}
        </div>
    )
}