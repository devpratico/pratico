"use client";
import { Flex, Box, Text, Button } from "@radix-ui/themes"
import { Puzzle, MessageSquareText, Users, Ellipsis, FlaskRound, Maximize2, Minimize2 } from 'lucide-react';
import Image from "next/image";
import TopBarPortal from "../../../_components/TopBarPortal";
import StartDialog from "./StartDialog";
import StopBtn from "./StopBtn";
import MenuTabs from "../../../_components/MenuTabs";
import { useState } from "react";

export default function TeacherScreenView ({room_code}: {room_code: string}) {
    const logoScale = 0.25;
	const [ fullscreen, setFullscreen ] = useState(false);
	const [ onActivity, setOnActivity ] = useState(false);

	return (<>
		<Button onClick={() => {
			setFullscreen(!fullscreen);
			setOnActivity(true);
		}}>{fullscreen ? <Minimize2 /> : <Maximize2 />}</Button>
		{
			fullscreen
			? <></>
			: <>
				<TopBarPortal>

					<Flex justify={{initial:'center', xs:'between'}} align='center'>
							
						<Flex align='center' gap='4' display={{ initial: 'none', xs: 'flex' }}>
							
							<Flex align='center'>
								<Image src='/images/logolien.png' width={500 * logoScale} height={105 * logoScale} alt="Pratico" />
								<Text size='6' style={{ color: 'var(--background)', opacity: '0.5' }}>{`/${room_code}`}</Text>
							</Flex>
							{
								onActivity
								? <></>
								: <StartDialog/>
							}
							<StopBtn message='Arrêter la session' />
					
						</Flex>

						{/* MenuTabs for Desktop */}
						<Box display={{ initial: 'none', xs: 'block' }}>
							<MenuTabs tabs={[
								{ menu: 'activities', label: 'Activités', icon: <Puzzle /> },
								{ menu: 'participants', label: 'Participants', icon: <Users /> },
								{ menu: 'chat', label: 'Chat', icon: <MessageSquareText /> },
								{ menu: 'more', label: 'Plus', icon: <Ellipsis /> }
							]} />
						</Box>

						{/* MenuTabs for Mobile - it has a Home tab and a smaller padding */}
						<Box display={{ initial: 'block', xs: 'none' }}>
							<MenuTabs padding='3px' tabs={[
								{ menu: undefined, label: 'Capsule', icon: <FlaskRound /> },
								{ menu: 'activities', label: 'Activités', icon: <Puzzle /> },
								{ menu: 'participants', label: 'Participants', icon: <Users /> },
								{ menu: 'chat', label: 'Chat', icon: <MessageSquareText /> },
								{ menu: 'more', label: 'Plus', icon: <Ellipsis /> }
							]} />
						</Box>


						{/* Activity Card, that automatically opens when an activity is running */}
						
							

					</Flex>

				</TopBarPortal>

			</>
		}
		
	</>);
};