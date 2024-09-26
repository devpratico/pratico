import { Button, DropdownMenu } from "@radix-ui/themes";

export function OptionsMenu ({setOption, label, options}: {setOption: React.Dispatch<string>, label: string, options: string[]}) {

	return (
		<>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button>
						{label}
					<DropdownMenu.TriggerIcon />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
				{
					options.map((item, index) => {
						return (<DropdownMenu.Item onClick={()=> setOption(item)} key={index}>{item}</DropdownMenu.Item>);
					})
				}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</>
	);
};