import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import { useEffect, useState } from 'react';

import { getShortUrl, updateVisits } from '@/api/apiHandle';
import styles from '@/styles/Home.module.scss';
import { Field, ReqUrlPreviewInfo } from '@/type/api';
import { Cache } from '@/utils/cache';

interface Params extends ParsedUrlQuery {
  id: string;
}

const cache = new Cache(4);

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

// Get shortUrlInfo from db
const getShortUrlInfo = async (id: string) => {
  // Get targetUrl
  const axiosResp = await getShortUrl(id).then((res) => res.data as Field);

  const shortUrlInfo = axiosResp.data as ReqUrlPreviewInfo;
  // Put the data into the cache.
  if (shortUrlInfo) cache.put(shortUrlInfo.id, shortUrlInfo);
  return shortUrlInfo;
};

// Handle pre-rendering
export const getStaticProps: GetStaticProps<any> = async (context) => {
  const id = context.params && (context.params as Params).id;

  // Handle id not exist
  if (!id) {
    return {
      notFound: true,
    };
  }

  const cacheValue = cache.get(id);
  // If the target data is not in the cache, query the database.
  const shortUrlInfo = cacheValue || (await getShortUrlInfo(id));

  // Handle short url not exist
  if (!shortUrlInfo) {
    return {
      notFound: true,
    };
  }

  const { title, description, imageUrl, targetUrl } = shortUrlInfo;

  // Render pre-render page
  return {
    props: {
      id,
      title,
      description,
      imageUrl,
      targetUrl,
    },
    revalidate: 1,
  };
};

export default function Home({
  id,
  title,
  description,
  imageUrl,
  targetUrl,
}: ReqUrlPreviewInfo) {
  const [visits, setVisits] = useState(0);
  // go to targetUrl
  const handleClick = () => {
    if (!targetUrl) return;
    location.replace(targetUrl);
  };

  useEffect(() => {
    const fetchData = async () => {
      const newData = await updateVisits(id).then((res) => res.data as Field);
      const newVisits = (newData.data as ReqUrlPreviewInfo).visits;
      if (newVisits) setVisits(newVisits);
    };
    fetchData();
  }, [id]);

  return (
    <>
      <Head>
        <title>{title}</title>
        {/* Set Open Graph Metadata */}
        <meta property="og:image" content={imageUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.card}>
        <span className={styles.url}>
          You are about to go to:<p>{targetUrl}</p>
        </span>

        <button className={styles.btn} onClick={handleClick}>
          &gt;
        </button>

        <span className={styles.visits}>visits: {visits || `fetching...`}</span>
      </div>
    </>
  );
}
