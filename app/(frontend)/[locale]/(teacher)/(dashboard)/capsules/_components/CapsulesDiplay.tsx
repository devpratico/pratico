"use client";
import { AspectRatio, Box, Card, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { CapsuleType } from "../../reports/page";
import { Link } from "@/app/(frontend)/_intl/intlNavigation";
import Thumbnail from "@/app/(frontend)/[locale]/_components/Thumbnail";
import Menu from "./Menu";
import { TLEditorSnapshot } from "tldraw";
import { useEffect, useState } from "react";
import { OptionsMenu } from "../../_components/OptionsMenu";
import CreateCapsuleBtn from "./CreateCapsuleBtn";

export function CapsulesDisplay ({capsules}: {capsules: CapsuleType[] | any[]}) {
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
			<Grid columns='repeat(auto-fill, minmax(200px, 1fr))' gap='3'>
				{
					sortedCapsules.map((cap) => {
						const id = cap.id
						const title = cap.title || "Sans titre"
						const created_at = new Date(cap.created_at)
						const snap = cap.tld_snapshot?.[0] as TLEditorSnapshot | undefined// as TLStoreSnapshot | undefined

						let url = `/capsule/${id}`

						return (
							<Box position='relative' key={id}>
								<Link href={url} style={{ all: 'unset', cursor: 'pointer'}}>
									<Miniature title={title} createdAt={created_at}>
										{snap && <Thumbnail snapshot={snap} scale={0.2} />}
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
    children?: React.ReactNode;
}


function Miniature({ title, createdAt, children }: MiniatureProps) {
    return (
        <Flex direction='column' gap='1'>
            <Card style={{padding:'0'}}>
                <AspectRatio ratio={16 / 9}>
                    {children}
                </AspectRatio>
            </Card>
            <Heading as='h2' size='3'>{title}</Heading>
            <Text size='1'>{createdAt?.toLocaleDateString()}</Text>
        </Flex>
    )
}