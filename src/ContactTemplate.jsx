import React, { useState, useEffect, useContext } from "react";
import { VscAccount } from "react-icons/vsc";
import { RiEditCircleLine } from "react-icons/ri";
import { MdOutlineDeleteForever } from "react-icons/md";
import { databases } from "./AppwriteServices/AppwriteServices";
import { AuthContext } from "./Context";
import { Query } from "appwrite";
import { Storage } from "appwrite";
import { Client } from "appwrite";
import Message from "./Message";

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
    fileurl,
    setFileurl,
    contactadd,
  } = useContext(AuthContext);

  useEffect(() => {
    const client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject("67fd1d1800257211c340");

    const database = databases;
    const storage = new Storage(client);

    const fetchData = async () => {
      try {
        const response = await database.listDocuments(
          "67fd1d6e002436014227",
          "67fd1d88000bfae74313",
          [Query.equal("userId", slug)]
        );

        const documents = response.documents;

        const updatedDocuments = documents.map((item) => {
          const fileId = item.profileimage;
          const fileurl = fileId
            ? storage.getFileView("6807a26a0007406a2a5b", fileId).href
            : null;

          return { ...item, fileViewUrl: fileurl };
        });

        if (searchname) {
          const filteredItems = updatedDocuments.filter((item) =>
            item.name.toLowerCase().includes(searchname.toLowerCase())
          );
          setData(filteredItems);
        } else {
          setData(updatedDocuments);
        }
      } catch (error) {
        console.error("Error listing documents:", error);
      }
    };
    fetchData();
  }, [isactive, refresh]);

  const deleteContact = (e) => {
    const id = e.currentTarget.getAttribute("id");
    const database = databases;
    const promise = database.deleteDocument(
      "67fd1d6e002436014227",
      "67fd1d88000bfae74313",
      `${id}`
    );
    promise
      .then(() => {
        setRefresh((prev) => !prev);
        SetContactDelMessage(true);
        setTimeout(() => {
          SetContactDelMessage(false);
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
            className="w-full bg-orange-200 px-2 py-7 flex items-center justify-between rounded"
          >
            <div className="flex items-center gap-3">
              {item.profileimage ? (
                <img
                  src={item.profileimage}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <VscAccount className="w-10 h-10 text-orange-500" />
              )}
              <div className="flex flex-col">
                <h2 className="text-[15px] font-bold text-black">{item.name}</h2>
                <p className="text-[12px] text-black">{item.email}</p>
              </div>
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

      {contactDelMessage && (
        <Message children={`Contact Deleted SuccesFully...`}/>
      )}
      {contactadd && (
        <Message children={`Contact Added SuccesFully...`} bgColor = 'bg-green-500/30' borderColor = 'border-green-500'/>
      )}
    </div>
  ) : (
    <div className="w-full text-white font-bold text-center">Loading...</div>
  );
}

export default ContactTemplate;
