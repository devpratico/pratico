import {IconProps, iconSizeMap} from "../../../_utils/icons/IconProps"


export default function HighlighterIcon({className, fill=true, size}: IconProps) {

    const EmptyPath = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16" overflow="visible">
            <path fillRule="evenodd" d="M11.096.644a2 2 0 0 1 2.791.036l1.433 1.433a2 2 0 0 1 .035 2.791l-.413.435-8.07 8.995a.5.5 0 0 1-.372.166h-3a.5.5 0 0 1-.234-.058l-.412.412A.5.5 0 0 1 2.5 15h-2a.5.5 0 0 1-.354-.854l1.412-1.412A.5.5 0 0 1 1.5 12.5v-3a.5.5 0 0 1 .166-.372l8.995-8.07zm-.115 1.47L2.727 9.52l3.753 3.753 7.406-8.254zm3.585 2.17.064-.068a1 1 0 0 0-.017-1.396L13.18 1.387a1 1 0 0 0-1.396-.018l-.068.065zM5.293 13.5 2.5 10.707v1.586L3.707 13.5z"/>
        </svg>
    )

    const FilledPath = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16" overflow="visible">
            <path d="M11.096 0.644C11.8823-0.102495 13.1202-0.0865272 13.887 0.68L15.32 2.113C16.0862 2.88006 16.1018 4.11797 15.355 4.904L14.942 5.339L6.872 14.334C6.77718 14.4396 6.64194 14.5 6.5 14.5L3.5 14.5C3.41844 14.5 3.3381 14.4801 3.266 14.442L2.854 14.854C2.76005 14.9477 2.6327 15.0002 2.5 15L0.5 15C0.297491 15.0004 0.114762 14.8785 0.0372157 14.6915C-0.0403301 14.5044 0.00262316 14.289 0.146 14.146L1.558 12.734C1.51987 12.6619 1.49996 12.5816 1.5 12.5L1.5 9.5C1.50002 9.35806 1.56037 9.22282 1.666 9.128L10.661 1.058L11.096 0.644ZM14.566 4.284L14.63 4.216C15.0038 3.82305 14.9963 3.20372 14.613 2.82L13.18 1.387C12.7965 1.00341 12.1772 0.995427 11.784 1.369L11.716 1.434L14.566 4.284ZM5.293 13.5L2.5 10.707L2.5 12.293L3.707 13.5L5.293 13.5Z"/>
        </svg>
    )
    
    const style = size ? {width: iconSizeMap[size], height: iconSizeMap[size]} : {}

    return (
        <div className={className} style={style}>
            {fill ? <FilledPath/> : <EmptyPath/>}
        </div>
    )
}