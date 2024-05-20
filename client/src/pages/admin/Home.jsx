import React, { useEffect, useState } from 'react';
import axios from "axios"
import toast from 'react-hot-toast';
import { SERVER_URL } from '../../config/url';
import myAxiosInstance from "../../utils/axios"
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
function AdminPage() {
    const MySwal = withReactContent(Swal);

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
    const [file, setFile] = useState(null);

    const deleteReport = (id,title)=>{
        Swal.fire({
            title: "Do you want to delete this report?"+`\n${title}`,
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

    useEffect(() => {
        if (!token) {
            window.location.href = '/login';
        }
    }, [token]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            if (selectedFile.type !== "application/pdf") {
                // Set error message and clear the input
                // setError('Please upload a PDF file.');
                event.target.value = ''; // Clear the input
                setFile(null); // Reset file state
                alert("This field only accepts PDF Files.")
            } else {
                // Clear any existing error and set the file
                // setError('');
                setFile(selectedFile);
            }
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "publicationYear" ? value.trim() : value
        }));
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a file first!");
            return;
        }

        const uploadFormData = new FormData();
        uploadFormData.append('pdfFile', file);

        try {
            const response = await axios.post(
                `${SERVER_URL}/admin/uploadPdf`,
                uploadFormData,
                { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } }
            )

            if (response.data.success) {
                toast.success("File uploaded");
                return response.data.filename;  // Return filename for further processing
            } else {
                toast.error('Upload failed!');
                return null;
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Upload failed!');
            return null;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        toast.loading("Uploading PDF");

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

    const getReports = async()=>{

        const res = await axios.get(
            `${SERVER_URL}/admin/getMyReport`,
            { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } }
        )
        console.log(res)
        setReport(res.data.data)

    }


    useEffect(()=>{
     getReports()
    },[])



    return (
       


<>

<div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-center mb-6">Add New Report</h1>
            <form onSubmit={handleSubmit} className="bg-gray-100 p-4 shadow-md rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                        type="text"
                        name="reportId"
                        maxLength={15}
                        placeholder="Report ID"
                        value={formData.reportId}
                        onChange={handleInputChange}
                        className="input text-gray-700 p-2 rounded-md border "
                    />
                    <input
                        type="text"
                        name="title"
                        maxLength={100}
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="input text-gray-700 p-2 rounded-md border "
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

                        className="input text-gray-700 w-full p-2 rounded-md border "
                    />
                </div>
                <div className="mb-4">
                    <textarea
                        name="keywords"
                        placeholder="Keywords"
                        maxLength="90"
                        value={formData.keywords}
                        onChange={handleInputChange}
                        className="input text-gray-700 w-full p-2 rounded-md border "
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="file"
                        name="content"
                        onChange={handleFileChange}
                        accept="application/pdf"
                        className="input text-gray-700 w-full p-2 rounded-md border "
                    />
                </div>
                {/* <div className="mb-6">
                    <input
                        type="text"
                        name="userId"
                        placeholder="User ID"
                        value={formData.userId}
                        onChange={handleInputChange}
                        className="input text-gray-700 w-full p-2 rounded-md border "
                    />
                </div> */}
                <button type="submit" className="bg-black text-white py-2 px-4 rounded hover:bg-gray-700">
                    Add
                </button>
            </form>

         
        </div>

<div className="overflow-x-auto lg:w-2/3 mx-auto sm:w-screen relative shadow-md sm:rounded-lg">
            {report.length > 0 &&
             <table className="w-full text-sm text-left text-gray-500 mb-10">
             <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                 <tr>
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
                         <th scope="row" className="py-2 px-2 text-center font-medium text-black whitespace-nowrap">{report.reportId}</th>
                         <td className="py-2 px-2 text-center text-black">{report.title}</td>
                         <td className="py-2 px-2 text-center text-black underline"><a href={`/report/${report.content.replace(/\.pdf$/, '')}`} target='_blank'>{report.content}</a></td>
                         <td className="py-2 px-2 text-center text-black">{report.publicationYear}</td>
                         <td className="py-2 px-2 text-center text-black whitespace-break-spaces">{report.keywords}</td>
                         <td className="py-2 px-2 text-center text-black">{report.ownerName}</td>
                         <td className="py-2 px-2 text-center text-black">
                         <a onClick={()=>deleteReport(report._id,report.content)} type="submit" className="bg-black cursor-pointer text-white py-1 px-2 rounded hover:bg-gray-700">
                            Delete
                         </a>
                         </td>
                     </tr>
                 ))}
             </tbody>
         </table>
            }
           
        </div>
</>
    );
}

export default AdminPage;
