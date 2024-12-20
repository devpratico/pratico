import { Container, Section, Spinner } from "@radix-ui/themes";

export default function Loading () {

	return (
		<Section>
			<Container>
				<Spinner mr='2'/>
			</Container>
		</Section>
	)
};