import React, { useContext, useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { IoMdAddCircleOutline } from "react-icons/io";
import Inputform from "./assets/Inputform";
import ContactTemplate from "./ContactTemplate";
import { AuthContext } from "./Context";
import EditContact from "./EditContact";

function Home() {
  const { toggleInput, isactive, isEditActive,searchname, setSearchname } = useContext(AuthContext);

  const handlechange = (e)=>{
    const value = e.target.value
    setSearchname(value)    
  }

  return (
    <div>
      <div className="h-screen w-full bg-gray-900 flex justify-center items-center">
        <div className="sm:w-4/13 sm:h-9/10 h-full w-full bg-gray-600 relative flex flex-col gap-5 rounded-[10px]">
          <h1 className="text-center bg-white rounded-[10px] text-[25px] m-4 p-4 text-black font-bold">
            {" "}
            Appwrite Contact App
          </h1>
          <div className="w-full flex justify-center px-3  items-center">
            <div className="w-full flex flex-row p-2 gap-2 items-center">
              <div className="relative flex-grow">
                <IoSearchSharp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-[20px]" />
                <input
                  type="search"
                  onChange={handlechange}
                  value={searchname}
                  placeholder="Search Contact ..."
                  className="placeholder:text-white outline-none border rounded text-white p-2 pl-10 w-full"
                />
              </div>
              <button className="outline-none">
                <IoMdAddCircleOutline
                  onClick={toggleInput}
                  className="text-[40px] cursor-pointer hover:text-gray-200 duration-200 text-white"
                />
              </button>
            </div>
          </div>
          {isactive ? <Inputform /> : null}
          {isEditActive ? <EditContact /> : null}
          <ContactTemplate />
        </div>
      </div>
    </div>
  );
}

export default Home;
