import React, { useContext, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { AuthContext } from "../Context";
import { databases } from "../AppwriteServices/AppwriteServices";

function Inputform() {
  const { handlechange, inputvalue ,setInputvalue } = useContext(AuthContext);
  const { toggleInput, isactive,setIsactive } = useContext(AuthContext);
  const [contactcreated, setContactcreated] = useState(false);
  const [fromempty, setFormempty] = useState(false);

  const submit = (e) => {
e.preventDefault();
    if(inputvalue.name === "" || inputvalue.email === ""){
        setFormempty(true)
        setTimeout(() => {
          setFormempty(false)
        }, 2000);
        
    }
    else{
      const database = databases;
      const promise = database.createDocument(
        "67fd1d6e002436014227", // Your database ID
        "67fd1d88000bfae74313", // Your collection ID
        "unique()", // Unique ID for the document
        {
          name: inputvalue?.name  , // Ensure name is not undefined
          email: inputvalue?.email , // Ensure email is not undefined
        }
      );
      promise.then(
        function (response) {
          setContactcreated(true);
          setTimeout(() => {
            setContactcreated(false);
            setIsactive(false)
            setInputvalue({
              name: '',
              email: ''
              }) 
          }, 2000);
        },
        function (error) {
          console.error("Error creating document:", error);
        }
      );
    }
  };

  return isactive ? (
    <div className=" w-full h-full bg-white/10 backdrop-blur-[10px] p-3 absolute z-20 flex flex-col  justify-between items-center">
      <div className=" w-full h-9/10 justify-between flex items-center">
        <form
          onSubmit={submit}
          className="bg-white rounded-[10px]  w-full h-auto flex flex-col gap-3 p-4  justify-center items-end"
        >
          <button className="  ">
            <RxCross2
              onClick={toggleInput}
              className="font-bold text-[30px] cursor-pointer"
            />
          </button>

          <div className=" w-full flex flex-col">
            <label htmlFor="" className="w-full ">
              Name
            </label>
            <input
              onChange={handlechange}
              type="text"
              name="name"
              id=""
              className="bg-white p-3 text-black border border-black"
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="" className="w-full">
              Email
            </label>
            <input
              onChange={handlechange}
              type="email"
              name="email"
              id=""
              className=" w-fullbg-white p-3 text-black border border-black"
            />
          </div>
          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="bg-amber-500 px-3 text-[18px] rounded font-bold cursor-pointer py-1 "
            >
              Add Contact
            </button>
          </div>
        </form>
      </div>
      {contactcreated ? (
        <div className="w-full h-auto rounded flex flex-col gap-2  justify-between bg-green-200 ">
          <h1 className="text-[20px] text-center font-bold">Contact Create Successfully...</h1>
          <div
            className="w-full h-[5px] bg-green-500  "
            style={{
              animation: "shrinkWidth 2s linear forwards",
            }}
          ></div>
        </div>
      ) : null}
      {fromempty ? (
        <div className="w-full h-auto rounded flex flex-col justify-between gap-2 bg-red-200 p-2 ">
          <h1 className="text-[20px] text-center font-bold">Details Are Empty...</h1>
          <div
            className="w-full h-[5px] bg-red-500 "
            style={{
              animation: "shrinkWidth 2s linear forwards",
            }}
          ></div>
        </div>
      ) : null}
      <style>
        {`
          @keyframes shrinkWidth {
            from {
              width: 100%;
            }
            to {
              width: 0%;
            }
          }
        `}
      </style>
    </div>
  ) : null;
}

export default Inputform;
