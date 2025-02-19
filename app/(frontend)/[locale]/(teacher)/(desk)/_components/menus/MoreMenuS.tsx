import createClient from "@/supabase/clients/server";
import MoreMenu from "./MoreMenu";

interface Params {
  capsule_id: string;
}

export async function MoreMenuS () {
	const supabase = createClient();
	const capsuleId = "1";
	console.log("CAPSULE ID", capsuleId);
	if (!capsuleId)
		return (null);
	const { data, error } = await supabase.from('capsules').select("metadata").eq('id', capsuleId);
	console.log("DATA", data, "ERROR", error);
	// return (<MoreMenu pdfUrl={pdfUrl} />);
	return (<>Hello</>)
};