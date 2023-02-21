import Link from 'next/link';
import React from 'react';

import DefaultHead from '@/components/defaultHead';
import styles from '@/styles/NotFound.module.scss';

function CustomNotFound() {
  const stars = Array.from({ length: 30 }, (_, index) => index);
  const notFound = '404 Page Not Found.';
  const backToHome = 'back to home';
  return (
    <>
      <DefaultHead />
      <div className={styles.container}>
        <div className={styles.sky}>
          {stars.map((index) => (
            <div key={index} className={styles.star}></div>
          ))}
        </div>

        <div className={styles.textcontainer}>
          <h1>
            {/* 404 not found text */}
            {[...notFound].map((char, index) => (
              <span key={index} className={styles.text}>
                {char.trim() || ' '}
              </span>
            ))}
          </h1>

          {/* back to home text */}
          <Link href="/">
            {[...backToHome].map((char, index) => (
              <span key={index} className={styles.text}>
                {char.trim() || ' '}
              </span>
            ))}
          </Link>
        </div>

        {/* astronaut */}
        <div className={styles.boi}>
          <div className={styles.rightleg}></div>
          <div className={styles.leftleg}></div>
          <div className={styles.backpack}></div>
          <div className={styles.belly}></div>
          <div className={styles.eye}></div>
          <div className={styles.leftleg}></div>
        </div>

        <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg">
          <filter id="inset" x="-50%" y="-50%" width="200%" height="200%">
            <feFlood floodColor="black" result="outside-color" />
            <feMorphology in="SourceAlpha" operator="dilate" radius="3.5" />
            <feComposite
              in="outside-color"
              operator="in"
              result="outside-stroke"
            />
            <feFlood floodColor="#0c9fc4" result="inside-color" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="inside-stroke"
            />
            <feMerge>
              <feMergeNode in="outside-stroke" />
              <feMergeNode in="inside-stroke" />
            </feMerge>
          </filter>
        </svg>
      </div>
    </>
  );
}

export default CustomNotFound;
