interface DashLineIconProps {
    className?: string;
  }


export default function DashLineIcon({className}: DashLineIconProps) {
    return (
        <svg
            height="100%"
            strokeMiterlimit="10"
            style={{ 
                fillRule: "nonzero", 
                clipRule: "evenodd", 
                strokeLinecap: "round", 
                strokeLinejoin: "round" 
            }} 
            version="1.1"
            viewBox="0 0 100 100"
            width="100%"
            xmlSpace="preserve"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
        >

            <path
                d="M14.4493 85.4074L85.5507 14.5926"
                fill="none"
                opacity="1"
                stroke="currentColor"
                strokeDasharray="0.0,33.0"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="19"
            />

        </svg>
    )
}