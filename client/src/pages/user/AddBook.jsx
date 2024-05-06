import React, { useState } from 'react';

function AddBookForm() {
    const [formData, setFormData] = useState({
        bookName: '',
        authorName: '',
        genre: '',
        file: null
    });

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle the form submission logic here, like sending data to a server or processing it locally
        console.log('Form Data Submitted:', formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Add a New Book
                </h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" value="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="bookName" className="sr-only">Book Name</label>
                            <input
                                id="bookName"
                                name="bookName"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Book Name"
                                value={formData.bookName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="authorName" className="sr-only">Author Name</label>
                            <input
                                id="authorName"
                                name="authorName"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Author Name"
                                value={formData.authorName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="genre" className="sr-only">Genre</label>
                            <input
                                id="genre"
                                name="genre"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Genre"
                                value={formData.genre}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="file" className="sr-only">Upload PDF</label>
                            <input
                                id="file"
                                name="file"
                                type="file"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                onChange={handleChange}
                                accept=".pdf"
                            />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Add Book
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddBookForm;
