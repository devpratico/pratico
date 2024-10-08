interface FontDrawIconProps {
    className?: string;
  }


export default function FontDrawIcon({className}: FontDrawIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            fill="none"
            viewBox="0 0 30 30">
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="3.2"
                    d="M22.965 11.963c-3.936 0-7.305 6.369-3.908 9.663 3.397 3.294 5.787-4.173 5.853-7.028.066-2.855 1.406 5.128 3.293 7.47M1.8 18.58s4.336-1.311 11.29-1.399m-9.367-6.373a159.096 159.096 0 0 0-.085 6.217m0 0c.014 3.29.08 4.733-.395 5.165-.294.268-.16-2.19.395-5.165Zm0 0c.779-4.18 2.384-9.384 4.788-9.499 4.116-.197 1.386 8.11 5.823 15.055"/>
        </svg>
    )
}