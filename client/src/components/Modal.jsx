import React from "react";
import styles from "./styles/Modal.module.css";

const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          &times;
        </button>
        <div>{children}</div>
      </div>
    </>
  );
};

export default Modal;
