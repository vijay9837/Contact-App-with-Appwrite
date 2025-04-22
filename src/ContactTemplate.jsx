import React, { useState, useEffect, useContext } from "react";
import { VscAccount } from "react-icons/vsc";
import { RiEditCircleLine } from "react-icons/ri";
import { MdOutlineDeleteForever } from "react-icons/md";
import { databases } from "./AppwriteServices/AppwriteServices";
import { AuthContext } from "./Context";
import { Query } from "appwrite";

function ContactTemplate() {
  const [data, setData] = useState(null);
  const [contactDelMessage, SetContactDelMessage] = useState(false);
  const {
    isactive,
    setId,
    setIsEditActive,
    isEditActive,
    setSelectedcontact,
    refresh,
    setRefresh,
    searchname,
    slug,
  } = useContext(AuthContext);

  useEffect(() => {
    const database = databases;
    const promise = database.listDocuments(
      "67fd1d6e002436014227", // database ID
      "67fd1d88000bfae74313", // collection ID
      [Query.equal("userId", slug)]
    );

    promise
      .then(function (response) {
        const documents = response.documents;
        if (searchname) {
          const filteredItems = documents.filter((item) =>
            item.name.toLowerCase().includes(searchname.toLowerCase())
          );
          setData(filteredItems);
        } else {
          setData(documents);
        }
      })
      .catch(function (error) {
        console.error("Error listing documents:", error);
      });
  }, [isactive, refresh, searchname, slug]);

  const deleteContact = (e) => {
    const id = e.currentTarget.getAttribute("id");
    const database = databases;
    const promise = database.deleteDocument(
      "67fd1d6e002436014227", // Your database ID
      "67fd1d88000bfae74313", // Your collection ID
      `${id}`
    );
    promise
      .then(() => {
        setRefresh((prev) => !prev); // Toggle refresh state to trigger re-fetch
        SetContactDelMessage((prev) => !prev);
        setTimeout(() => {
          SetContactDelMessage((prev) => !prev);
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editcontact = (e) => {
    setIsEditActive(!isEditActive);
    const id = e.currentTarget.getAttribute("id");
    setId(id);
    const contact = data.find((item) => item.$id === id);
    setSelectedcontact(contact);
  };

  return data ? (
    <div className="h-auto w-full overflow-auto gap-2 flex-col flex justify-center items-center">
      {data.length > 0 ? (
        data.map((item) => (
          <div
            key={item.$id}
            className="w-full h-3 bg-orange-200 px-2 py-7 flex items-center justify-between rounded "
          >
            <VscAccount className="text-orange-500 text-[25px]" />
            <div className="flex flex-col w-6/10 ">
              <h2 className="text-[15px] font-bold  text-black ">
                {item.name}
              </h2>
              <p className="text-[12px]  text-black">{item.email}</p>
            </div>
            <div className="flex gap-1">
              <RiEditCircleLine
                onClick={editcontact}
                id={item.$id}
                className="cursor-pointer text-orange-500 text-[30px]"
              />
              <MdOutlineDeleteForever
                onClick={deleteContact}
                id={item.$id}
                className="cursor-pointer text-orange-500 text-[30px]"
              />
            </div>
          </div>
        ))
      ) : (
        <div className="w-full text-white font-bold text-center">
          No Contacts
        </div>
      )}

      {contactDelMessage ? (
        <div className="w-full h-auto rounded flex flex-col justify-between absolute bottom-0 gap-2 bg-red-200 p-2 ">
          <h1 className="text-[20px] text-center font-bold">
            Contact Deleted Successfully...
          </h1>
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
  ) : (
    <div className="w-full text-white font-bold text-center">Loading...</div>
  );
}

export default ContactTemplate;
