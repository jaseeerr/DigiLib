import React, { useState,useEffect } from 'react';
import axios from "axios"
import toast from "react-hot-toast"
import { SERVER_URL } from '../../config/url';

import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
function ProjectArchiveSystem() {
    const [formData, setFormData] = useState({
        keywords: '',
        fromYear: '',
        toYear: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit =async (e) => {
        e.preventDefault();
        console.log('Searching for:', formData);
        const res = await axios.post(`${SERVER_URL}/search`,formData)
        console.log(res)
        if(res.data.success)
            {
                toast.success(`${res.data.data.length} Matching Reports Fetched`)
                if(res.data.data.length>0)
                    {
                        setReports(res.data.data)
                    }
            }

        
    };




  const [reports, setReports] = useState([]);

  useEffect(() => {
      const fetchLatestReports = async () => {
          try {
              const response = await axios.get('http://localhost:5000/getReports');
              setReports(response.data);
          } catch (error) {
              console.error('Error fetching latest reports:', error);
          }
      };

      fetchLatestReports();
  }, []);

const [keyword,setKeyword] = useState('hackbook')





const [fileUrl, setFileUrl] = useState('');
const defaultLayoutPluginInstance = defaultLayoutPlugin();

// Example filename - you might want to retrieve this from user input or another source
const filename = 'pdfFile-1716051592255';

const [modal,setModal] = useState(false)


useEffect(() => {
    const fetchPdfFile = async () => {
        try {
            const filename1 = await localStorage.getItem('pdfName')
            // Update the URL to your server's URL
            const response = await axios.get(`http://localhost:5000/getPdf/${filename}`, {
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
      <>
     
        <div className="bg-white p-5 rounded-lg shadow-md max-w-2xl mx-auto my-10">
            {/* <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Archive System</h1> */}
            <p className="text-gray-700 mb-6">
                Welcome to our digital report archive, your hub for student-generated research! Delve into a wealth
                of reports by utilizing our intuitive keyword search feature or refine your results by specifying 
                publication years. Start your exploration today and uncover valuable insights from student projects 
                across various fields.
            </p>
         

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">Search:</label>
                    <input
                        type="text"
                        name="keywords"
                        id="keywords"
                        value={formData.keywords}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="keywords"
                    />
                </div>
                <div className="flex gap-4">
                    <div>
                        <label htmlFor="fromYear" className="block text-sm font-medium text-gray-700">From:</label>
                        <input
                            type="number"
                            name="fromYear"
                            id="fromYear"
                            value={formData.fromYear}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Year"
                        />
                    </div>
                    <div>
                        <label htmlFor="toYear" className="block text-sm font-medium text-gray-700">To:</label>
                        <input
                            type="number"
                            name="toYear"
                            id="toYear"
                            value={formData.toYear}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Year"
                        />
                    </div>
                </div>
                <button type='submit' className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                    Access Reports
                </button>
            </form>
        </div>

        <div className="overflow-x-auto lg:w-2/3 mx-auto sm:w-screen relative shadow-md sm:rounded-lg mb-10">
            {reports.length > 0 &&
             <table className="w-full text-sm text-left text-gray-500">
             <thead className="text-xs text-gray-700 uppercase bg-gray-100 border">
             <tr>
                     <th scope="col" className="py-2 px-2 text-center">Report ID</th>
                     <th scope="col" className="py-2 px-2 text-center">Title</th>
                     <th scope="col" className="py-2 px-2 text-center">Content</th>
                     <th scope="col" className="py-2 px-2 text-center">Publication Year</th>
                     <th scope="col" className="py-2 px-2 text-center">User ID</th>
                 </tr>
             </thead>
             <tbody>
                 {reports.map(report => (
                      <tr key={report._id} className="bg-white border-b">
                      <th scope="row" className="py-2 px-2 text-center font-medium text-black whitespace-nowrap">{report.reportId}</th>
                      <td className="py-2 px-2 text-center text-black">{report.title}</td>
                      {/* <td className="py-2 px-2 text-center text-black underline"><a href={`/report/${report.content.replace(/\.pdf$/, '')}`} target='_blank'>{report.content}</a></td> */}
                      <td className="py-2 px-2 text-center text-black underline cursor-pointer"><a onClick={()=>{setModal(true)}}>{report.content}</a></td>
                      <td className="py-2 px-2 text-center text-black">{report.publicationYear}</td>
                      <td className="py-2 px-2 text-center text-black">{report.ownerName}</td>
                  </tr>
                 ))}
             </tbody>
         </table>
            }
           
        </div>


       {modal && 
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-5 w-full md:w-1/2  rounded-lg shadow-lg relative">
            <h2 className="text-xl text-center mb-3 font-bold">Report</h2>
            <div className="container ">
{fileUrl ? (
    <div className="pdf-container" style={{ height: '550px' }}>
        <Worker workerUrl={workerSrc}>
            <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
        </Worker>
    </div>
) : (
    <p>Loading...</p>
)}
</div>
            <span className='flex justify-center'>
            <button 
                className="mt-4 px-4 py-2 bg-red-500 text-white  rounded hover:bg-red-700"
               onClick={()=>setModal(false)}
            >
                Close
            </button>
            </span>
        </div>
    </div>
    }
      </>
    );
}

export default ProjectArchiveSystem;
