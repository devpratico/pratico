"use client";

import { Flex, Heading, Text } from "@radix-ui/themes";
import { OptionsMenu } from "../../_components/OptionsMenu";
import { useEffect, useState } from "react";
import { Chronological } from "./Chronological";
import { SessionInfoType } from "../[room_id]/page";

export function ReportsDisplay ({sessions}: {sessions: SessionInfoType[]}) {
	const options = ["+ récent", "- récent"];
	const [ option, setOption ] = useState("+ récent");
	const [ display, setDisplay ] = useState(<></>);
	useEffect(() => {
		switch (option) {
			case "- récent":
				setDisplay(<Chronological sessions={sessions} order={true} />);
				break ;
			default:
				setDisplay(<Chronological sessions={sessions} order={false} />);

		};
	}, [option, sessions]);
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