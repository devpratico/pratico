export type IconSize = "sm" | "md" | "lg" | "max";

export const iconSizeMap = {
    "sm": "1.5rem",
    "md": "1.6rem",
    "lg": "2.5rem",
    "max": "100%",
}

export interface IconProps {
    className?: string;
    fill?: boolean;
    size?: IconSize;
}