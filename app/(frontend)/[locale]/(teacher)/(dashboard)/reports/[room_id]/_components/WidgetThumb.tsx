import { Flex, Text, TextProps, Strong } from "@radix-ui/themes";


export interface WidgetThumbProps {
    bigText: string;
    bigTextOption?: string;    
    smallText?: string; // "Taux de reussite" | "Taux de participation" (quiz/sondage) | "PARTICIPANT(S)" (attendance)
    color?: string;

};

export function WidgetThumb({ bigText, bigTextOption, smallText, color }: WidgetThumbProps) {
	return (
		<Flex direction="column" align="center">
            <Flex align="baseline">
                 <Text size="9" style={{ color }}>
                    <Strong>{bigText}</Strong>
                </Text>
                <Text size="5" style={{ color }}>{bigTextOption}</Text>
            </Flex>
           
            <Text style={{ color }}>
                {smallText}
            </Text>
		</Flex>
	)
}