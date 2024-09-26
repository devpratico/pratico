import { Heading } from "@radix-ui/themes";
import { CapsuleType } from "../page";

export function Chronological ({capsules, order}: {capsules: CapsuleType[], order: boolean}) {

	return (
		<>
			<Heading mb='4' as='h1'>Rapports par {order ? "ordre chronologique" : "ordre antéchronologique"}</Heading>

		</>
	);
};