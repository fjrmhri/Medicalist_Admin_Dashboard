import React from "react";
import styles from "../../styles/Modal.module.css";

const Modal = ({ title, children, isOpen, onClose, onConfirm, confirmLabel }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        <div className={styles.footer}>
          <button className={styles.secondaryButton} onClick={onClose}>
            Batal
          </button>
          <button className={styles.primaryButton} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
