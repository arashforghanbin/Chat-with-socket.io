import { Send } from "iconsax-react";
import Image from "next/image";
import React from "react";
import style from "./uploadImageModal.module.css";

const UploadImageModal = ({
  selectedImage,
  showModal,
  setShowModal,
  imageCaption,
  sendMessage,
  setImageCaption,
}) => {
  return (
    <>
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
    </>
  );
};

export default UploadImageModal;
