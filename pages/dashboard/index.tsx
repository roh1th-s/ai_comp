import '@mantine/code-highlight/styles.css';

import { useContext, useEffect, useState } from 'react';
import {
  IconMoonFilled,
  IconDeviceFloppy,
  IconExternalLink,
  IconFileTypeCss,
  IconFileTypeHtml,
  IconFileTypeJs,
  IconSend,
  IconSunHighFilled,
  IconLoader,
  IconSunMoon,
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
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { ApiKeyContext } from '@/components/ApiKeyContextProvider';

const enum FileType {
  HTML = 0,
  CSS = 1,
  JS = 2,
}

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
  const { colorScheme, setColorScheme } = useMantineColorScheme();
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

  const [model, setModel] = useState<GenerativeModel | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  const {apiKey} = useContext(ApiKeyContext);

  useEffect(() => {
    if (!apiKey) return;
    // initialize google generative ai
    const genAI = new GoogleGenerativeAI(apiKey);
    const genAiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    console.log("Initialized gemini model");
    
    setModel(genAiModel);
  }, [apiKey]);


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

  const handleGenAIPrompt = async () => {
    const userPrompt = prompt.trim();
    if (!model || !userPrompt) return;

   const modelPrompt = `Current state of all files:

HTML:
${html}

CSS:
${css}

JavaScript:
${js}

Instructions: Given the code above, make changes according to this prompt: '${userPrompt}'

Requirements:
1. Return your response as a valid JSON object with the following structure:
{
  "html": "new html code or null if no changes",
  "css": "new css code or null if no changes",
  "js": "new javascript code or null if no changes"
}

2. For HTML: Only include content that goes inside the body tag. Do not include <!DOCTYPE>, <html>, <head>, or <body> tags.
3. For CSS: The code will be injected into the <style> tag as a whole. Include the entire css including the previous content if you're changing anything. 
4. For JavaScript: The code will be injected into the <script> tag. Include the entire script including the previous code even if you're adding anything new / modifying anything.
5. If no changes are needed for a particular file, set its value to null in the JSON.
6. Do not include any explanation text, only return the JSON object.
7. Do not include backticks in your response.`; 

    try {
      setAiLoading(true);
      const result = await model.generateContent(modelPrompt);
      setAiLoading(false);
      let response = result.response.text();
      
      console.log(response);
      if (response.startsWith('```')) {
        // remove first and last lines
        response = response.split('\n').slice(1, -1).join('\n');
      }
      
      // Parse the JSON response
      const changes = JSON.parse(response);
      
      // Update each file type if changes exist
      if (changes.html !== null) setHtml(changes.html);
      if (changes.css !== null) setCss(changes.css);
      if (changes.js !== null) setJs(changes.js);
    } catch (error) {
      console.error('Error generating content:', error);
    }
  };

  const [opened, { toggle }] = useDisclosure();
  const [file, setFile] = useState<FileType>(0);

  const renderFile = (file: FileType) => {
    if (file == 0) {
      return <CodeHighlight code={html} language="html" />;
    }
    if (file == 1) {
      return <CodeHighlight code={css} language="css" />;
    }
    if (file == 2) {
      return <CodeHighlight code={js} language="js" />;
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
              if (colorScheme == 'light' || colorScheme == 'auto') {
                setColorScheme("dark")
              }
              else {
                setColorScheme("light")
              }
            }}>
              {
                (colorScheme=='light')? <IconMoonFilled style={{ width: '70%', height: '70%' }} stroke={1.5} /> :
                  colorScheme == 'dark' ? <IconSunHighFilled style={{ width: '70%', height: '70%' }} stroke={1.5} />
                  : <IconSunMoon style={{ width: '70%', height: '70%' }} stroke={1.5} /> 
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
            <Input placeholder="Enter Your Prompt" value={prompt} onChange={(event) => setPrompt(event.currentTarget.value)}></Input>
            <Button onClick={handleGenAIPrompt} ml={12}>
              {aiLoading ? <IconLoader className='animate-spin'/> : <IconSend size={16} />}
              
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
