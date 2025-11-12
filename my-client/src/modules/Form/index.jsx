import Button from "../../components/Button";
import Input from "../../components/Input";

const Form = ({ isSignIn = false }) => {
  return (
    <div className="bg-white w-[600px] h-[600px] shadow-2xl rounded-lg flex flex-col items-center justify-center ">
      <div className="text-4xl font-extrabold">
        Welcome {isSignIn && "Back"}
      </div>
      <div className="text-xl font-light mb-14">
        {isSignIn ? "Sign in to get explore" : "Sign up now to get started"}
      </div>
      <div className=" w-full flex justify-center flex-col items-center">
        {!isSignIn && (
          <Input label="Full Name" name="name" placeholder="Enter your name" />
        )}
        <Input label="Email" name="email" placeholder="Enter your email" />
        <Input
          label="Password"
          name="password"
          placeholder="Enter your password"
          type="password"
        />
      </div>
      <Button
        label={isSignIn ? "Sign in" : "Sign up"}
        className="w-1/2 my-3 cursor-pointer"
      />
      <div>
        {isSignIn ? "Didnt have an account" : " Already have an account?"}
        <span className="text-blue-500 cursor-pointer underline">
          {isSignIn ? "Sign up" : "Sign in"}
        </span>
      </div>
    </div>
  );
};

export default Form;
