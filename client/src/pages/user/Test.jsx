import React, { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

function PdfUploaderAndViewer() {
    const [file, setFile] = useState(null);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const onFileChange = (event) => {
        const file = event.target.files[0];
        if (file.type === "application/pdf") {
            setFile(URL.createObjectURL(file));
        } else {
            alert("Please upload a PDF file.");
            setFile(null);
        }
    };

    // Set the workerSrc to match the pdfjs-dist version
    const workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

    return (
        <div className="container mx-auto p-4">
            <input type="file" onChange={onFileChange} className="mb-4" accept="application/pdf" />
            {file && (
                <div className="pdf-container" style={{ height: '750px' }}>
                    <Worker workerUrl={workerSrc}>
                        <Viewer fileUrl={file} plugins={[defaultLayoutPluginInstance]} />
                    </Worker>
                </div>
            )}
        </div>
    );
}

export default PdfUploaderAndViewer;
