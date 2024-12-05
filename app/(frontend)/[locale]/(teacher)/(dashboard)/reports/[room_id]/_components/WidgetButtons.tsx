"use client";
import { Button, Strong } from "@radix-ui/themes";

export interface WidgetButtonsProps {
	data: {
		type: string, // "attendance" | "capsule" | "activity"
		buttons: {
			label: string,
			onClick: () => void;
		}[]
	}
};

export function WidgetButtons ({ data }: WidgetButtonsProps) {
	return (
		<>
		{
			data.buttons.map((button, index) =>
			{
				return (
					<Button radius="full" variant="soft" key={index} onClick={button.onClick}>
						<Strong>{button.label}</Strong>
					</Button>
				);
			})
		}
		</>
	);
};