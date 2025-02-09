"use-client"

import { Fieldset, TextInput, PasswordInput, Button, Group } from '@mantine/core';
import { IconUser, IconChevronRight, IconId } from '@tabler/icons-react';

import { useState } from 'react';

import { useRouter } from 'next/navigation'

function doStuff(n:string | undefined,u:string | undefined ,a:string | undefined , router:any) {
  sessionStorage.setItem("API", a)
  localStorage.setItem('name', n)
  if(!n || !u || !a){
    alert("Empty Fields")
  }
  else {
  // API CALL
  console.log(n , u,a)
  router.push("/dashboard")
  }

}

export function Field() {
    const [name , setname] = useState<string>();
    const [USN , setUSN] = useState<string>();
    const [API , setAPI] = useState<string>();
    const router = useRouter()
  return (
    <Fieldset legend="Basic information">
      <TextInput withAsterisk label="Your name" placeholder="Your name" rightSection={<IconUser  size={14} />} onChange={(e)=>{setname(e.target.value)}} />
      <TextInput withAsterisk label="USN" placeholder="xxxxxxxxx" mt="md" rightSection={<IconId  size={14} />} onChange={(e)=>{setUSN(e.target.value)}} />
      <PasswordInput withAsterisk label="API key" placeholder="Gemeini Key" mt="md" onChange={(e)=>{setAPI(e.target.value)}} />
        
        <Group justify="flex-end">
          <a href="" className=' text-[12px] underline text-blue-400 mt-2'>How to get API Key?</a>
        </Group>
        
        <Button fullWidth mt='lg' justify="center"  rightSection={<IconChevronRight size={16} />} onClick={() => {doStuff(name,USN, API, router)}}>Next</Button>
    </Fieldset>
  );
}

