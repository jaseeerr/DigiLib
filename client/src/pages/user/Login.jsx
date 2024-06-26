import React, { useEffect, useState } from 'react';
import logo from "../../assets/manipalLogo.png"
import axios from "axios"
import toast from "react-hot-toast"
import { SERVER_URL } from '../../config/url';
function LoginPage() {
    const [formData, setFormData] = useState({
       
        email: '',
        password: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async(event) => {
        event.preventDefault();
        // Here you can integrate your method to handle the sign up logic
        console.log('User Submitted:', formData);
        const res = await axios.post(`${SERVER_URL}/admin/login`,formData)
        console.log(res)
        if(res.data.success)
            {
                localStorage.setItem('userToken',res.data.token)
                toast.success("Login Successful")
                setTimeout(()=>{
                      location.href='/admin'
                },1500)
            }
            else
            {
                toast.error(res.data.message)
                setTimeout(()=>{
                    location.reload()
              },1500)

            }

    };

    useEffect(()=>{
        if(localStorage.getItem('userToken'))
            {
                localStorage.removeItem('userToken')
            }
    },[])

    return (
        <div className="min-h-screen flex items-center justify-center  px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
            <div>
                {/* <span className='flex justify-center'>
                    <img src={logo} alt="" width='150px' />
                </span> */}
                <h2 className="mt-6 text-center text-3xl font-extrabold text-[#F37123]">
                    Login 
                </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <input type="hidden" name="remember" value="true" />
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label htmlFor="email" className="sr-only">Email address</label>
                        <input 
                            id="email" 
                            name="email" 
                            type="email" 
                            required 
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#F37123] placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#F37123] focus:border-[#F37123] focus:z-10 sm:text-sm" 
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input 
                            id="password" 
                            name="password" 
                            type="password" 
                            required 
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#F37123] placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#F37123] focus:border-[#F37123] focus:z-10 sm:text-sm" 
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                </div>
    
                <div>
                    <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#F37123] hover:bg-[#d05f1e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F37123]">
                       Login
                    </button>
                </div>
            </form>
        </div>
    </div>
    
    );
}

export default LoginPage;
