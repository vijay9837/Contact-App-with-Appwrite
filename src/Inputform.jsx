import React, { useState, useContext } from "react";
import { ID } from "appwrite";
import { databases } from "./AppwriteServices/AppwriteServices";
import { AuthContext } from "./Context";
import { RxCross2 } from "react-icons/rx";


function Inputform() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { slug, setRefresh, toggleInput } = useContext(AuthContext); // Make sure slug is available

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      alert("Both fields are required");
      return;
    }

    try {
      const res = await databases.createDocument(
        "67fd1d6e002436014227", // database ID
        "67fd1d88000bfae74313", // collection ID
        ID.unique(),
        {
          name,
          email,
          userId: slug, 
        }
      );
      console.log("Document created:", res);
      setRefresh((prev) => !prev); // trigger a refresh in ContactTemplate
      setName("");
      setEmail("");
      toggleInput(); // close input form
    } catch (error) {
      console.error("Failed to create document:", error);
    }
  };

  return (
    <div className="absolute inset-0 bg-white/10 backdrop-blur-[10px] p-4 flex flex-col justify-center items-center">
      
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full  ">
    <div className="w-full flex justify-end">
      <RxCross2 onClick={toggleInput} className="text-white font-bold text-[25px] cursor-pointer"/>
      </div>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-gray-700 text-white p-3 border border-white outline-none rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-gray-700 text-white p-3 border border-white outline-none rounded"
      />
      <button
        type="submit"
        className="bg-amber-500 text-white font-bold py-3 px-4 rounded hover:bg-amber-600 transition"
      >
        Add Contact
      </button>
    </form>
    </div>
  );
}

export default Inputform;
