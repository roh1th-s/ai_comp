import React, { useEffect, useRef } from "react";

export default function HomePage() {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const checkForUpdates = () => {
            const storedPreviewCode = localStorage.getItem('previewCode');
            if (storedPreviewCode && iframeRef.current) {
                const iframeDocument = iframeRef.current.contentDocument;
                if (iframeDocument) {
                    iframeDocument.open();
                    iframeDocument.write(storedPreviewCode);
                    iframeDocument.close();
                }
            }
        };

        // Check for updates every second
        const intervalId = setInterval(checkForUpdates, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <main className=' bg-white'>
            <iframe ref={iframeRef} style={{ width: "100vw", height: "100vh", border: "1px solid black" }} />
        </main>
    );
}
