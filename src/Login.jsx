import React from "react";
import { useContext } from "react";
import { AuthContext } from "./Context";
import { RxCross2 } from "react-icons/rx";
import { Client, Account } from "appwrite";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const client = new Client().setProject("67fd1d1800257211c340");
  const account = new Account(client);
  const {
    setIsloginform,
    setIssignupform,
    setIslogin,
    isloginform,
    inputvalue,
    setInputvalue,
    setSlug
  } = useContext(AuthContext);

  const loginsubmit = (e) => {
    const { email, password } = inputvalue;
    e.preventDefault();
    const promise = account.createEmailPasswordSession(email, password);
    promise
      .then((res) => {
        setIsloginform(!isloginform);
        navigate("/home");
        setIslogin("");
        setSlug(res.userId);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-lg flex justify-center items-center z-50">
      <div className="bg-black backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-sm shadow-2xl animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-3xl font-semibold">Login</h2>
          <button
            className="text-white text-2xl hover:text-amber-500 transition"
            onClick={() => setIsloginform(false)}
          >
            <RxCross2 />
          </button>
        </div>
        <form onSubmit={loginsubmit} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email"
            value={inputvalue.email}
            onChange={(e) =>
              setInputvalue({ ...inputvalue, email: e.target.value })
            }
            className="bg-white/20 text-white placeholder-white/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={inputvalue.password}
            onChange={(e) =>
              setInputvalue({ ...inputvalue, password: e.target.value })
            }
            className="bg-white/20 text-white placeholder-white/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-white/70">
          Don't have an account?{" "}
          <span onClick={() =>{
            setIsloginform(false);
            setIssignupform(true);
            setInputvalue({ ...inputvalue, email: "", password: "" });
          }} className="text-amber-400 hover:underline cursor-pointer">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
