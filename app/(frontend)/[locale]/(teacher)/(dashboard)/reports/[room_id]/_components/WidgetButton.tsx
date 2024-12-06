"use client";
import { Button, ButtonProps } from "@radix-ui/themes";


interface WidgetButtonProps extends ButtonProps {}

export default function WidgetButton({...props}: WidgetButtonProps) {
	return (
		<Button {...props} radius="full" variant="soft">
			{props.children}
		</Button>
	);
};