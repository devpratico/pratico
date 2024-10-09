import { Tooltip, Text, TooltipProps } from "@radix-ui/themes";


export default function TooltipL(props: TooltipProps) {
    return (
        <Tooltip {...props} content={<Text size='2'>{props.content}</Text>} style={{padding:'0.5rem'}}>
            {props.children}
        </Tooltip>
    )
}