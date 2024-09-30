import { Flex, Spinner, Text } from "@radix-ui/themes";

export default function Loading () {

	return (
		<Text as="div" style={{
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			backgroundColor: 'rgba(255, 255, 255, 0.7)',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			zIndex: 9999
		  }}>
			<Flex>
				<Spinner mr='2' /> Chargement...
			</Flex>
		  </Text>
	)
};