import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useNavigate } from "react-router-dom";
const Form = ({ isSignIn = true }) => {
  const [data, setData] = useState({
    ...(!isSignIn && { fullName: "" }),
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:8000/api/${isSignIn ? "login" : "register"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (res.status === 400) {
        alert("Invalid Credential");
      } else {
        const resData = await res.json();
        console.log("data", resData);
        if (resData.token) {
          localStorage.setItem("user:token", resData.token);
          localStorage.setItem("user:detail", JSON.stringify(resData.user));
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white w-[600px] h-[600px] shadow-2xl rounded-lg flex flex-col items-center justify-center">
        <div className="text-4xl font-extrabold">
          Welcome {isSignIn && "Back"}
        </div>
        <div className="text-xl font-light mb-14">
          {isSignIn ? "Sign in to get explore" : "Sign up now to get started"}
        </div>

        {/* Changed from Form to form (lowercase) to avoid conflict */}
        <form
          className="w-1/2 flex flex-col items-center"
          onSubmit={(e) => handleSubmit(e)}
        >
          {!isSignIn && (
            <Input
              label="Full Name"
              name="name"
              placeholder="Enter your name"
              value={data.fullName}
              onChange={(e) => setData({ ...data, fullName: e.target.value })}
            />
          )}
          <Input
            label="Email"
            name="email"
            placeholder="Enter your email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <Input
            label="Password"
            name="password"
            placeholder="Enter your password"
            type="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />

          <Button
            label={isSignIn ? "Sign in" : "Sign up"}
            className="w-full my-3 cursor-pointer"
            type="submit"
          />
        </form>

        <div className="mt-4">
          {isSignIn ? "Didn't have an account?" : "Already have an account?"}
          <span
            className="text-blue-500 cursor-pointer underline ml-1"
            onClick={() =>
              navigate(`/users/${isSignIn ? "sign_up" : "sign_in"}`)
            }
          >
            {isSignIn ? "Sign up" : "Sign in"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Form;
