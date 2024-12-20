import { Container, Section, Spinner, Flex } from "@radix-ui/themes";

export default function Loading () {

	return (
		<Section>
			<Container>
                <Flex align='center' justify='center'>
				    <Spinner mr='2'/>
                </Flex>
			</Container>
		</Section>
	)
};