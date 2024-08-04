import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import style from "./chat.module.css";
import { AttachCircle, Send } from "iconsax-react";
import Image from "next/image";

interface IChat {
  socket: any;
  username: string;
  room: string;
}

const Chat = ({ socket, username, room }: IChat) => {
  const [currentMessage, setCurrentMesssage] = useState("");
  const [messageList, setMessageList] = useState<any>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [imageCaption, setImageCaption] = useState("");

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (currentMessage || selectedImage) {
      const messageData = {
        room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours().toString().padStart(2, "0") +
          ":" +
          new Date(Date.now()).getMinutes().toString().padStart(2, "0"),
        image: selectedImage ? selectedImage : null,
        imageCaption: imageCaption ? imageCaption : "",
      };

      await socket.emit("send_message", messageData);
      setMessageList((list: any) => [...list, messageData]);
      setCurrentMesssage("");
      setImageCaption("");
      setSelectedImage("");
      setShowModal(false);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data: any) => {
      console.log(data);
      setMessageList((list: any) => [...list, data]);
    });
  }, [socket]);

  const attachRef = useRef<any>();

  const handleAttachClick = () => {
    if (attachRef.current) {
      attachRef.current.click();
    }
  };

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedImage("");
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setSelectedImage(imageDataUrl);
        setShowModal(true);
      };
      reader.readAsDataURL(file);
    }
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
                {item.image && (
                  <>
                    <div className={style.messageBoxImageContainer}>
                      <Image src={item.image} fill objectFit="cover" alt="" />
                    </div>
                    <p>{item.imageCaption}</p>
                  </>
                )}
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
                  onChange={handleChangeFile}
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
      {selectedImage && showModal && (
        <>
          <div onClick={() => setShowModal(false)} className={style.overlay} />
          <div className={style.uploadImageModal}>
            <div className={style.uploadImageModal__imageContainer}>
              {selectedImage && (
                <Image src={selectedImage} alt="" fill objectFit="contain" />
              )}
            </div>
            <div className={style.captionContainer}>
              <input
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Caption..."
                type="text"
              />
              <button onClick={sendMessage} className={`${style.sendButton}`}>
                <Send size="28" color="#428adf" variant="Bold" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
