import React from "react";
import style from "./avatarModal.module.css";
import { Camera } from "iconsax-react";

const AvatarModal = ({ name, setShowAvatarModal }) => {
  return (
    <>
      <div className={style.overlay} />
      <div className={style.avatarModal}>
        <div className={style.imagePlaceholder}>
          {name && <p className={style.name}>{name}</p>}
          <div className={style.uploadBtn}>
            <Camera size="32" color="white" variant="Bold" />
          </div>
        </div>
        <div className={style.modalBtns}>
          <button
            onClick={() => setShowAvatarModal(false)}
            className={style.cancelBtn}
          >
            Cancel
          </button>
          <button
            onClick={() => setShowAvatarModal(false)}
            className={style.saveBtn}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default AvatarModal;
