import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [id, setId] = useState("");
  const [searchname, setSearchname] = useState("")
  const [inputvalue, setInputvalue] = useState({
    name: "",
    email: "",
  });

  const handlechange = (e) => {
    const { name, value } = e.target;
    setInputvalue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [isactive, setIsactive] = useState(false);
  const [isEditActive, setIsEditActive] = useState(false);
  const [refresh, setRefresh] = useState(false); // State to trigger re-fetch
  const [selectedcontact, setSelectedcontact] = useState(null);
  const toggleInput = () => {
    setIsactive(!isactive);
  };

  return (
    <AuthContext.Provider
      value={{
        id,
        setId,
        refresh,
        setRefresh,
        setSelectedcontact,
        selectedcontact,
        toggleInput,
        setIsEditActive,
        isEditActive,
        setInputvalue,
        setIsactive,
        isactive,
        inputvalue,
        handlechange,
        setSearchname,
        searchname
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
