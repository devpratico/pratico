import ActivityNavOptions from "../(teacher)/(desk)/room/[room_code]/_components/activity-nav-options"
import { Flex } from "@radix-ui/themes"

export default function PlayGround () {
	return (
        <Flex align="center" justify="center" height="100vh" width="100vw">
            <ActivityNavOptions defaultValue="animateur" roomId={1}/>
        </Flex>
    )
};

