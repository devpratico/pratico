"use client";
import logger from "@/app/_utils/logger";
import createClient from "@/supabase/clients/client";
import { TextField } from "@radix-ui/themes";
import { FocusEvent, FocusEventHandler, useEffect, useState } from "react";

export type UserInfoType = {
	first_name?: string,
	last_name?: string,
	email?: string,
	organization? : {
		name?: string,
		address?: string,
		postal_code?: string, 
		city?: string
	}
}


export default function InfosSettings ({id, field, value}: {id: string | undefined, field: string, value: string}) {
	const [ newValue, setNewValue ] = useState(value);
	const organization = field.match("organization") ? field.split(" ") : null;
	const supabase = createClient();
		
	const handleUpdate= async (e: FocusEventHandler<HTMLInputElement> | undefined | FocusEvent<HTMLInputElement, Element>) => {
		console.log("orroofg", organization, newValue, organization ? organization[1] : null)
		if (id && newValue.length) {
			if (organization)
			{
					const { data: profileData, error: profileError } = await supabase.from('user_profiles').select('organization').eq('id', id).single();
		
					if (profileError) {
						logger.error('supabase:database', 'Error while fetching existing organization', profileError, 'discord');
						return ;
					}
		
					const existingOrganization = (profileData?.organization ?? {}) as Record<string, string>;
		
					const updatedOrganization = {
						...existingOrganization,
						[organization[1]]: newValue
					};
		
					const { data, error } = await supabase.from('user_profiles').update({ organization: updatedOrganization }).eq('id', id);
		
				if (error) {
					logger.error('supabase:database', 'Error while update', error, 'discord');
				} else {
					logger.log('supabase:database', 'Updated success:', data);
				}
			} else {
				if (field === "email")
				{
					const { data: user, error } = await supabase.auth.admin.updateUserById(id, { email: newValue });
					if (error) {
						logger.error('supabase:database', 'Error while update', error, 'discord');
					} else {
						logger.log('supabase:database', 'Updated success:', user);
					}
				}
				else
				{
					const { data, error } = await supabase.from('user_profiles').update({ [field]: newValue }).eq('id', id);

					if (error) {
						logger.error('supabase:database', 'Error while update', error, 'discord');
					} else {
						logger.log('supabase:database', 'Updated success:', data);
					}
				}
			}
		
		}
	};

	return (
		<>
			<TextField.Root onBlur={handleUpdate} onChange={(e) => setNewValue(e.target.value)} value={newValue}></TextField.Root>
		</>
	);
};