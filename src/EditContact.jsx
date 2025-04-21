import React, { useContext, useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { AuthContext } from "./Context";
import { databases } from "./AppwriteServices/AppwriteServices";

function EditContact() {
  const {
    toggleEdit,
    isEditActive,
    setIsEditActive,
    selectedcontact,
    inputvalue,
    setInputvalue,
    handlechange,
    setRefresh,
    id,
  } = useContext(AuthContext);
  const [updatemessage,setUpdatemessage] = useState(false)

  // Initialize inputvalue when edit mode is turned on
  useEffect(() => {
    if (isEditActive && selectedcontact) {
      setInputvalue({
        name: selectedcontact.name || "",
        email: selectedcontact.email || "",
      });
    }
  }, [isEditActive, selectedcontact, setInputvalue]);

  const updateContact = (e) => {
    e.preventDefault();
    if (inputvalue.name && inputvalue.email) {
      const promise = databases.updateDocument(
        "67fd1d6e002436014227", // database ID
        "67fd1d88000bfae74313", // collection ID
        `${id}`,
        inputvalue
      );

      promise
        .then((res) => {
          setRefresh((prev) => !prev);
        })
        .catch((err) => {
          console.log(err);
        });
        setUpdatemessage(true)
        setTimeout(() => {
          setIsEditActive(false);
          setUpdatemessage(false) // Close the edit form
        }, 2000);
    } else {
      console.error("Both name and email are required.");
    }
  };

  return isEditActive ? (
    <div className="w-full h-full bg-white/10 backdrop-blur-[10px] p-3 absolute top-0 left-0 z-20 flex flex-col justify-between items-center">
      <div className="w-full h-9/10 justify-between flex items-center">
        <form
          onSubmit={updateContact}
          className=" rounded-[10px] w-full h-auto flex flex-col gap-3 p-4 justify-center items-end"
        >
          <button className="">
            <RxCross2
              onClick={setIsEditActive}
              className=" text-red-600 font-bold text-[30px] cursor-pointer"
            />
          </button>

          <div className="w-full flex flex-col">
            <input
              onChange={handlechange}
              type="text"
              name="name"
              id="name"
              value={inputvalue.name}
              className="bg-gray-700 p-3 rounded  outline-none border border-white  text-white "
            />
          </div>
          <div className="flex flex-col w-full">

            <input
              onChange={handlechange}
              type="email"
              name="email"
              id="email"
              value={inputvalue.email}
              className="w-full bg-gray-700 p-3 rounded outline-none border border-white  text-white "
            />
          </div>
          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="bg-amber-500 px-3 text-[18px] w-full text-white rounded font-bold cursor-pointer py-2"
            >
              Edit Contact
            </button>
          </div>
        </form>
      </div>
      {updatemessage ? (
        <div className="w-full h-auto rounded flex flex-col justify-between absolute bottom-0 gap-2 bg-green-200 p-2 ">
          <h1 className="text-[20px] text-center font-bold">Contact Edited SuccessFully...</h1>
          <div
            className="w-full h-[5px] bg-green-500 "
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

export default EditContact;
