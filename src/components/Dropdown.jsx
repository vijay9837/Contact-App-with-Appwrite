import React from "react";
import { VscAccount } from "react-icons/vsc";
import { RxCross2 } from "react-icons/rx";
import { Account, Client } from "appwrite";
import { AuthContext } from "../Context";

function Dropdown() {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [userEmail, setUserEmail] = React.useState("");
    const { setIslogin ,setInputvalue ,setSlug } = React.useContext(AuthContext);

    const client = new Client().setProject("67fd1d1800257211c340");
    const account = new Account(client);

    const fetchUserEmail = () => {
        account
            .get()
            .then((res) => {
                setUserEmail(res.email);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const logout = () => {
        account
            .deleteSession("current")
            .then(() => {
                console.log("Logged out successfully");
                setIslogin(null);
                setInputvalue({ name: "", email: "" });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    React.useEffect(() => {
        if (isDropdownOpen) {
            fetchUserEmail();
        }
    }, [isDropdownOpen]);

    return (
        <div>
            <div>
                <VscAccount
                    onClick={() => setIsDropdownOpen(true)}
                    className="text-white font-bold text-[25px]"
                />
            </div>
            {isDropdownOpen ? (
                <div className="h-full w-5/10 absolute right-0 top-0 bg-gray-900/50 backdrop-blur-[10px] p-3 flex flex-col justify-between items-center z-20">
                    <div className="w-full flex justify-end p-2">
                        <RxCross2
                            onClick={() => setIsDropdownOpen(false)}
                            className="text-white font-bold text-[20px]"
                        />
                    </div>
                    <div className="text-white h-full text-[15px] font-bold mt-2">
                    {userEmail ? `User Email  ${userEmail}` : "No user logged in"}
                </div>
                    <button
                        onClick={logout}
                        className="bg-amber-500 hover:bg-amber-700 duration-200 py-1 px-4 font-bold text-white"
                    >
                        Logout
                    </button>
                </div>
            ) : null}
        </div>
    );
}

export default Dropdown;
