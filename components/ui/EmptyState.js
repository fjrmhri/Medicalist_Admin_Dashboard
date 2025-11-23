import React from "react";
import styles from "../../styles/EmptyState.module.css";

const EmptyState = ({ title, description, actionLabel, onAction }) => (
  // Tampilan fallback ketika daftar data kosong
  <div className={styles.emptyState}>
    <h3>{title}</h3>
    {description && <p>{description}</p>}
    {onAction && (
      <button className={styles.actionButton} onClick={onAction}>
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
