import React, { useState } from 'react';

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Searching for:', formData);
        // Add your search logic here
    };

    const reports = [
      { id: 1, title: 'Report One', content: 'Content One', year: 2022, userId: 101 },
      { id: 2, title: 'Report Two', content: 'Content Two', year: 2021, userId: 102 },
      { id: 3, title: 'Report Three', content: 'Content Three', year: 2023, userId: 103 },
      // Add more data as needed
  ];

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
                    <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">Keywords:</label>
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
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                    Access Reports
                </button>
            </form>
        </div>

        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="py-3 px-6">Report ID</th>
                        <th scope="col" className="py-3 px-6">Title</th>
                        <th scope="col" className="py-3 px-6">Content</th>
                        <th scope="col" className="py-3 px-6">Publication Year</th>
                        <th scope="col" className="py-3 px-6">User ID</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map(report => (
                        <tr key={report.id} className="bg-white border-b">
                            <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">{report.id}</th>
                            <td className="py-4 px-6">{report.title}</td>
                            <td className="py-4 px-6">{report.content}</td>
                            <td className="py-4 px-6">{report.year}</td>
                            <td className="py-4 px-6">{report.userId}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </>
    );
}

export default ProjectArchiveSystem;
