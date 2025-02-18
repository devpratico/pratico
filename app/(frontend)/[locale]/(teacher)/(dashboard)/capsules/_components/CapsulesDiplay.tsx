"use client";

import { AspectRatio, Badge, Box, Card, Flex, Grid, Heading, Text, Tooltip } from "@radix-ui/themes";
import { Link } from "@/app/(frontend)/_intl/intlNavigation";
import Thumbnail from "@/app/(frontend)/[locale]/_components/Thumbnail";
import Menu from "./Menu";
import { TldrawImage, TLEditorSnapshot, TLPageId } from "tldraw";
import { useEffect, useMemo, useState } from "react";
import { OptionsMenu } from "../../_components/OptionsMenu";
import CreateCapsuleBtn from "./CreateCapsuleBtn";
import { Radio } from "lucide-react";
import { ExtendedCapsuleType } from "../page";

export function CapsulesDisplay ({capsules}: {capsules: ExtendedCapsuleType[] | any[]}) {
	const options = ["+ récent", "- récent"];
	const [ option, setOption ] = useState("+ récent");
	const [ sortedCapsules, setSortedCapsules ] = useState(capsules);
	useEffect(() => {
		const sorted = option === "- récent"
		? [...capsules].sort((a, b) => {
			return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
		})
		: [...capsules].sort((a, b) => {
		return (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
	});
	setSortedCapsules(sorted);

	}, [option, capsules]);

	return (
		<>
			<Flex justify={"between"} mb='4'>
				<CreateCapsuleBtn message='Créer' />
				<OptionsMenu setOption={setOption} label="Trier par" options={options} />
			</Flex>
			<Grid columns='repeat(auto-fill, minmax(200px, 1fr))' gap='5'>
				{
					sortedCapsules.map((cap) => {
						const id = cap.id
						const title = cap.title || "Sans titre"
						const created_at = new Date(cap.created_at)
						const snap = cap.tld_snapshot?.[0] as TLEditorSnapshot | undefined// as TLStoreSnapshot | undefined
						const roomOpen = cap.roomOpen;
						const roomCode = cap.roomCode;
						let url = roomOpen && roomCode ? `/room/${roomCode}` : `/capsule/${id}`
						const firstPageId = snap?.document.store && Object.keys(snap?.document.store)[0] as TLPageId;
						if (!firstPageId)
							return (null);
						return (
							<Box position='relative' key={id}>
								<Link href={url} style={{ all: 'unset', cursor: 'pointer'}}>
									<Miniature title={title} createdAt={created_at} roomOpen={roomOpen}>
										{
											snap
											?	<TldrawImage
													snapshot={snap}
													format='png'
													scale={0.05}
													background={true}
													pageId={firstPageId}
													padding={0}
												/>
											: null
										}
									</Miniature>
								</Link>
								<Menu capsuleId={id} key={id} />
							</Box>
						)
					}
				)}
			</Grid>
	</>);
};

interface MiniatureProps {
    title?: string;
    createdAt?: Date;
	roomOpen?: boolean;
    children?: React.ReactNode;
}


function Miniature({ title, createdAt, roomOpen, children }: MiniatureProps) {
    return (
        <Flex direction='column' gap='1'>
            <Card style={{padding:'0'}}>
                <AspectRatio ratio={16 / 9}>
                    {children}
                </AspectRatio>
            </Card>
			<Flex direction="column" gap='1'>
				<Heading as='h2' size='3'>{title}</Heading>
				<Flex justify="between" align="baseline">
					<Text color="gray" size='1'>{createdAt?.toLocaleDateString()}</Text>
					{
						roomOpen
						? <Tooltip content="Session en cours, vous pouvez la relancer">
							<Badge color="red" variant="soft" radius="full">
								<Radio style={{ flexShrink: 0 }} size="15" />en cours
							</Badge>
						</Tooltip>
						: null
					}
				</Flex>
			</Flex>			
        </Flex>
    )
}