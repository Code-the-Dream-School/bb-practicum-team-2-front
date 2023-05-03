import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { SocketContext } from "../utils/Socket";

function Header({ setInRoom, setShowHeader }) {
  const socket = useContext(SocketContext);

  const disconnectRoom = () => {
    socket.disconnect();
    setInRoom(false);
    setShowHeader(false)
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center">
            {/* <img src="" className="h-8 mr-3" alt="Phrazel Logo" /> */}
            <span  id="logo-nav-font" className="self-center text-4xl whitespace-nowrap text-sky-400/75 ">PHRAZ_L</span>
        </div>

        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {/* <li>
              <NavLink 
                to='/' 
                className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">
                  Home
              </NavLink>
            </li> */}
            <li>
              <NavLink 
                to='/ProfilePage' 
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 hover:text-blue-700 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" aria-current="page">
                  Profile
              </NavLink>
            </li>
            <li>
              <button 
                onClick={disconnectRoom} 
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                  Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header