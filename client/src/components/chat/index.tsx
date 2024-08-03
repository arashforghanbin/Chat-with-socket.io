import React, { FormEvent, useEffect, useState } from "react";
import style from "./chat.module.css";
import { Send } from "iconsax-react";
import useDisconnectionStore from "@/store/useDisconnectionStore";

interface IChat {
  socket: any;
  username: string;
  room: string;
}

const Chat = ({ socket, username, room }: IChat) => {
  const [currentMessage, setCurrentMesssage] = useState("");
  const [messageList, setMessageList] = useState<any>([]);

  const { socketDisconnected } = useDisconnectionStore((state) => state);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (currentMessage) {
      const messageData = {
        room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list: any) => [...list, messageData]);
      setCurrentMesssage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data: any) => {
      setMessageList((list: any) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className={style.chat_container}>
      <div className={style.chat_header}>
        <h4>Live Chat</h4>
      </div>
      <div className={style.chat_body}>
        {messageList &&
          messageList.map((item: any, index: number) => (
            <div
              className={`${
                username === item.author
                  ? style.speechContainerMe
                  : style.speechContainerOther
              }`}
              key={index}
            >
              <div
                className={`${
                  username === item.author
                    ? style.speechBubbleMe
                    : style.speechBubbleOther
                } ${style.speechBubble}`}
              >
                <p>{item.message}</p>
              </div>
            </div>
          ))}
      </div>
      <div className={style.chat_footer}>
        <form onSubmit={sendMessage}>
          <div className={style.inputContainer}>
            <input
              className={style.messageInput}
              type="text"
              value={currentMessage}
              placeholder="message ..."
              onChange={(e) => {
                setCurrentMesssage(e.target.value);
              }}
            />
            <button
              disabled={socketDisconnected}
              type="submit"
              className={`${style.sendButton}`}
            >
              <Send size="28" color="#fff" variant="Bold" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
