import React, { useEffect, useState } from 'react';
import axios from "axios"
import toast from 'react-hot-toast';
import { SERVER_URL } from '../../config/url';
import myAxiosInstance from "../../utils/axios"
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
function AdminPage() {
    const MySwal = withReactContent(Swal);
    const [modal,setModal] = useState()
    const token = localStorage.getItem('userToken');
    const [report,setReport] = useState([])
    const [formData, setFormData] = useState({
        reportId: '',
        title: '',
        publicationYear: '',
        content: '',
        userId: '',
        keywords: ''
    });
    const [editFormData, setEditFormData] = useState({
        id:'',
        reportId: '',
        title: '',
        publicationYear: '',
        keywords: ''
    });
    const [file, setFile] = useState([]);
    const [files, setFiles] = useState([]);
    const [checkedReports, setCheckedReports] = useState([]);

    const handleCheckboxChange = (event, reportTitle) => {
        if (event.target.checked) {
            setCheckedReports([...checkedReports, reportTitle]);
        } else {
            setCheckedReports(checkedReports.filter(title => title !== reportTitle));
        }
        
    };

    useEffect(()=>{
console.log(checkedReports);
    },[checkedReports])

    const generateUniqueNumber = () => {
        const currentTimeMillis = Date.now();
        const randomFourDigit = Math.floor(1000 + Math.random() * 9000); // Generates a random 4-digit number
        const uniqueNumber = `${currentTimeMillis}${randomFourDigit}`;
        // setUniqueNumber(uniqueNumber);
        setFormData(prevFormData => ({
            ...prevFormData,
            reportId: uniqueNumber
          }));
      };

    

    const deleteReport = (id,title)=>{
        if(checkedReports.length>1)
            {
                Swal.fire({
                    title: "Do you want to delete the selected reports?",
                    showDenyButton: false,
                    showCancelButton: true,
                    confirmButtonText: "Delete",
                    denyButtonText: `Don't save`
                  }).then(async(result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                      Swal.fire("Deleted!", "", "success");
                      const res = await axios.post(
                        `${SERVER_URL}/admin/deleteMultipleReports`,
                        { reports: checkedReports },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    setTimeout(()=>{
                        location.reload()
                    },1500)
                    } else if (result.isDenied) {
                      Swal.fire("Changes are not saved", "", "info");
                    }
                  });
            }
            else
            {
                Swal.fire({
                    title: "Do you want to delete this report?",
                    showDenyButton: false,
                    showCancelButton: true,
                    confirmButtonText: "Delete",
                    denyButtonText: `Don't save`
                  }).then(async(result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                      Swal.fire("Deleted!", "", "success");
                      const res = await axios.get(
                        `${SERVER_URL}/admin/deleteReport/${id}`,
                        
                        { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } }
                    )
                    setTimeout(()=>{
                        location.reload()
                    },1500)
                    } else if (result.isDenied) {
                      Swal.fire("Changes are not saved", "", "info");
                    }
                  });
            }
      
    }

    useEffect(() => {
        if (!token) {
            window.location.href = '/login';
        }
    }, [token]);

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        const validFiles = selectedFiles.filter(file => file.type === "application/pdf");
    
        if (validFiles.length !== selectedFiles.length) {
            alert("Some files were not PDFs and have been excluded.");
        }
    
        if (validFiles.length > 0) {
            setFiles(validFiles);
        } else {
            event.target.value = ''; // Clear the input
            setFiles([]);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "publicationYear" ? value.trim() : value
        }));
    };

    const handleEditInputChange = (event) => {
        const { name, value } = event.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: name === "publicationYear" ? value.trim() : value
        }));
    };
    const handleUpload = async () => {
        if (files.length === 0) {
            toast.error("Please select files first!");
            return;
        }
    
        const filenames = [];
    
        for (const file of files) {
            const uploadFormData = new FormData();
            uploadFormData.append('pdfFile', file);
    
            try {
                const response = await axios.post(
                    `${SERVER_URL}/admin/uploadPdf`,
                    uploadFormData,
                    { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } }
                );
    
                if (response.data.success) {
                    toast.success(`File ${file.name} uploaded successfully.`);
                    filenames.push(response.data.filename);
                } else {
                    toast.error(`Upload failed for ${file.name}`);
                }
            } catch (error) {
                console.error(`Error uploading file ${file.name}:`, error);
                toast.error(`Upload failed for ${file.name}`);
            }
        }
    
        console.log('All uploaded filenames:', filenames);
        return filenames;  // Return filenames for further processing
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        toast.loading("Uploading Report");

        const filename = await handleUpload();
        if (filename) {
            const updatedFormData = { ...formData, content: filename };
            console.log('Updated formData:', updatedFormData);

            try {
                const res = await axios.post(
                    `${SERVER_URL}/admin/uploadReport`,
                    updatedFormData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                toast.dismiss();
                if (res.data.success) {
                    toast.success("Report uploaded successfully!");
                } else {
                    toast.error("Unknown Error");
                }

                setTimeout(()=>{
          location.reload()
                },1000)
            } catch (error) {
                console.error('Error uploading report:', error);
                toast.error('Error during report upload');
            }
        }
    };

    const updateReport = async (e)=>{
        e.preventDefault()
        console.log(editFormData);
           const res = await axios.post(
            `${SERVER_URL}/admin/updateReport`,
            {data:editFormData},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if(res.data.success)
            {
                toast.success('Done')
                setTimeout(()=>{
                    location.reload()
                },800)
            }
            else
            {
                toast.error('Error')
            }
    }

    const getReports = async()=>{

        const res = await axios.get(
            `${SERVER_URL}/admin/getMyReport`,
            { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } }
        )
        console.log(res)
        setReport(res.data.data)

    }


    useEffect(()=>{
        generateUniqueNumber()
     getReports()
    },[])



    return (
       

<>
{modal &&
                <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 w-full md:w-1/2 rounded-lg shadow-lg relative">
                        <h2 className="text-xl text-center mb-3 font-bold text-[#F37123]">Edit Report</h2>
                        <form onSubmit={updateReport} className="bg-white p-4 shadow-md rounded-lg">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
            <label htmlFor="reportId" className="block text-gray-700 mb-2">Report ID</label>
            <input
                type="text"
                id="reportId"
                name="reportId"
                maxLength={15}
                placeholder="Report ID"
                value={editFormData.reportId}
                onChange={handleEditInputChange}
                className="input text-gray-700 p-2 w-full rounded-md border border-[#F37123]"
            />
        </div>
        <div>
            <label htmlFor="title" className="block text-gray-700 mb-2">Title</label>
            <input
                type="text"
                id="title"
                name="title"
                maxLength={100}
                placeholder="Title"
                value={editFormData.title}
                onChange={handleEditInputChange}
                className="input text-gray-700 p-2 w-full rounded-md border border-[#F37123]"
            />
        </div>
    </div>
    <div className="mb-4">
        <label htmlFor="publicationYear" className="block text-gray-700 mb-2">Publication Year</label>
        <input
            type="number"
            id="publicationYear"
            name="publicationYear"
            min={1930}
            max={2024}
            placeholder="Publication Year"
            value={editFormData.publicationYear}
            onChange={handleEditInputChange}
            className="input text-gray-700 w-full p-2 rounded-md border border-[#F37123]"
        />
    </div>
    <div className="mb-4">
        <label htmlFor="keywords" className="block text-gray-700 mb-2">Keywords</label>
        <textarea
            id="keywords"
            name="keywords"
            placeholder="Keywords"
            maxLength="90"
            value={editFormData.keywords}
            onChange={handleEditInputChange}
            className="input text-gray-700 w-full p-2 rounded-md border border-[#F37123]"
        />
    </div>
    <span className='flex justify-center'>
    <button type="submit" className="bg-[#F37123] text-white py-2 px-4 rounded hover:bg-[#d05f1e]">
        Update Report
    </button>
    </span>
</form>

                        <span className='flex justify-center'>
                            <button 
                                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                                onClick={() => setModal(false)}
                            >
                                Close
                            </button>
                        </span>
                    </div>
                </div>
            }
    <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#F37123]">Add New Report</h1>
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                    type="text"
                    name="reportId"
                    maxLength={15}
                    placeholder="Report ID"
                    value={formData.reportId}
                    onChange={handleInputChange}
                    className="input text-gray-700 p-2 rounded-md border border-[#F37123]"
                />
                <input
                    type="text"
                    name="title"
                    maxLength={100}
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input text-gray-700 p-2 rounded-md border border-[#F37123]"
                />
            </div>
            <div className="mb-4">
                <input
                    type="number"
                    min={1930}
                    max={2024}
                    name="publicationYear"
                    placeholder="Publication Year"
                    value={formData.publicationYear}
                    onChange={handleInputChange}
                    className="input text-gray-700 w-full p-2 rounded-md border border-[#F37123]"
                />
            </div>
            <div className="mb-4">
                <textarea
                    name="keywords"
                    placeholder="Keywords"
                    maxLength="90"
                    value={formData.keywords}
                    onChange={handleInputChange}
                    className="input text-gray-700 w-full p-2 rounded-md border border-[#F37123]"
                />
            </div>
            <div className="mb-4">
                <input
                    type="file"
                    name="content"
                    multiple
                    onChange={handleFileChange}
                    accept="application/pdf"
                    className="input text-gray-700 w-full p-2 rounded-md border border-[#F37123]"
                />
            </div>
            <button type="submit" className="bg-[#F37123] text-white py-2 px-4 rounded hover:bg-[#d05f1e]">
                Add
            </button>
        </form>
    </div>

    <div className="overflow-x-auto lg:w-2/3 mx-auto sm:w-screen relative shadow-md sm:rounded-lg">
    {  report.length > 0 && (
            <div>
                <table className="w-full text-sm text-left text-gray-500 ">
                    <thead className="text-xs text-[#F37123] uppercase bg-white">
                        <tr>
                            <th scope="col" className="py-2 px-2 text-center">Select</th>
                            <th scope="col" className="py-2 px-2 text-center">Report ID</th>
                            <th scope="col" className="py-2 px-2 text-center">Title</th>
                            <th scope="col" className="py-2 px-2 text-center">Content</th>
                            <th scope="col" className="py-2 px-2 text-center">Publication Year</th>
                            <th scope="col" className="py-2 px-2 text-center">Keywords</th>
                            <th scope="col" className="py-2 px-2 text-center">User ID</th>
                            <th scope="col" className="py-2 px-2 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.map(report => (
                            <tr key={report._id} className="bg-white border-b">
                                <td className="py-2 px-2 text-center">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => handleCheckboxChange(e, report._id)}
                                    />
                                </td>
                                <th scope="row" className="py-2 px-2 text-center font-medium text-[#F37123] whitespace-nowrap">
                                    {report.reportId}
                                </th>
                                <td className="py-2 px-2 text-center text-[#F37123]">{report.title}</td>
                                <td className="py-2 px-2 text-center text-[#F37123]">
                                    {report.content.map((file, index) => (
                                        <div key={index} className="underline mb-2">
                                            <a href={`/report/${file.replace(/\.pdf$/, '')}`} target='_blank'>{file}</a>
                                        </div>
                                    ))}
                                </td>
                                <td className="py-2 px-2 text-center text-[#F37123]">{report.publicationYear}</td>
                                <td className="py-2 px-2 text-center text-[#F37123] whitespace-break-spaces">{report.keywords}</td>
                                <td className="py-2 px-2 text-center text-[#F37123]">{report.ownerName}</td>
                                <td className="py-2 px-2 text-center text-[#F37123]">
                                    <a
                                        onClick={() => deleteReport(report._id, report.content)}
                                        type="submit"
                                        className="bg-[#F37123] cursor-pointer text-white py-1 px-2 rounded hover:bg-[#d05f1e]"
                                    >
                                        Delete
                                    </a>
                                    <br />
                                    <a
                                        onClick={()=>{
                                            setEditFormData(prevState => ({
                                                ...prevState,
                                                id:report._id,
                                                title: report.title,
                                                reportId: report.reportId,
                                                keywords:report.keywords,
                                                publicationYear:report.publicationYear
                                            }));
                                            setModal(true)
                                        }}
                                        type="submit"
                                        className="bg-[#F37123] ml-3 sm:ml-0 mt-0 sm:mt-2 cursor-pointer text-white py-1 px-2 rounded hover:bg-[#d05f1e]"
                                    >
                                        Edit
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             
            </div>
        )}

    </div>
</>

    );
}

export default AdminPage;
