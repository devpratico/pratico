import {IconProps, iconSizeMap} from "../../utils/icons/IconProps"

export default function PencilStrokeIcon({className, fill=true, size}: IconProps) {

    const FillPath = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16" overflow="visible">
            <path d="M12.854 0.146C12.6588-0.049191 12.3422-0.049191 12.147 0.146L10.5 1.793L14.207 5.5L15.854 3.854C15.948 3.7602 16.0009 3.63283 16.0009 3.5C16.0009 3.36717 15.948 3.2398 15.854 3.146L12.854 0.146ZM13.5 6.207L9.793 2.5L3.293 9L3.5 9C3.77614 9 4 9.22386 4 9.5L4 10L4.5 10C4.77614 10 5 10.2239 5 10.5L5 11L5.5 11C5.77614 11 6 11.2239 6 11.5L6 12L6.5 12C6.77614 12 7 12.2239 7 12.5L7 12.707L13.5 6.207ZM6.032 13.675C6.01096 13.619 6.00012 13.5598 6 13.5L6 13L5.5 13C5.22386 13 5 12.7761 5 12.5L5 12L4.5 12C4.22386 12 4 11.7761 4 11.5L4 11L3.5 11C3.22386 11 3 10.7761 3 10.5L3 10L2.5 10C2.44022 9.99988 2.38095 9.98904 2.325 9.968L2.146 10.146C2.09835 10.194 2.06093 10.2511 2.036 10.314L0.036 15.314C-0.0383437 15.4997 0.00517883 15.7119 0.146641 15.8534C0.288103 15.9948 0.500269 16.0383 0.686 15.964L5.686 13.964C5.74886 13.9391 5.80601 13.9017 5.854 13.854L6.032 13.675Z" opacity="1" stroke="none"/>
            <path d="M0.45615 15.5122L16 15.5184" fill="none" fillRule="nonzero" opacity="1" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="round" stroke-width="1"/>
        </svg>
    )

    const EmptyPath = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16" overflow="visible">
            <path d="M12.146 0.146C12.2398 0.0519583 12.3672-0.000893784 12.5-0.000893784C12.6328-0.000893784 12.7602 0.0519583 12.854 0.146L15.854 3.146C15.948 3.2398 16.0009 3.36717 16.0009 3.5C16.0009 3.63283 15.948 3.7602 15.854 3.854L5.854 13.854C5.80601 13.9017 5.74886 13.9391 5.686 13.964L0.686 15.964C0.500269 16.0383 0.288103 15.9948 0.146641 15.8534C0.00517883 15.7119-0.0383437 15.4997 0.036 15.314L2.036 10.314C2.06093 10.2511 2.09835 10.194 2.146 10.146L12.146 0.146ZM11.207 2.5L13.5 4.793L14.793 3.5L12.5 1.207L11.207 2.5ZM12.793 5.5L10.5 3.207L4 9.707L4 10L4.5 10C4.77614 10 5 10.2239 5 10.5L5 11L5.5 11C5.77614 11 6 11.2239 6 11.5L6 12L6.293 12L12.793 5.5ZM3.032 10.675L2.926 10.781L1.398 14.602L5.219 13.074L5.325 12.968C5.12968 12.895 5.00016 12.7085 5 12.5L5 12L4.5 12C4.22386 12 4 11.7761 4 11.5L4 11L3.5 11C3.2915 10.9998 3.10498 10.8703 3.032 10.675" fillRule="nonzero" opacity="1" stroke="none"/>
            <path d="M0.426138 15.5136L16 15.5128" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="1" stroke="currentColor" fill="none"/>
        </svg>
    )
    //  fill="none" opacity="1" stroke="#000000" 


    const style = size ? {width: iconSizeMap[size], height: iconSizeMap[size]} : {}

    return (
        <div className={className} style={style}>
            {fill ? <FillPath/> : <EmptyPath/>}
        </div>
    )
}