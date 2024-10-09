'use client'
import styles from './Form.module.css';
import * as FormPrimitive from '@radix-ui/react-form';
import { Button } from '@radix-ui/themes';


export interface Field {
    name: string;
    placeholder: string;
    label?: string;
    type: string;
    required?: boolean;
    errorMessage?: string;
}

interface FormProps {
    fields: Field[];
    submitBtnLabel?: string;
    onSubmit?: (event: React.FormEvent) => void;
    cancelBtnLabel?: string;
    onCancel?: () => void;
}

export default function Form({ fields, submitBtnLabel='OK', onSubmit, cancelBtnLabel, onCancel }: FormProps) {
    
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); // Prevent the default form submit action
        if (onSubmit) onSubmit(event);
    };
    
    return(
        <FormPrimitive.Root onSubmit={handleSubmit} className={styles.form}>
            
            {fields.map((field) => (
                <FormPrimitive.Field key={field.name} name={field.name} className={styles.field}>

                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                        {field.label && <FormPrimitive.Label className={styles.label}>{field.label}</FormPrimitive.Label>}
                        {field.errorMessage && (
                            <FormPrimitive.Message match='valueMissing' className={styles.message}>
                                {field.errorMessage}
                            </FormPrimitive.Message>
                        )}
                    </div>
                        
                    <FormPrimitive.Control asChild>
                        <input 
                            type={field.type} 
                            placeholder={field.placeholder} 
                            required={field.required} 
                            className={styles.textInput} 
                        />
                    </FormPrimitive.Control>
                </FormPrimitive.Field>
            ))}
                    
            <div className={styles.buttonsContainer}>
                {/*cancelBtnLabel && <PlainBtn message={cancelBtnLabel} color="secondary" style="solid" size="m" onClick={onCancel} />*/}
                <Button type="submit">{submitBtnLabel}</Button>
            </div>

        </FormPrimitive.Root>
    );
};
            