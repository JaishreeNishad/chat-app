import Input from "../../components/Input";

const Form = () => {
  return (
    <div className="bg-white w-[600px] h-[600px] shadow-2xl rounded-lg flex flex-col items-center justify-center ">
      <div className="text-4xl font-extrabold">Welcome</div>
      <div className="text-xl font-light mb-14">Sign up now to get started</div>
      <div className=" w-full flex justify-center flex-col items-center">
        <Input label="Full Name" name="name" placeholder="Enter your name" />
        <Input label="Email" name="email" placeholder="Enter your email" />
        <Input
          label="Password"
          name="password"
          placeholder="Enter your password"
          type="password"
        />
      </div>
    </div>
  );
};

export default Form;
