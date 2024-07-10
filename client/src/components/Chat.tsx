"use client";

import React, { useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import MessageBox from "./MessageBox";
import { useMyStore } from "@/context/ZustandStore";
import { getMessages, sendMessage } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import { toast } from "./ui/use-toast";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL as string;
var socket: Socket;

export default function Chat() {
  const { selectedChat, addMessage, messages, setMessages, setOnlineUsers } =
    useMyStore();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    if (session?.user._id) {
      socket.emit("setup", session?.user);
      socket.on("get-users", (users) => setOnlineUsers(users));
    }
  }, [session?.user._id]);

  useEffect(() => {
    if (selectedChat) {
      socket.emit("join-room", selectedChat._id);
      handleGetMessages();
    }
  }, [selectedChat]);

  useEffect(() => {
    socket.on("receive-message", (newMessage) => {
      // console.log("Message Recieved: ", newMessage);
      if (
        selectedChat?._id === newMessage.chatId &&
        messages.some((message) => message._id !== newMessage._id)
      ) {
        addMessage(newMessage);
      }
    });

    return () => {
      socket.off("receive-message");
    };
  });

  const handleGetMessages = async () => {
    if (session?.user && selectedChat) {
      setLoading(true);
      try {
        const res = await getMessages(selectedChat?._id);

        if (res.success) {
          setMessages(res.messages);
        } else {
          toast({
            title: "Error",
            description: res.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("No user");
    }
  };

  const handleSendMessage = async (message: string) => {
    if (message.length > 0 && session?.user && selectedChat) {
      setLoading(true);
      try {
        const res = await sendMessage(selectedChat?._id, message);

        if (res.success) {
          socket?.emit("send-message", res.newMessage);
          handleGetMessages();
        } else {
          toast({
            title: "Error",
            description: res.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div
        className={`w-full flex flex-col border-r-2 sm:w-2/6 lg:w-[35%] ${
          selectedChat && "max-sm:hidden"
        }`}
      >
        <ChatBox />
      </div>
      <div
        className={`w-full sm:w-4/6 lg:w-[65%] relative overflow-y-auto ${
          !selectedChat && "max-sm:hidden"
        }`}
      >
        {selectedChat ? (
          <MessageBox handleSendMessage={handleSendMessage} loading={loading} />
        ) : (
          <p className="text-center">Select any chat and start chatting</p>
        )}
      </div>
    </>
  );
}
