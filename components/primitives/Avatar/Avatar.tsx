import styles from './Avatar.module.css';
import * as RadixAvatar from '@radix-ui/react-avatar';


interface AvatarProps {
    size: number;
    src?: string;
    alt: string;
    onLoadingStatusChange?: (status: 'idle' | 'loading' | 'loaded' | 'error') => void;
}

export default function Avatar({ size, src, alt, onLoadingStatusChange }: AvatarProps) {

    const sizeStyles = {width: size, height: size};

    return (
        <RadixAvatar.Root
            className={styles.root}
            style={sizeStyles}
        >
            <RadixAvatar.Image
                className={styles.image}
                src={src}
                alt={alt}
                onLoadingStatusChange={onLoadingStatusChange}
            />

            <RadixAvatar.Fallback className={styles.fallback}>
                {alt}
            </RadixAvatar.Fallback>

        </RadixAvatar.Root>
    )
}