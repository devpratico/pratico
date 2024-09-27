"use client";

import { Flex, Heading, Text } from "@radix-ui/themes";
import { CapsuleType } from "../page";
import { OptionsMenu } from "./OptionsMenu";
import { useEffect, useState } from "react";
import { Chronological } from "./Chronological";
import logger from "@/app/_utils/logger";
import { SessionInfoType } from "../[capsule_id]/page";

export function ReportsDisplay ({capsules, sessions}: {capsules?: CapsuleType[], sessions: SessionInfoType[]}) {
	const options = ["+ récent", "- récent"];
	const [ option, setOption ] = useState("+ récent");
	const [ display, setDisplay ] = useState(<></>);
	useEffect(() => {
		logger.log("react:component", "ReportsDisplay", "options", option);
		switch (option) {
			// case "capsules":
			// 	setDisplay(<>
			// 		<Grid 
			// 			columns='4'
			// 			gap="3"
			// 		>
			// 		{
			// 			capsules.map((cap, index) => {
			// 				if (cap.tld_snapshot)
			// 					return (<CapsuleReports key={index} capsule={cap} />);
			// 			})
			// 		}
			// 		</Grid>
			// 	</>)
			// 	break ;
			case "- récent":
				setDisplay(<Chronological sessions={sessions} order={true} />);
				break ;
			default:
				setDisplay(<Chronological sessions={sessions} order={false} />);

		};
		 // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [option]);
	return (
		<>
			<Flex justify={"between"}>
				<Heading mb='4' as='h1'>Rapports</Heading>
				<Text as="div" mb='4' ml="auto">
					<OptionsMenu setOption={setOption} label="Trier par" options={options} />
				</Text>
			</Flex>
			{display}					
		</>
	);
};