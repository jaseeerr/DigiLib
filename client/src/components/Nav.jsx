import React from 'react'

function Nav() {
  return (
    <nav>
  <div className="h-20 bg-[#cecfcf] w-full flex justify-center">
    <div className="flex items-center justify-between w-full px-4 md:w-1/2">
      <a href="/" className="p-1 rounded-md">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="rgba(112,112,112,1)">
          <path d="M20 20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V11L1 11L11.3273 1.6115C11.7087 1.26475 12.2913 1.26475 12.6727 1.6115L23 11L20 11V20ZM11 13V19H13V13H11Z"></path>
        </svg>
      </a>
      <h1 className="text-md md:text-xl lg:text-2xl font-bold text-gray-800 text-center flex-1">Project Archive System</h1>
      <a href="/login" className="font-semibold p-2 rounded-md">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="rgba(112,112,112,1)">
          <path d="M5 22C4.44772 22 4 21.5523 4 21V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V6H18V4H6V20H18V18H20V21C20 21.5523 19.5523 22 19 22H5ZM18 16V13H11V11H18V8L23 12L18 16Z"></path>
        </svg>
      </a>
    </div>
  </div>
</nav>
  
  )
}

export default Nav