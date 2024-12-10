import { Flex, Text, TextProps, Strong } from "@radix-ui/themes";


export interface WidgetThumbProps {
    bigText: string;
    smallText?: string; // "Taux de reussite" | "Taux de participation" (quiz/sondage) | "PARTICIPANT(S)" (attendance)
    color?: TextProps["color"];
};

export function WidgetThumb({ bigText, smallText, color }: WidgetThumbProps) {
	return (
		<Flex direction="column" align="center">
            <Text size="9" color={color}>
                <Strong>{bigText}</Strong>
            </Text>
            <Text color={color}>
                {smallText}
            </Text>
		</Flex>
	)
}