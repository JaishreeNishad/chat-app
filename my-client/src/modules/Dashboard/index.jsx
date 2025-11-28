import React, { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { VscCallOutgoing } from "react-icons/vsc";
import Input from "../../components/Input";
import { FiSend } from "react-icons/fi";
import { LuCirclePlus } from "react-icons/lu";
import { useEffect } from "react";
import { io } from "socket.io-client";

const Dashboard = () => {
  const [conversations, setConversations] = useState([]);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user:detail"))
  );
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState();

  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io("http://localhost:8080"));
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.emit("addUser", user?.id);

    socket.on("getUsers", (users) => {
      console.log("online users:", users);
    });

    socket.on("getMessage", (data) => {
      console.log("message received:", data);

      setMessages((prev) => ({
        ...prev,
        messages: [
          ...(prev?.messages || []),
          {
            user: data.user,
            message: data.message,
          },
        ],
      }));
    });

    return () => {
      socket.off("getUsers");
      socket.off("getMessage");
    };
  }, [socket]);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user:detail"));

    const fetchConversations = async () => {
      const res = await fetch(
        `http://localhost:8000/api/conversations/${loggedInUser?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const resData = await res.json();

      setConversations(resData);
    };
    fetchConversations();
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`http://localhost:8000/api/users/${user?.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resData = await res.json();

      setUsers(resData);
    };
    fetchUsers();
  }, []);

  const fetchMessages = async (conversationId, receiver) => {
    const res = await fetch(
      `http://localhost:8000/api/message/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`,
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const resData = await res.json();
    console.log(resData, "resData");
    setMessages({ messages: resData, receiver, conversationId });
  };

  const sendMessage = async (e) => {
    socket?.emit("sendMessage", {
      senderId: user?.id,
      receiverId: messages?.receiver?.receiverId,
      message,
      conversationId: messages?.conversationId,
    });
    const res = await fetch(`http://localhost:8000/api/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId: messages?.conversationId,
        senderId: user?.id,
        message,
        receiverId: messages?.receiver?.receiverId,
      }),
    });

    setMessage("");
  };
  return (
    <div className="w-screen flex">
      <div className="w-[25%] h-screen border-r border-gray-500 ">
        <div className="flex items-center  gap-4 p-4">
          <FaRegUserCircle size={50} />
          <div className=" flex items-start flex-col">
            <h3 className="font-semibold">{user?.fullName}</h3>
            <p className="text-base">My Account</p>
          </div>
        </div>
        <hr />
        <div className="p-4">
          <h2 className="font-semibold mb-2 text-blue-400 text-start">
            Messages
          </h2>
          <div className="space-y-3">
            {conversations.length > 0 ? (
              conversations.map(({ conversationId, user }) => {
                return (
                  <div
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                    onClick={() => fetchMessages(conversationId, user)}
                  >
                    <img
                      src="https://randomuser.me/api/portraits/women/1.jpg"
                      alt={"name"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <h4 className="font-medium">{user?.fullName}</h4>
                      <p className="text-sm text-gray-500 text-start">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-lg font-semibold mt-24">
                No conversation
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-[50%] h-screen border-r border-gray-500 bg-white flex flex-col items-center">
        {messages?.receiver?.fullName && (
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
                <h3 className="text-base">{messages?.receiver?.fullName}</h3>
                <p className="text-xs">{messages?.receiver?.email}</p>
              </div>
            </div>
            <VscCallOutgoing className="cursor-pointer" />
          </div>
        )}
        <div className="h-[75%]  border-b w-full overflow-y-auto mt-6 ">
          <div className=" px-10 py-4">
            {messages?.messages?.length > 0 ? (
              messages?.messages?.map(({ message, user: { id } = {} }) => {
                return (
                  <div
                    className={`max-w-[40%] rounded-b-xl rounded-tl-xl p-4 mb-6 text-left ${
                      id === user?.id
                        ? "bg-blue-500 ml-auto text-white"
                        : "bg-blue-50"
                    }`}
                  >
                    {message}
                  </div>
                );
              })
            ) : (
              <div className="text-center text-lg font-semibold mt-24">
                No messages or No conversation selected
              </div>
            )}
          </div>
        </div>
        {messages?.receiver?.fullName && (
          <div className="w-full px-10 flex items-center justify-between ">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="my-4  rounded-full shadow-md hover:outline-none outline-none px-5 "
            />
            <div
              className={`ml-5 text-gray-500 mt-3 cursor-pointer ${
                !message && "pointer-events-none"
              }`}
              onClick={() => sendMessage()}
            >
              <FiSend size={20} />
            </div>
            <div
              className={`ml-5 text-gray-500 mt-3 cursor-pointer ${
                !message && "pointer-events-none"
              }`}
            >
              <LuCirclePlus size={20} />
            </div>
          </div>
        )}
      </div>
      <div className="w-[25%] h-screen border-r border-gray-500 ">
        <h2 className="font-semibold mb-2 text-blue-400 text-start px-5 py-16">
          People
        </h2>
        <div className="space-y-3">
          {users.length > 0 ? (
            users.map(({ userId, user }) => {
              return (
                <div
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                  onClick={() => fetchMessages("new", user)}
                >
                  <img
                    src="https://randomuser.me/api/portraits/men/8.jpg"
                    alt={"name"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <h4 className="font-medium text-start">{user?.fullName}</h4>
                    <p className="text-sm text-gray-500 text-start">
                      {user?.email}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-lg font-semibold mt-24">
              No conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
