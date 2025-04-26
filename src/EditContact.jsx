import React, { useEffect, useState, useRef, useContext } from "react";
import { RxCross2 } from "react-icons/rx";
import { AuthContext } from "./Context";
import {
  databases,
  storage,
  account,
} from "./AppwriteServices/AppwriteServices";
import { TbMoodEdit } from "react-icons/tb";
import { MdAddAPhoto } from "react-icons/md";
import Message from "./Message";

function EditContact() {
  const {
    isEditActive,
    setIsEditActive,
    selectedcontact,
    inputvalue,
    setInputvalue,
    handlechange,
    setRefresh,
    id,
    fileurl,
    setFileurl,
    setProfileimg,
  } = useContext(AuthContext);

  const [updatemessage, setUpdatemessage] = useState(false);
  const file = useRef();

  useEffect(() => {
    if (isEditActive && selectedcontact) {
      setInputvalue({
        name: selectedcontact.name || "",
        email: selectedcontact.email || "",
      });
      setFileurl(selectedcontact.profileimage || "");
    }
  }, [isEditActive, selectedcontact, setInputvalue, setFileurl]);

  const uploadNewProfileImage = async (selectedFile) => {
    try {
      if (selectedcontact?.profileimage) {
        const match = selectedcontact.profileimage.match(/files\/(.*?)\//);
        const oldFileId = match?.[1];
        if (oldFileId) {
          try {
            await storage.deleteFile("6807a26a0007406a2a5b", oldFileId);
          } catch (err) {
            console.warn("Failed to delete old file", err);
          }
        }
      }

      const user = await account.get();
      const userId = user.$id;

      const uploaded = await storage.createFile(
        "6807a26a0007406a2a5b",
        "unique()",
        selectedFile
      );

      const preview = storage.getFileView("6807a26a0007406a2a5b", uploaded.$id);
      await databases.updateDocument(
        "67fd1d6e002436014227",
        "67fd1d88000bfae74313",
        `${id}`,
        {
          name: inputvalue.name,
          email: inputvalue.email,
          profileimage: preview,
        }
      );

      setProfileimg(true);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error uploading new profile image:", error);
    }
  };

  const updateContact = (e) => {
    e.preventDefault();
    if (inputvalue.name && inputvalue.email) {
      const updateData = {
        name: inputvalue.name,
        email: inputvalue.email,
        profileimage: fileurl,
      };

      databases
        .updateDocument(
          "67fd1d6e002436014227",
          "67fd1d88000bfae74313",
          `${id}`,
          updateData
        )
        .then((res) => {
          setRefresh((prev) => !prev);
        })
        .catch((err) => {
          console.log(err);
        });

      setUpdatemessage(true);
      setTimeout(() => {
        setIsEditActive(false);
        setUpdatemessage(false);
      }, 1000);
    } else {
      console.error("Both name and email are required.");
    }
  };

  return isEditActive ? (
    <div className="w-full h-full bg-white/10 backdrop-blur-[10px] p-3 absolute top-0 left-0 z-20 flex flex-col justify-between items-center">
      <div className="w-full h-9/10 justify-center flex-col flex items-center">
        <div className="flex justify-end items-center w-full p-4 h-1/10">
          <button
            onClick={() => setIsEditActive(!isEditActive)}
            className="text-red-600 font-bold text-[30px] cursor-pointer"
          >
            <RxCross2 />
          </button>
        </div>

        <form
          onSubmit={updateContact}
          className="rounded-[10px] w-full h-auto flex flex-col gap-3 p-4 justify-center items-end"
        >
          {fileurl ? (
            <div className="w-full flex justify-center items-center relative">
              <img
                src={fileurl}
                className="w-[120px] h-[120px] rounded-full object-cover border border-black mb-2 text-white text-[20px]"
              />
              <TbMoodEdit
                onClick={() => file.current.click()}
                className="absolute text-white/90 font-extralight text-[60px] cursor-pointer"
              />
            </div>
          ) : (
            <div className="flex justify-center items-center">
              {fileurl && (
                <img
                  src={fileurl}
                  alt="Profile Preview"
                  className="w-[120px] h-[120px] rounded-full object-cover border border-black mb-2"
                />
              )}
              <button
                className="flex justify-center items-center"
                onClick={(e) => {
                  e.preventDefault();
                  file.current.click();
                }}
              >
                <MdAddAPhoto className="border mb-2 text-white border-white rounded-full p-8 text-[150px]" />
              </button>
            </div>
          )}

          <input
            type="file"
            ref={file}
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files[0]) {
                const selectedFile = e.target.files[0];
                const imageURL = URL.createObjectURL(selectedFile);
                setFileurl(imageURL); // Show preview of the image
                uploadNewProfileImage(selectedFile);
              }
            }}
          />

          <input
            onChange={handlechange}
            type="text"
            name="name"
            value={inputvalue.name}
            className="bg-gray-700 p-3 rounded outline-none border border-white text-white w-full"
          />
          <input
            onChange={handlechange}
            type="email"
            name="email"
            value={inputvalue.email}
            className="bg-gray-700 p-3 rounded outline-none border border-white text-white w-full"
          />

          <button
            type="submit"
            className="bg-amber-500 px-3 text-[18px] w-full text-white rounded font-bold cursor-pointer py-2"
          >
            Edit Contact
          </button>
        </form>
      </div>

      {updatemessage && (
        <Message
          children={`Edit Contact Succesfully.. `}
          bgColor="bg-green-500/30"
          borderColor="border-green-500"
        />
      )}
    </div>
  ) : null;
}

export default EditContact;
