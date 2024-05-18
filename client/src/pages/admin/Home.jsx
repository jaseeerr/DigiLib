import React, { useEffect, useState } from 'react';
import axios from "axios"
import toast from 'react-hot-toast';
import { SERVER_URL } from '../../config/url';
import myAxiosInstance from "../../utils/axios"
function AdminPage() {
    const axiosInstance = myAxiosInstance()
    const token = localStorage.getItem('userToken')
    const [formData, setFormData] = useState({
        reportId: '',
        title: '',
        publicationYear: '',
        content: null,
        userId: '',
        keywords: ''
    });
    const [file, setFile] = useState(null);
    const [fileName,setFileName] = useState('')

    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Set the first selected file
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "publicationYear") {
            // Trim spaces when modifying the publication year
            setFormData({
                ...formData,
                [name]: value.trim()
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        const uploadFormData = new FormData();
        uploadFormData.append('pdfFile', file);  // Ensure your server is expecting 'pdfFile' key

        try {
            const response = await axios.post(
                'http://localhost:5000/admin/uploadPdf', // Change this URL to your upload route
                uploadFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            console.log('Upload response:', response.data);
            toast.dismiss()
            if(response.data.success)
                {
                    toast.success("File uploaded")
                    setFileName(response.data.filename)
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        content: response.data.filename  // Assuming the API returns a filename
                    }));

                }
            // alert('File uploaded successfully!');
            return response.data;
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Upload failed!');
            return null;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(formData);
        toast.loading("Uploading PDF")

        const uploadResult = await handleUpload();
        console.log(uploadResult)
        toast.dismiss()
        const res = await axios.post(`${SERVER_URL}/admin/uploadReport`,formData,{
            headers: {
             
                Authorization: `Bearer ${token}`,
            }
        })
        console.log(res)
    };


    useEffect(()=>{

        if(!localStorage.getItem('userToken'))
            {
                location.href = '/login'
            }
    },[])

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-center mb-6">Admin Page</h1>
            <form onSubmit={handleSubmit} className="bg-gray-100 p-4 shadow-md rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                        type="text"
                        name="reportId"
                        placeholder="Report ID"
                        value={formData.reportId}
                        onChange={handleInputChange}
                        className="input text-gray-700 p-2 rounded-md border "
                    />
                    <input
                        type="text"
                        name="title"
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
                        className="input text-gray-700 w-full p-2 rounded-md border "
                    />
                </div>
                <div className="mb-6">
                    <input
                        type="text"
                        name="userId"
                        placeholder="User ID"
                        value={formData.userId}
                        onChange={handleInputChange}
                        className="input text-gray-700 w-full p-2 rounded-md border "
                    />
                </div>
                <button type="submit" className="bg-black text-white py-2 px-4 rounded hover:bg-gray-700">
                    Add
                </button>
            </form>
        </div>
    );
}

export default AdminPage;
