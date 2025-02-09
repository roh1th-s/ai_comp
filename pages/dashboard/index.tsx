"use"
import '@mantine/code-highlight/styles.css';
import { AppShell, Burger, Group,Button, Input, ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { IconFileTypeHtml, IconFileTypeCss, IconFileTypeJs, IconExternalLink, IconSend } from '@tabler/icons-react';
import { CodeHighlight } from '@mantine/code-highlight';


const htmlC = `
<style></style>
<p style='color:blue;'>This is rendered using dangerouslySetInnerHTML</p>
`
const cssC = `p : font-size:2rem;`
const jsC = `
// VisuallyHidden component source code

import {
  Box,
  BoxProps,
  StylesApiProps,
  factory,
  ElementProps,
  useProps,
  useStyles,
  Factory,
} from '../../core';
import classes from './VisuallyHidden.module.css';
import {
  Box,
  BoxProps,
  StylesApiProps,
  factory,
  ElementProps,
  useProps,
  useStyles,
  Factory,
} from '../../core';
import classes from './VisuallyHidden.module.css';
import {
  Box,
  BoxProps,
  StylesApiProps,
  factory,
  ElementProps,


`




function renderFile(file:number){
    if (file==0) {
        return <CodeHighlight bg={'white'} code={htmlC} language='html' />
    }
    if (file==1) {
        return <CodeHighlight bg={'white'} code={cssC} language='css' />
    }
    if (file==2) {
        return <CodeHighlight bg={'white'} code={jsC} language='js' />
    }
}


 function FullLayout() {
    const [opened, { toggle }] = useDisclosure();
    const [file , setFile] = useState<number>(0);
    

  return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 0 }}
      navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      aside={{ width: 300, breakpoint: 'md', collapsed: { desktop: false, mobile: true } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify='space-between'>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <h1>Welcome</h1>
          <Button rightSection={<IconExternalLink size={18} />}>Preview</Button>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
         <Button variant="subtle"  color="rgba(0, 0, 0, 1)" radius="md" justify='start'  leftSection={<IconFileTypeHtml size={16} />} 
         onClick={() => {setFile(0)}}
         ><p className=' font-normal'>index.html</p></Button>

         <Button variant="subtle"  color="rgba(0, 0, 0, 1)" radius="md" justify='start' leftSection={<IconFileTypeCss size={16} /> } 
         onClick={() => {setFile(1)}}><p className=' font-normal'>style.css</p></Button>

         <Button variant="subtle"  color="rgba(0, 0, 0, 1)" radius="md" justify='start' leftSection={<IconFileTypeJs size={16} />} 
         onClick={() => {setFile(2)}}><p className=' font-normal'>main.js</p></Button>
      </AppShell.Navbar>
      
      <AppShell.Main>

        {renderFile(file)}
        

      </AppShell.Main>
      
      
      <AppShell.Aside p="md">
      
      <div className=' w-full h-full flex flex-col  justify-start  '>
        <div className=' w-[100%] h-[5%] flex flex-row justify-center '>

        <Input  placeholder='Enter Your Propmt'></Input>
      <Button ml={12}><IconSend size={16} /></Button>
        </div>


        
      </div>

      </AppShell.Aside>
    
    </AppShell>
  );
}

export default FullLayout;