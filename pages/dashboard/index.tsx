import '@mantine/code-highlight/styles.css';

import { useEffect, useState } from 'react';
import {
  IconMoonFilled,
  IconDeviceFloppy,
  IconExternalLink,
  IconFileTypeCss,
  IconFileTypeHtml,
  IconFileTypeJs,
  IconSend,
  IconSunHighFilled,
} from '@tabler/icons-react';
import { CodeHighlight } from '@mantine/code-highlight';
import {
  ActionIcon,
  AppShell,
  Burger,
  Button,
  Group,
  Input,
  Notification,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const combineCode = (html: string, css: string, js: string) => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
      </html>
      `;
};

function FullLayout() {
  const [opacity, setOpacity] = useState<number>(0);
  const { setColorScheme } = useMantineColorScheme();
  const [theme, settheme] = useState<'light'| 'dark'>('light');
  const [html, setHtml] = useState<string>(`
<p>This is rendered using dangerouslySetInnerHTML</p>
<h1>Hello world </h1>
<button onclick="h()">click me</button>
      `);
  const [css, setCss] = useState<string>(`
p  {
  color: green;
}
h1 {
  font-size: 3rem;
  font-weight: 900; 
}
      `);
  const [js, setJs] = useState<string>(`
    function h() {
      alert("workin")
    }
    `);

  const handleSave = () => {
    const combinedCode = combineCode(html, css, js);
    localStorage.setItem('previewCode', combinedCode);
    setOpacity(1);
    setTimeout(() => {
      setOpacity(0);
    }, 1500);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        handleSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handlePreview = () => {
    const combinedCode = combineCode(html, css, js);
    localStorage.setItem('previewCode', combinedCode);
    window.open('/preview', '_blank');
  };

  const [opened, { toggle }] = useDisclosure();
  const [file, setFile] = useState<number>(0);

  const renderFile = (file: number) => {
    if (file == 0) {
      return <CodeHighlight bg={ (theme=='light')? "white" : '#242424'} code={html} language="html" />;
    }
    if (file == 1) {
      return <CodeHighlight bg={ (theme=='light')? "white" : '#242424'} code={css} language="css" />;
    }
    if (file == 2) {
      return <CodeHighlight bg={ (theme=='light')? "white" : '#242424'} code={js} language="js" />;
    }
  };

  return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 0 }}
      navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      aside={{ width: 300, breakpoint: 'md', collapsed: { desktop: false, mobile: true } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <h1>Welcome</h1>
          <div className="flex flex-row   justify-center items-center">
            <ActionIcon variant="transparent" aria-label="Theme" className='mr-4' onClick={() => {
              if (theme == 'light') {
                setColorScheme("dark")
                settheme('dark')
              }
              else {
                setColorScheme("light")
                settheme('light')
              }
            }}>
              {
                (theme=='light')? <IconMoonFilled style={{ width: '70%', height: '70%' }} stroke={1.5} /> :<IconSunHighFilled style={{ width: '70%', height: '70%' }} stroke={1.5} /> 
              }
              
            </ActionIcon>
            <Button
              onClick={handleSave}
              variant="outline"
              className="mr-4"
              rightSection={<IconDeviceFloppy size={18} />}
            >
              Save
            </Button>
            <Button onClick={handlePreview} rightSection={<IconExternalLink size={18} />}>
              Preview
            </Button>
          </div>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Button
          variant="subtle"
          color="gray"
          radius="md"
          justify="start"
          leftSection={<IconFileTypeHtml size={16} />}
          onClick={() => {
            setFile(0);
          }}
        >
          <p className="font-normal">index.html</p>
        </Button>

        <Button
          variant="subtle"
          color="gray"
          radius="md"
          justify="start"
          leftSection={<IconFileTypeCss size={16} />}
          onClick={() => {
            setFile(1);
          }}
        >
          <p className=" font-normal">style.css</p>
        </Button>

        <Button
          variant="subtle"
          color="gray"
          radius="md"
          justify="start"
          leftSection={<IconFileTypeJs size={16} />}
          onClick={() => {
            setFile(2);
          }}
        >
          <p className="font-normal">main.js</p>
        </Button>
      </AppShell.Navbar>

      <AppShell.Main>{renderFile(file)}</AppShell.Main>

      <AppShell.Aside p="md">
        <div className=" w-full h-full flex flex-col  justify-start  ">
          <div className=" w-[100%] h-[5%] flex flex-row justify-center ">
            <Input placeholder="Enter Your Propmt"></Input>
            <Button onClick={handlePreview} ml={12}>
              <IconSend size={16} />
            </Button>
          </div>
        </div>
        <Notification opacity={opacity} withCloseButton={false} title="File Saved 📁">
          Please check preview Window
        </Notification>
      </AppShell.Aside>
    </AppShell>
  );
}

export default FullLayout;
