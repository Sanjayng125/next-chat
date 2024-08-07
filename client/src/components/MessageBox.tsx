"use client";

import { useMyStore } from "@/context/ZustandStore";
import {
  ArrowDown,
  ArrowLeftIcon,
  ArrowUp,
  Loader2,
  SendHorizonal,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ChatProfileModel } from "./ChatProfileModel";

export default function MessageBox({
  handleSendMessage,
  loading,
}: {
  handleSendMessage: (msg: string) => void;
  loading: boolean;
}) {
  const { data: session } = useSession();
  const { setSelectedChat, messages } = useMyStore();
  const [message, setMessage] = useState("");
  const scroll = useRef<HTMLDivElement | null>(null);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  //scroll to bottom
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Header */}
      <div className="w-full h-16 border-b-2 flex items-center p-2 bg-white dark:bg-black sticky top-0">
        <div className="flex items-center">
          <button
            onClick={() => {
              setSelectedChat(null);
            }}
          >
            <ArrowLeftIcon />
          </button>
          <ChatProfileModel />
        </div>
      </div>

      {/* messages */}
      <section className="h-[calc(100%-116px)] text-balance overflow-x-hidden overflow-y-auto">
        <div className="flex flex-col gap-2 py-2 mx-2">
          {messages?.length > 0 &&
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex w-full ${
                  message.sender._id === session?.user._id && "justify-end"
                }`}
                ref={scroll}
              >
                <div className="p-2 rounded-md flex flex-col w-max max-w-[65%] border shadow-md gap-1">
                  {message.sender._id !== session?.user._id && (
                    <div className="flex items-center justify-between text-sm gap-5">
                      <div className="flex items-center gap-2">
                        <Image
                          src={message?.sender?.avatar?.url ?? "/noavatar.png"}
                          alt="DP"
                          width={40}
                          height={40}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <p>{message?.sender?.username}</p>
                      </div>
                      <p className="text-xs">
                        {formatTime(message?.createdAt)}
                      </p>
                    </div>
                  )}
                  <div
                    className={`flex flex-col items-start ${
                      message.sender._id === session?.user._id && "items-end"
                    }`}
                  >
                    <p className="w-full break-words" id={message._id}>
                      {(message.content.length > 100 &&
                        message?.content.slice(0, 100) + "...") ||
                        message.content}
                    </p>
                    {message.content.length > 100 && (
                      <>
                        <button
                          className="hover:underline flex items-center"
                          id={`moreBtn-${message._id}`}
                          onClick={() => {
                            const caption = document.getElementById(
                              message._id
                            );
                            caption?.innerText
                              ? (caption.innerText = message.content)
                              : null;
                            const moreBtn = document.getElementById(
                              `moreBtn-${message._id}`
                            );
                            moreBtn ? (moreBtn.style.display = "none") : null;
                            const lessBtn = document.getElementById(
                              `lessBtn-${message._id}`
                            );
                            lessBtn ? (lessBtn.style.display = "flex") : null;
                          }}
                        >
                          more <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          className="hover:underline items-center hidden"
                          id={`lessBtn-${message._id}`}
                          onClick={() => {
                            const caption = document.getElementById(
                              message._id
                            );
                            caption?.innerText
                              ? (caption.innerText =
                                  message.content.slice(0, 100) + "...")
                              : null;
                            const moreBtn = document.getElementById(
                              `moreBtn-${message._id}`
                            );
                            moreBtn ? (moreBtn.style.display = "flex") : null;
                            const lessBtn = document.getElementById(
                              `lessBtn-${message._id}`
                            );
                            lessBtn ? (lessBtn.style.display = "none") : null;
                          }}
                        >
                          less <ArrowUp className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Input */}
      <div className="w-full h-min bg-white dark:bg-black p-2 pt-0 flex items-center box-border gap-2">
        <Input
          className="flex-1 outline-none focus-visible:ring-0 text-xl"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading && message.length > 0) {
              setMessage("");
              handleSendMessage(message);
            }
          }}
        />
        <Button
          disabled={loading}
          onClick={() => {
            setMessage("");
            handleSendMessage(message);
          }}
        >
          {loading ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <SendHorizonal />
          )}
        </Button>
      </div>
    </>
  );
}
