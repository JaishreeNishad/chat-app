import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { VscCallOutgoing } from "react-icons/vsc";
import Input from "../../components/Input";
import { FiSend } from "react-icons/fi";
import { LuCirclePlus } from "react-icons/lu";

const Dashboard = () => {
  const contacts = [
    {
      name: "Alice Johnson",
      status: "Online",
      img: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      name: "Michael Brown",
      status: "Offline",
      img: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      name: "Sophia Davis",
      status: "Busy",
      img: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      name: "James Wilson",
      status: "Away",
      img: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
      name: "Olivia Martinez",
      status: "Online",
      img: "https://randomuser.me/api/portraits/women/5.jpg",
    },
    {
      name: "Ethan Taylor",
      status: "Offline",
      img: "https://randomuser.me/api/portraits/men/6.jpg",
    },
    {
      name: "Ava Anderson",
      status: "Busy",
      img: "https://randomuser.me/api/portraits/women/7.jpg",
    },
    {
      name: "Liam Thomas",
      status: "Online",
      img: "https://randomuser.me/api/portraits/men/8.jpg",
    },
  ];

  return (
    <div className="w-screen flex">
      <div className="w-[25%] h-screen border-r border-gray-500 ">
        <div className="flex items-center  gap-4 p-4">
          <FaRegUserCircle size={50} />
          <div className=" flex items-start flex-col">
            <h3 className="font-semibold">Tutorial Dev</h3>
            <p className="text-base">My Account</p>
          </div>
        </div>
        <hr />
        <div className="p-4">
          <h2 className="font-semibold mb-2 text-blue-400 text-start">
            Messages
          </h2>
          <div className="space-y-3">
            {contacts.map(({ name, status, img }, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                <img
                  src={img}
                  alt={name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <h4 className="font-medium">{name}</h4>
                  <p className="text-sm text-gray-500 text-start">{status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-[50%] h-screen border-r border-gray-500 bg-white flex flex-col items-center">
        <div className="w-[75%] bg-blue-50 h-[60px] mt-10 rounded-full flex  items-center justify-between   px-6">
          <div className="flex items-center">
            <div className="flex items-center">
              <img
                src="https://randomuser.me/api/portraits/men/8.jpg"
                alt="Alexander"
                className="w-14 h-14 rounded-full object-cover  border-4 border-white cursor-pointer"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-base">Alexander</h3>
              <p className="text-xs">Online</p>
            </div>
          </div>
          <VscCallOutgoing className="cursor-pointer" />
        </div>
        <div className="h-[75%]  border-b w-full overflow-y-auto mt-6 ">
          <div className=" px-10 py-4">
            <div className="max-w-[40%] bg-blue-50 rounded-b-xl rounded-tl-xl  p-4 mb-6 text-left ">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas
            </div>
            <div className="max-w-[40%] bg-blue-500 rounded-b-xl rounded-tl-xl  p-4 mb-6 ml-auto text-white text-left">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas
            </div>
            <div className="max-w-[40%] bg-blue-50 rounded-b-xl rounded-tl-xl  p-4 mb-6 text-left ">
              Lorem ipsum dolor sit amet
            </div>
            <div className="max-w-[40%] bg-blue-500 rounded-b-xl rounded-tl-xl  p-4 mb-6 ml-auto text-white text-left">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </div>
            <div className="max-w-[40%] bg-blue-50 rounded-b-xl rounded-tl-xl  p-4 mb-6 text-left ">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas
            </div>
            <div className="max-w-[40%] bg-blue-500 rounded-b-xl rounded-tl-xl  p-4 mb-6 ml-auto text-white text-left">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas
            </div>
            <div className="max-w-[40%] bg-blue-50 rounded-b-xl rounded-tl-xl  p-4 mb-6 text-left ">
              Lorem ipsum dolor sit amet
            </div>
            <div className="max-w-[40%] bg-blue-500 rounded-b-xl rounded-tl-xl  p-4 mb-6 ml-auto text-white text-left">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </div>
          </div>
        </div>
        <div className="w-full px-10 flex items-center justify-between ">
          <Input
            placeholder="Type a message..."
            className="my-4  rounded-full shadow-md hover:outline-none outline-none "
          />
          <div className=" ml-5 text-gray-500 mt-3 cursor-pointer">
            <FiSend size={20} />
          </div>
          <div className=" ml-5 text-gray-500 mt-3 cursor-pointer">
            <LuCirclePlus size={20} />
          </div>
        </div>
      </div>
      <div className="w-[25%] h-screen border-r border-gray-500 ">
        <div>
          <img></img>
          <div>
            <h3></h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
