import React, { FormEvent, useEffect, useRef, useState } from "react";
import style from "./chat.module.css";
import { AttachCircle, Send } from "iconsax-react";
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
          new Date(Date.now()).getHours().toString().padStart(2, "0") +
          ":" +
          new Date(Date.now()).getMinutes().toString().padStart(2, "0"),
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

  const attachRef = useRef<any>();

  const handleAttachClick = () => {
    console.log(attachRef.current.click());
  };

  return (
    <div className={style.chat_container}>
      <div className={style.chat_header}>
        <h4>{room}</h4>
      </div>
      <div className={style.chat_body}>
        {messageList &&
          messageList.map((item: any, index: number) => (
            <div
              className={`${style.speechContainer} ${
                username === item.author
                  ? style.speechContainerMe
                  : style.speechContainerOther
              } `}
              key={index}
            >
              <div className={style.avatar}>
                <p>{item.author.substring(0, 1).toUpperCase()}</p>
              </div>
              <div
                className={`${
                  username === item.author
                    ? style.speechBubbleMe
                    : style.speechBubbleOther
                } ${style.speechBubble}`}
              >
                <p className={style.authorTitle}>{item.author}</p>
                <p>{item.message}</p>
                <p className={style.time}>{item.time}</p>
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
            {!currentMessage ? (
              <>
                <input
                  style={{ display: "none" }}
                  ref={attachRef}
                  type="file"
                />
                <button
                  onClick={handleAttachClick}
                  type="button"
                  className={`${style.sendButton}`}
                >
                  <AttachCircle size="28" color="#428adf" variant="Bold" />
                </button>
              </>
            ) : (
              <>
                <button type="submit" className={`${style.sendButton}`}>
                  <Send size="28" color="#428adf" variant="Bold" />
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
