import axios from 'axios';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';

import styles from '@/styles/Home.module.scss';
import { Field, ReqUrlPreviewInfo } from '@/type/api';

interface Params extends ParsedUrlQuery {
  shortId: string | string[];
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

// Handle pre-rendering
export const getStaticProps: GetStaticProps<any> = async (context) => {
  const { shortId } = context.params as Params;
  // Get targetUrl
  const axiosResp = await axios
    .get(`${process.env.NEXT_PUBLIC_HOST}/api/get/short-url-info/${shortId}`)
    .then((res) => res.data as Field);

  // Handle shortId not exist
  if (!axiosResp.data) {
    return {
      notFound: true,
    };
  }

  const { title, description, imageUrl, targetUrl } =
    axiosResp.data as ReqUrlPreviewInfo;

  // Render pre-render page
  return { props: { title, description, imageUrl, targetUrl } };
};

export default function Home(props: {
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
}) {
  const { title, description, imageUrl, targetUrl } = props;

  // go to targetUrl
  const handleClick = () => {
    location.replace(targetUrl);
  };

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
      </div>
    </>
  );
}
