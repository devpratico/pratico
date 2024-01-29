import { IconProps } from '@/utils/icons/IconProps';

export default function ImageIcon({className }: IconProps) {

    const EmptyPath = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16" overflow="visible">
            <path d="M0.59958 2.40706L15.4004 2.40706L15.4004 13.5929L0.59958 13.5929L0.59958 2.40706Z" fill="none" opacity="1" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="1"/>
            <path d="M0.621954 10.7491L3.64985 8.65744L6.79495 10.5976L11.5841 6.72914L15.3041 10.7873" fill="none" opacity="1" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="1"/>
            <path d="M4.74137 5.84957C4.74137 4.84953 5.55206 4.03884 6.5521 4.03884C7.55213 4.03884 8.36282 4.84953 8.36282 5.84957C8.36282 6.84961 7.55213 7.6603 6.5521 7.6603C5.55206 7.6603 4.74137 6.84961 4.74137 5.84957Z" fill="none" opacity="1" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="1"/>
        </svg>
    )

    return (
        <div className={className}>
            <EmptyPath/>
        </div>
    )
}