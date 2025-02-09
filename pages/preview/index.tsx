import React, { useEffect } from "react";

export default function HomePage() {
    const [previewCode, setPreviewCode] = React.useState<string | null>(null);

    useEffect(() => {
        const checkForUpdates = () => {
            const storedPreviewCode = localStorage.getItem('previewCode');
            if (storedPreviewCode !== previewCode) {
                setPreviewCode(storedPreviewCode);
            }
        };

        // Check for updates every second
        const intervalId = setInterval(checkForUpdates, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [previewCode]);

    return (
        <main className=''>
            {previewCode ? <div dangerouslySetInnerHTML={{ __html: previewCode }} /> : <p>No preview available</p>}
        </main>
    );
}
