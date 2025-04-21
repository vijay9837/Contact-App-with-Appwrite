import React, { useContext, useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { IoMdAddCircleOutline } from "react-icons/io";
import Inputform from "../Inputform";
import ContactTemplate from "../ContactTemplate";
import { AuthContext } from "../Context";
import EditContact from "../EditContact";
import Login from "../Login";
import Signup from "../Signup";
import { Client, Account } from "appwrite";
import Dropdown from "../components/Dropdown";
import bg from "../assets/bg.png";

function Home() {
  const {
    toggleInput,
    isactive,
    isEditActive,
    searchname,
    setSearchname,
    islogin,
    isloginform,
    setIsloginform,
    setIssignupform,
    issignupform,
    setIslogin,
    setSlug,
  } = useContext(AuthContext);

  const [apploading, setApploading] = useState(true);

  useEffect(() => {
    const client = new Client().setProject("67fd1d1800257211c340");
    const account = new Account(client);

    account
      .getSession("current")
      .then((res) => {
        setIslogin(res?.userId);
        setSlug(res?.$id)
        setTimeout(() => setApploading(false), 1000)
      })
      .catch((err) => {
        console.log(err);
        setIslogin(null);
        setApploading(false);
      });
  }, []);

  const handlechange = (e) => {
    setSearchname(e.target.value);
  };

  if (apploading) {
    return (
      <div className="flex justify-center items-center h-full">
        <h1 className="text-white text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="w-full sm:w-3/10 h-full relative">
      {islogin === null ? (
      <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl flex flex-col items-center justify-center relative">
        <img src={bg} alt="" className=" h-full bg-cover absolute opacity-40 " />
      <div className="w-full  max-w-md bg-black/50 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-md animate-fade-in">
      
        <div className="flex flex-col justify-center mb-6 gap-3">
          <button
            onClick={() => {
              setIsloginform(true);
              setIssignupform(false);
            }}
            className={`px-6 py-2 rounded-full text-white font-semibold transition-all duration-300 ${
              isloginform
                ? "bg-amber-500 shadow-lg"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIssignupform(true);
              setIsloginform(false);
            }}
            className={`px-6 py-2 rounded-full text-white font-semibold transition-all duration-300 ${
              issignupform
                ? "bg-amber-500 shadow-lg"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            Signup
          </button>
        </div>
    
        {isloginform && <Login />}
        {issignupform && <Signup />}
      </div>
    </div>
    
      ) : (
        <div className="w-full h-full bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex w-full justify-end items-center p-1">
            <Dropdown />
          </div>
          <h1 className="text-center text-white text-2xl font-bold mb-6">
            Appwrite Contact App
          </h1>
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-grow">
              <IoSearchSharp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="search"
                onChange={handlechange}
                value={searchname}
                placeholder="Search Contact ..."
                className="w-full bg-gray-700 text-white placeholder-gray-400 py-2 pl-10 pr-4 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <button onClick={toggleInput} className="text-white text-3xl">
              <IoMdAddCircleOutline className="hover:text-amber-500 transition" />
            </button>
          </div>
          {isactive && <Inputform />}
          {isEditActive && <EditContact />}
          <ContactTemplate />
        </div>
      )}
    </div>
  );
}

export default Home;
