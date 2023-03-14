import React from 'react';

import styles from '@/styles/Popup.module.scss';

function LoadingPopup() {
  return (
    <>
      <div className={styles.mask}></div>
      <div className={styles.card}>
        <div className={styles.loader}></div>
        <div className={styles.text}>loading...</div>
      </div>
    </>
  );
}

export default LoadingPopup;
