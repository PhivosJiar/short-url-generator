import React from 'react';

import styles from '@/styles/Shortner.module.scss';

interface ListProps {
  list: string[];
}

function List({ list }: ListProps) {
  return (
    <div className={styles.urlList}>
      {list?.map((listItem: string, index: number) => {
        return <div key={index}>{listItem}</div>;
      })}
    </div>
  );
}

export default List;
