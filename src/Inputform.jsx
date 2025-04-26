import React, { useState, useContext, useRef } from "react";
import { ID } from "appwrite";
import { databases, storage } from "./AppwriteServices/AppwriteServices";
import { AuthContext } from "./Context";
import { RxCross2 } from "react-icons/rx";
import { MdAddAPhoto } from "react-icons/md";
import { TbMoodEdit } from "react-icons/tb";

function Inputform() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const { slug, setRefresh, toggleInput, setFile, setProfileimg ,setContactadd } =
    useContext(AuthContext);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadError(null);

    if (!name || !email) {
      setUploadError("Both name and email are required");
      return;
    }

    try {
      setIsUploading(true);
      let fileUrl = "";
      let uploadedFileId = "";

      if (selectedFile) {
        if (selectedFile.size > 5 * 1024 * 1024) {
          throw new Error("File size exceeds 5MB limit");
        }

        try {
          const uploadedFile = await storage.createFile(
            "6807a26a0007406a2a5b",
            ID.unique(),
            selectedFile
          );

          if (!uploadedFile.$id) {
            throw new Error("File upload failed: No file ID returned");
          }

          uploadedFileId = uploadedFile.$id;

          const fileViewResponse = storage.getFileView(
            "6807a26a0007406a2a5b",
            uploadedFileId
          );
          fileUrl = fileViewResponse;
        } catch (fileError) {
          throw new Error(`File upload failed: ${fileError.message}`);
        }
      }
      const documentData = {
        name,
        email,
        userId: slug,
        profileimage: fileUrl,
      };

      await databases.createDocument(
        "67fd1d6e002436014227",
        "67fd1d88000bfae74313",
        ID.unique(),
        documentData
      );

      setRefresh((prev) => !prev);
      setName("");
      setEmail("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setFile(null);
      setProfileimg(false);
      toggleInput();
      setContactadd(true);
    } catch (error) {
      setUploadError(error.message || "An unknown error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    setUploadError(null);
    const file = e.target.files[0];

    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setUploadError(
        "Please select a valid image file (JPEG, PNG, GIF, or WEBP)"
      );
      return;
    }

    setSelectedFile(file);
    setProfileimg(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
      setFile(reader.result);
    };
    reader.onerror = () => {
      setUploadError("Error reading file");
    };
    reader.readAsDataURL(file);
  };

  const handleEditImage = () => {
    setProfileimg(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setFile(null);
    setUploadError(null);
    fileInputRef.current.value = null;
    fileInputRef.current.click();
  };

  return (
    <div className="absolute inset-0 bg-white/10 backdrop-blur-[10px] p-4 flex flex-col justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full"
      >
        <div className="w-full flex justify-end">
          <RxCross2
            onClick={toggleInput}
            className="text-white font-bold text-[25px] cursor-pointer hover:text-amber-500 transition-colors"
          />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          name="profile-image"
          id="profile-image"
          className="w-full hidden"
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/gif,image/webp"
        />

        <div className="w-full flex justify-center items-center mb-4">
          {previewUrl ? (
            <div className="relative group">
              <img
                src={previewUrl}
                alt="Profile"
                className="w-[120px] h-[120px] rounded-full object-cover border-2 border-amber-500"
              />
              <div
                onClick={handleEditImage}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <TbMoodEdit className="text-white/90 text-[40px]" />
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="border-2 border-white/60 rounded-full p-8 hover:border-amber-500 transition-colors"
              onClick={() => fileInputRef.current.click()}
            >
              <MdAddAPhoto className="text-white text-[80px]" />
            </button>
          )}
        </div>

        {uploadError && (
          <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded mb-4">
            {uploadError}
          </div>
        )}

        <div className="space-y-4 mb-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-700 text-white p-3 border border-white/40 outline-none rounded w-full focus:border-amber-500 transition-colors"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-700 text-white p-3 border border-white/40 outline-none rounded w-full focus:border-amber-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          className="bg-amber-500 text-white font-bold py-3 px-4 rounded w-full hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isUploading}
        >
          {isUploading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Uploading...
            </div>
          ) : (
            "Add Contact"
          )}
        </button>
      </form>
    </div>
  );
}

export default Inputform;
