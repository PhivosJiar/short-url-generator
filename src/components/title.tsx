import React from 'react';

import styles from '@/styles/Title.module.scss';

interface TitleProps {
  title: string;
}

function Title({ title }: TitleProps) {
  return <div className={styles.container}>{title}</div>;
}

export default Title;
