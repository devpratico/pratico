import styles from './RadioGroup.module.css';
import * as RG from '@radix-ui/react-radio-group';

interface RadioBtn {
    value: string;
    label: string;
}

interface RadioGroupProps {
    ariaLabel: string;
    defaultValue: string;
    radios: RadioBtn[];
    onValueChange: (value: string) => void;
}

export default function RadioGroup({ ariaLabel, defaultValue, radios, onValueChange }: RadioGroupProps) {
    return (
        <form>
            <RG.Root className={styles.container} defaultValue={defaultValue} aria-label={ariaLabel} onValueChange={onValueChange}>
                {radios.map((radio, index) => (
                    <div key={radio.value} className={styles.row}>

                        <RG.Item value={radio.value} id={index.toString()} className={styles.radio}>
                            <RG.Indicator className={styles.indicator} />
                        </RG.Item>

                        <label htmlFor={index.toString()} className={styles.label}>{radio.label}</label>
                    </div>
                ))}
            </RG.Root>
        </form>
    );
}
