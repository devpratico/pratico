"use client";
import { Button, ButtonProps, Strong } from "@radix-ui/themes";


interface WidgetButtonProps extends ButtonProps {}

export default function WidgetButton({...props}: WidgetButtonProps) {
	return (
		<Button {...props} size="1" radius="full" variant="soft">
			<Strong>
				{props.children}
			</Strong>
		</Button>
	);
};