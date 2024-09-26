"use client";

import { Grid, Heading, Separator, Text } from "@radix-ui/themes";
import { CapsuleType } from "../page";
import CapsuleReports from "./CapsuleReports";
import { OptionsMenu } from "./OptionsMenu";
import { useEffect, useState } from "react";
import { Chronological } from "./Chronological";
import logger from "@/app/_utils/logger";

export function ReportsDisplay ({capsules}: {capsules: CapsuleType[]}) {
	const [ option, setOption ] = useState("capsules");
	const [ display, setDisplay ] = useState(<></>);
	useEffect(() => {
		logger.log("react:component", "ReportsDisplay", "options", option);
		switch (option) {
			case "Ordre chronologique":
				setDisplay(<Chronological capsules={capsules} order={true} />);
				break ;
			case "Ordre antéchronologique":
				setDisplay(<Chronological capsules={capsules} order={true} />);
				break ;
			default:
				setDisplay(<>
					<Heading mb='4' as='h1'>Rapports par capsules</Heading>
					<Grid 
						columns='5'
						gap="3"
					>
					{
						capsules.map((cap, index) => {
							return (<CapsuleReports key={index} capsule={cap} />);
						})
					}
					</Grid>
				</>)
		};
	}, [option]);
	return (
		<>
			<OptionsMenu setOption={setOption} label="Trier par" options={["Capsules", "Ordre chronologique", "Ordre antéchronologique"]} />
			<Text as="div" mb='4'></Text>
			{display}					
		</>
	);
};