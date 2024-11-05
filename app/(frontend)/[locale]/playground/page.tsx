'use client';
import { Flex, Text } from "@radix-ui/themes";

import {
    DnDFlex,
    DnDItem,
    DnDItemNormal,
    DnDItemActive,
    DnDItemOverlay,
    DnDGrabHandle,
} from "../(teacher)/(desk)/_components/activities/DndSortable2";
//import dynamic from "next/dynamic";
//const DnDFlex = dynamic(() => import('../(teacher)/(desk)/_components/activities/DndSortable2').then(mod => mod.DnDFlex), { ssr: false });
//const DnDItem = dynamic(() => import('../(teacher)/(desk)/_components/activities/DndSortable2').then(mod => mod.DnDItem), { ssr: false });
//const DnDItemNormal = dynamic(() => import('../(teacher)/(desk)/_components/activities/DndSortable2').then(mod => mod.DnDItemNormal), { ssr: false });
//const DnDItemActive = dynamic(() => import('../(teacher)/(desk)/_components/activities/DndSortable2').then(mod => mod.DnDItemActive), { ssr: false });
//const DnDItemOverlay = dynamic(() => import('../(teacher)/(desk)/_components/activities/DndSortable2').then(mod => mod.DnDItemOverlay), { ssr: false });
//const DnDGrabHandle = dynamic(() => import('../(teacher)/(desk)/_components/activities/DndSortable2').then(mod => mod.DnDGrabHandle), { ssr: false });


export default function PlayGround () {
	//if (process.env.NODE_ENV === 'production') return (null);

	return (
        <DnDFlex direction="column" gap="3" p='3'>

            <DnDItem id="item-1">

                <DnDItemNormal>
                    <Flex>
                        <Text>Normal 1</Text>
                        <DnDGrabHandle>
                            <Text>Grab</Text>
                        </DnDGrabHandle>
                    </Flex>
                </DnDItemNormal>

                <DnDItemActive>
                    <Flex>
                        <Text>Active 1</Text>
                        <DnDGrabHandle>
                            <Text>Grab</Text>
                        </DnDGrabHandle>
                    </Flex>
                </DnDItemActive>

                <DnDItemOverlay>
                    <Flex>
                        <Text>Overlay 1</Text>
                        <DnDGrabHandle>
                            <Text>Grabo</Text>
                        </DnDGrabHandle>
                    </Flex>
                </DnDItemOverlay>

            </DnDItem>

            <DnDItem id="item-2">

                <DnDItemNormal>
                    <Flex>
                        <Text>Normal 2</Text>
                        <DnDGrabHandle>
                            <Text>Grab</Text>
                        </DnDGrabHandle>
                    </Flex>
                </DnDItemNormal>

                <DnDItemActive>
                    <Flex>
                        <Text>Active 2</Text>
                        <DnDGrabHandle>
                            <Text>Grab</Text>
                        </DnDGrabHandle>
                    </Flex>
                </DnDItemActive>

                <DnDItemOverlay>
                    <Flex>
                        <Text>Overlay 2</Text>
                        <DnDGrabHandle>
                            <Text>Grabo</Text>
                        </DnDGrabHandle>
                    </Flex>
                </DnDItemOverlay>

            </DnDItem>

            <DnDItem id="item-3">

                <DnDItemNormal>
                    <Flex>
                        <Text>Normal 3</Text>
                        <DnDGrabHandle>
                            <Text>Grab</Text>
                        </DnDGrabHandle>
                    </Flex>
                </DnDItemNormal>

                <DnDItemActive>
                    <Flex>
                        <Text>Active 3</Text>
                        <DnDGrabHandle>
                            <Text>Grab</Text>
                        </DnDGrabHandle>
                    </Flex>
                </DnDItemActive>

                <DnDItemOverlay>
                    <Flex>
                        <Text>Overlay 3</Text>
                        <DnDGrabHandle>
                            <Text>Grabo</Text>
                        </DnDGrabHandle>
                    </Flex>
                </DnDItemOverlay>

            </DnDItem>

            <DnDItem id="item-4">

                <DnDItemNormal>
                    <Flex>
                        <Text>Normal 4</Text>
                        <DnDGrabHandle>
                            <Text>Grab</Text>
                        </DnDGrabHandle>
                    </Flex>
                </DnDItemNormal>

                <DnDItemActive>
                    <Flex>
                        <Text>Active 4</Text>
                        <DnDGrabHandle>
                            <Text>Grab</Text>
                        </DnDGrabHandle>
                    </Flex>
                </DnDItemActive>

                <DnDItemOverlay>
                    <Flex>
                        <Text>Overlay 4</Text>
                        <DnDGrabHandle>
                            <Text>Grabo</Text>
                        </DnDGrabHandle>
                    </Flex>
                </DnDItemOverlay>

            </DnDItem>




        </DnDFlex>
    )
};