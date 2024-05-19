import React, { useState,useEffect } from 'react';
import axios from "axios"
import { SERVER_URL } from '../../config/url';
function ProjectArchiveSystem() {
    const [formData, setFormData] = useState({
        keyword: '',
        from: '',
        to: ''
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
                            type="text"
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
                            type="text"
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
                      <td className="py-2 px-2 text-center text-black underline"><a href={`/report/${report.content.replace(/\.pdf$/, '')}`} target='_blank'>{report.content}</a></td>
                      <td className="py-2 px-2 text-center text-black">{report.publicationYear}</td>
                      <td className="py-2 px-2 text-center text-black">{report.ownerName}</td>
                  </tr>
                 ))}
             </tbody>
         </table>
            }
           
        </div>
      </>
    );
}

export default ProjectArchiveSystem;
