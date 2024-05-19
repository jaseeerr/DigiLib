import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { useParams } from 'react-router-dom';

function PdfViewer() {
    const [fileUrl, setFileUrl] = useState('');
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    // Example filename - you might want to retrieve this from user input or another source
    const filename = 'pdfFile-1716050175628.pdf';
    
    const {id} = useParams()

    useEffect(() => {
        const fetchPdfFile = async () => {
            try {
                const filename1 = await localStorage.getItem('pdfName')
                // Update the URL to your server's URL
                const response = await axios.get(`http://localhost:5000/getPdf/${id}`, {
                    responseType: 'blob'  // Important for dealing with PDFs
                });

                // Create a URL for the PDF blob
                const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
                setFileUrl(URL.createObjectURL(pdfBlob));
            } catch (error) {
                console.error('Error fetching PDF file:', error);
                // alert("Failed to fetch PDF file.");
            }
        };

        fetchPdfFile();
    }, [filename]);  // Dependency array to avoid refetching unless filename changes

    const workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

    return (
        <div className="container mx-auto p-4">
            {fileUrl ? (
                <div className="pdf-container" style={{ height: '750px' }}>
                    <Worker workerUrl={workerSrc}>
                        <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
                    </Worker>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default PdfViewer;
