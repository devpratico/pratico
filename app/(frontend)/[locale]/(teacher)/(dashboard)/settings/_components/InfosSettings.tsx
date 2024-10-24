"use client";
import logger from "@/app/_utils/logger";
import createClient from "@/supabase/clients/client";
import { Button, Callout, Card, DataList, Flex, Heading, Separator, Text, TextField } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { ResetPasswordBtn } from "../_buttons/ResetPasswordBtn";
import { SignOutBtn } from "../_buttons/SignOutBtn";
import { User } from "@supabase/supabase-js";
import { Check, TriangleAlert } from "lucide-react";

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
	const [ loading, setLoading ] = useState(false);
	let timeout: null | NodeJS.Timeout = null;
	const [ anonyme, setAnonyme ] = useState(false);
	const supabase = createClient();

	useEffect(() => {
		if (anonyme)
		{
			const anonymeTimeout = setTimeout(() => {
				setAnonyme(false);
			}, 30000);
			return (() => clearTimeout(anonymeTimeout));
		}
	}, [anonyme]);

	const updateData = async () => {
		if (timeout)
			clearTimeout(timeout);
		setLoading(true);
		if (teacher?.id && values)
		{
			const { data: userProfileData, error: userProfileError } = await supabase.from('user_profiles').select('*').eq('id', teacher?.id).single();
			if (userProfileError)
			{	
				console.log(userProfileError.details === 'The result contains 0 rows');
				if (userProfileError.details === 'The result contains 0 rows')
				{
					logger.error("supabase:database", "InfoSettings, an anonyme updates his infos", userProfileError, "discord");
					setAnonyme(true);
				}
				else
					logger.error("supabase:database", "InfoSettings, error getting user_profile", userProfileError, "discord");

			}
			else
			{
				setAnonyme(false);
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
				else if (data)
					logger.log("supabase:database", "InfoSettings", "Datas updated successfully", data);
			}
			if (values.email?.length && values.email !== teacher.email && !userProfileError)
			{
				const { data: user, error: userError } = await supabase.auth.updateUser({email: values.email });
				if (userError)
					logger.error("supabase:database", "InfoSettings, error updating email", userError, "discord");
				else
					logger.log("supabase:database", "InfoSettings", "Email updated successfully", user);
			}
			
			setLoading(false);
			setUpdated(true);
			setModifying(false);
			timeout = setTimeout(() => {
				setUpdated(false);
			}, 1000);
		}
	}

	const handleCancelUpdate = async () => {

		if (teacher?.id)
		{
			const { data: { user }, error: userError } = await supabase.auth.getUser();
			if (userError)
				logger.error('supabase:database', 'InfoSetting', 'error getting datas', userError, 'discord');
			const { data, error } = await supabase.from('user_profiles').select('*').eq('id', teacher?.id).single();
			if (error)
				logger.error('supabase:database', 'InfoSetting', 'error getting datas', error, 'discord');
			if (data)
			{
				setValues({
					first_name: data.first_name || "",
					last_name: data.last_name || "",
					email: user?.email || "",
					organization: data.organization as Record<string, string> || { 
						name: "",
						address: "",
						zip_code: "",
						city: ""
					}
				})
			}
			else
				setValues(tmpInfo);
		}
		if (timeout)
			clearTimeout(timeout);
		timeout = setTimeout(() => {
			setModifying(false);
			setUpdated(false);
			setLoading(false);
		}, 200);

	};

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

					<DataList.Item style={{ display: 'flex', alignItems: 'center', gap: '50px' }}>
						<DataList.Label>{"Prénom"}</DataList.Label>
						<DataList.Value>
							<TextField.Root onChange={(e) =>{
									setValues({...values, first_name: e.target.value})
									setModifying(true);
								}} value={values?.first_name} />
						</DataList.Value>
					</DataList.Item>

					<DataList.Item style={{ display: 'flex', alignItems: 'center', gap: '50px' }}>
						<DataList.Label>{"Nom"}</DataList.Label>
						<DataList.Value>
							<TextField.Root onChange={(e) => {
								setValues({...values, last_name: e.target.value});
								setModifying(true);
							}}
							value={values?.last_name} />
						</DataList.Value>
					</DataList.Item>

					<DataList.Item style={{ display: 'flex', alignItems: 'center', gap: '50px' }}>
						<DataList.Label>{"Email"}</DataList.Label>
						<DataList.Value>
							<TextField.Root onChange={(e) => {
								setValues({...values, email: e.target.value});
								setModifying(true);
							}} value={values?.email} />						
						</DataList.Value>
					</DataList.Item>

					{/*<DataList.Item>
						<DataList.Label>{"id"}</DataList.Label>
						<DataList.Value><Code>{user?.id}</Code></DataList.Value>
					</DataList.Item>*/}
					<Heading size='5'>Organisation</Heading>

					<DataList.Item style={{ display: 'flex', alignItems: 'center', gap: '50px' }}>
						<DataList.Label>{"Nom"}</DataList.Label>
						<DataList.Value>
							<TextField.Root onChange={(e) => {
								setValues({...values, organization: {...values.organization, name: e.target.value}});
								setModifying(true);
							}} value={values?.organization?.name} />						
						</DataList.Value>
					</DataList.Item>

					<DataList.Item style={{ display: 'flex', alignItems: 'center', gap: '50px' }}>
						<DataList.Label>{"Adresse"}</DataList.Label>
						<DataList.Value>
							<TextField.Root onChange={(e) => {
								setValues({...values, organization: {...values.organization, address: e.target.value}});
								setModifying(true);
							}} value={values?.organization?.address} />						
						</DataList.Value>
					</DataList.Item>

					<DataList.Item style={{ display: 'flex', alignItems: 'center', gap: '50px' }}>
						<DataList.Label>{"Code postal"}</DataList.Label>
						<DataList.Value>
							<TextField.Root onChange={(e) => {
								setValues({...values, organization: {...values.organization, zip_code: e.target.value}});
								setModifying(true);
							}} value={values?.organization?.zip_code} />						
						</DataList.Value>
					</DataList.Item>

					<DataList.Item style={{ display: 'flex', alignItems: 'center', gap: '50px' }}>
						<DataList.Label>{"Ville"}</DataList.Label>
						<DataList.Value>
							<TextField.Root onChange={(e) => {
								setValues({...values, organization: {...values.organization, city: e.target.value}});
								setModifying(true);
							}} value={values?.organization?.city} />							
						</DataList.Value>
					</DataList.Item>

				</DataList.Root>

				<Flex mt='3' gap='4' wrap='wrap' style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
					{
						anonyme && (
						<div style={{ marginRight: '10px' }}>
							<Callout.Root color='red' role='alert' size='1'>
								<Callout.Text>
									{"Vous n'êtes pas connecté, les informations ne seront pas sauvegardées"}	
								</Callout.Text>
							</Callout.Root>
						</div>
					)}
					<Button style={{ width: '100px' }} onClick={updateData} loading={loading} disabled={!modifying && !updated}>
						{!modifying && updated ? <Check /> : 'Enregistrer'}
					</Button>
					<Button variant='soft' color='gray' onClick={handleCancelUpdate} disabled={!modifying}>Annuler</Button>
				</Flex>


				<Separator size='4' my='4'/>
			
				<Heading mb='3' size='5'>Compte Pratico</Heading>
				<Flex mt='5' gap='4' wrap='wrap'>					
					<ResetPasswordBtn message={"Changer le mot de passe"}/>
					<SignOutBtn message={"Se déconnecter"}/>
				</Flex>
		
			</Card>

		
		</>
	);
};