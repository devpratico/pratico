import createClient from "@/supabase/clients/server";
import { CapsuleWidgetView } from "./CapsuleWidgetView";
import { getFormatter } from "next-intl/server";

export async function CapsuleWidget ({ userId, capsuleTitle, capsuleId }: any) {
	const supabase = createClient();
	const formatter = await getFormatter();
	let capsuleDate = "";
	const { data: capsuleData } = await supabase.from('capsules').select('created_at').eq('id', capsuleId).single();
	if (capsuleData)
	{
		const date = new Date(capsuleData.created_at);
		capsuleDate = formatter.dateTime(date, { dateStyle: 'short'});
	}
	const data = {
		capsuleId: capsuleId,
		capsuleTitle: capsuleTitle,
		capsuleDate: capsuleDate
	};
	return (<>
		<CapsuleWidgetView data={data} />
	</>)
};