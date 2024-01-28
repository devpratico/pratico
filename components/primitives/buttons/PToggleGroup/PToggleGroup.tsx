'use client'
import { useState } from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import styles from './PToggleGroup.module.css';
import { getIcon } from '@/utils/old_Icons';

export default function PToggleGroup(){

    const gridIcon = getIcon('grip');
    const listIcon = getIcon('list');

    const [selectedValue, setSelectedValue] = useState('grid');

    // Handle the change of the selected value
    const handleValueChange = (value: string) => {
        // Change the selected value only if it's not "" (when the user click on the same button, the value changes to "")
        if (value) {
            setSelectedValue(value);
        }
    };


    return (
        <ToggleGroup.Root
            className={`${styles.ToggleGroup} smallShadow`}
            type="single"
            value={selectedValue}
            defaultValue="grid"
            onValueChange={handleValueChange}
        >
            <ToggleGroup.Item
                value="grid"
                className={styles.ToggleGroupItem}
            >
                {gridIcon}
            </ToggleGroup.Item>

            <ToggleGroup.Item
                className={styles.ToggleGroupItem}
                value="list"
            >
                {listIcon}
            </ToggleGroup.Item>


        </ToggleGroup.Root>
    );
};