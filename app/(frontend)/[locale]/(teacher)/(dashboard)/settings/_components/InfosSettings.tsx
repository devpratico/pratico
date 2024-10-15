"use client";
import logger from "@/app/_utils/logger";
import createClient from "@/supabase/clients/client";
import { Badge, Button, Card, DataList, Flex, Heading, Separator, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { ResetPasswordBtn } from "../_buttons/ResetPasswordBtn";
import { SignOutBtn } from "../_buttons/SignOutBtn";
import { User } from "@supabase/supabase-js";
import { Check } from "lucide-react";

export type UserInfoType = {
	first_name?: string,
	last_name?: string,
	email?: string,
	organization? : {
		name?: string,
		address?: string,
		zip_code?: string, 
		city?: string
	}
}


export default function InfosSettings ({teacher, profileData}: {teacher: User | null, profileData: any}) {
	const tmpInfo: UserInfoType = {
		first_name: profileData?.first_name || "",
		last_name: profileData?.last_name || "",
		email: teacher?.email || "",
		organization: {
			name: profileData?.organization?.name || "",
			address: profileData?.organization?.address || "",
			zip_code: profileData?.organization?.zip_code || "",
			city: profileData?.organization?.city || "",
		}
	}
	const [ values, setValues ] = useState<UserInfoType>(tmpInfo);
	const [ updated, setUpdated ] = useState(false);
	const [ modifying, setModifying ] = useState(false);
	let timeout: null | NodeJS.Timeout = null;
	const supabase = createClient();


	const updateData = async () => {
		if (timeout)
			clearTimeout(timeout);
		if (teacher?.id && values)
		{
			if (values.email?.length && values.email !== teacher.email)
			{
				const { data: user, error: userError } = await supabase.auth.updateUser({email: values.email });
				if (userError)
					logger.error("supabase:database", "InfoSettings, error updating email", userError, "discord");
				else
					logger.log("supabase:database", "InfoSettings", "Email updated successfully", user);
			}
			const { data: userProfileData, error: userProfileError } = await supabase.from('user_profiles').select('*').eq('id', teacher?.id).single();
			if (userProfileError)
				logger.error("supabase:database", "InfoSettings, error getting existing user_profiles", userProfileError, "discord");
			else
			{
				const userProfileCopy = { ...userProfileData,
					first_name: values.first_name,
					last_name: values.last_name,
					organization: {
					name: values.organization?.name,
					address: values.organization?.address,
					zip_code: values.organization?.zip_code,
					city: values.organization?.city
					}
				}

				const { data, error } = await supabase.from('user_profiles').update(userProfileCopy).eq('id', teacher?.id);
				if (error)
					logger.error("supabase:database", "InfoSettings", error, "discord");
				else
					logger.log("supabase:database", "InfoSettings", "Datas updated successfully", data);
			}
		
			setUpdated(true);
			setModifying(false);
			timeout = setTimeout(() => {
				setUpdated(false);
			}, 2000);
		}
	}

	return (
		<>
            <Heading as='h1' mb='2'>{'Informations'}</Heading>

			<Card size='4'>
				<DataList.Root>
					<Heading size='5'>Personnelles</Heading>
					{/*
					<DataList.Item>
						<DataList.Label>{"nickname")}</DataList.Label>
						<DataList.Value>{nickname}</DataList.Value>
					</DataList.Item>*/}
					<DataList.Item>
						<DataList.Label>{"Prenom"}</DataList.Label>
						<TextField.Root onChange={(e) =>{
								setValues({...values, first_name: e.target.value})
								setModifying(true);
							}} value={values?.first_name} />
					</DataList.Item>
					<DataList.Item>
						<DataList.Label>{"Nom"}</DataList.Label>
						<TextField.Root onChange={(e) => {
							setValues({...values, last_name: e.target.value});
							setModifying(true);
						}}
						value={values?.last_name} />
					</DataList.Item>
					<DataList.Item>
						<DataList.Label>{"Email"}</DataList.Label>
						<TextField.Root onChange={(e) => {
							setValues({...values, email: e.target.value});
							setModifying(true);
						}} value={values?.email} />
					</DataList.Item>
					{/*<DataList.Item>
						<DataList.Label>{"id"}</DataList.Label>
						<DataList.Value><Code>{user?.id}</Code></DataList.Value>
					</DataList.Item>*/}
					
					<Heading size='5'>Organisation</Heading>

					<DataList.Item>
						<DataList.Label>{"Nom"}</DataList.Label>
						<TextField.Root onChange={(e) => {
							setValues({...values, organization: {...values.organization, name: e.target.value}});
							setModifying(true);
						}} value={values?.organization?.name} />
					</DataList.Item>
					<DataList.Item>
						<DataList.Label>{"Adresse"}</DataList.Label>
						<TextField.Root onChange={(e) => {
							setValues({...values, organization: {...values.organization, address: e.target.value}});
							setModifying(true);
						}} value={values?.organization?.address} />
					</DataList.Item>
					<DataList.Item>
						<DataList.Label>{"Code postal"}</DataList.Label>
						<TextField.Root onChange={(e) => {
							setValues({...values, organization: {...values.organization, zip_code: e.target.value}});
							setModifying(true);
						}} value={values?.organization?.zip_code} />
					</DataList.Item>
					<DataList.Item>
						<DataList.Label>{"Ville"}</DataList.Label>
						<TextField.Root onChange={(e) => {
							setValues({...values, organization: {...values.organization, city: e.target.value}});
							setModifying(true);
						}} value={values?.organization?.city} />
					</DataList.Item>
				</DataList.Root>

				<Separator size='4' my='4'/>

				<Flex gap='4' wrap='wrap'>
					<ResetPasswordBtn message={"change password"}/>
					<Button onClick={updateData} disabled={!modifying}>Enregistrer</Button>
					{
						updated
						? <Check color="green" />
						: <Text mr='5' />
					}
					<SignOutBtn message={"sign out"}/>
				</Flex>
			</Card>

		
		</>
	);
};