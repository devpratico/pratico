'use client';
import { Flex, Text } from "@radix-ui/themes";
import DnD from "../(teacher)/(desk)/_components/menus/ActivitiesMenu/components/DnDFlex";


export default function PlayGround () {
	//if (process.env.NODE_ENV === 'production') return (null);

	return (
        <DnD.Flex direction="column" gap="3" p='3'>

            <DnD.Item id="item-1">

                <DnD.Normal>
                    <Flex>
                        <Text>Normal 1</Text>
                        <DnD.GrabHandle>
                            <Text>Grab</Text>
                        </DnD.GrabHandle>
                    </Flex>
                </DnD.Normal>

                <DnD.Active>
                    <Flex>
                        <Text>Active 1</Text>
                        <DnD.GrabHandle>
                            <Text>Grab</Text>
                        </DnD.GrabHandle>
                    </Flex>
                </DnD.Active>

                <DnD.Overlay>
                    <Flex>
                        <Text>Overlay 1</Text>
                        <DnD.GrabHandle>
                            <Text>Grabo</Text>
                        </DnD.GrabHandle>
                    </Flex>
                </DnD.Overlay>

            </DnD.Item>

            <DnD.Item id="item-2">

                <DnD.Normal>
                    <Flex>
                        <Text>Normal 2</Text>
                    </Flex>
                </DnD.Normal>

                <DnD.Active>
                    <Flex>
                        <Text>Active 2</Text>
                        <DnD.GrabHandle>
                            <Text>Grab</Text>
                        </DnD.GrabHandle>
                    </Flex>
                </DnD.Active>

                <DnD.Overlay>
                    <Flex>
                        <Text>Overlay 2</Text>
                        <DnD.GrabHandle>
                            <Text>Grabo</Text>
                        </DnD.GrabHandle>
                    </Flex>
                </DnD.Overlay>

            </DnD.Item>

            <DnD.Item id="item-3">

                <DnD.Normal>
                    <Flex>
                        <Text>Normal 3</Text>
                        <DnD.GrabHandle>
                            <Text>Grab</Text>
                        </DnD.GrabHandle>
                    </Flex>
                </DnD.Normal>

                <DnD.Overlay>
                    <Flex>
                        <Text>Overlay 3</Text>
                        <DnD.GrabHandle>
                            <Text>Grabo</Text>
                        </DnD.GrabHandle>
                    </Flex>
                </DnD.Overlay>

            </DnD.Item>

            <DnD.Item id="item-4">

                <DnD.Normal>
                    <Flex>
                        <Text>Normal 4</Text>
                        <DnD.GrabHandle>
                            <Text>Grab</Text>
                        </DnD.GrabHandle>
                    </Flex>
                </DnD.Normal>





            </DnD.Item>




        </DnD.Flex>
    )
};