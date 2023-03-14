import React from 'react';

import styles from '@/styles/Popup.module.scss';

interface ErrorPopupProps {
  title?: string;
  content?: string;
  onConfirmClick: () => void;
}

function ErrorPopup({ title, content, onConfirmClick }: ErrorPopupProps) {
  return (
    <>
      <div className={styles.mask}></div>
      <div className={styles.card}>
        {title && <div className={styles.title}>{title}</div>}
        {content && <div className={styles.content}>{content}</div>}
        <div className={styles.btnContainer}>
          <button className={styles.confirmBtn} onClick={onConfirmClick}>
            OK
          </button>
        </div>
      </div>
    </>
  );
}

export default ErrorPopup;
