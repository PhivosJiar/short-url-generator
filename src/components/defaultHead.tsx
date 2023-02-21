import Head from 'next/head';

function DefaultHead() {
  return (
    <>
      <Head>
        <title>短網址產生器</title>
        <meta property="og:image" content="https://i.imgur.com/cFQGVnS.png" />
        <meta property="og:title" content="短網址產生器" />
        <meta
          property="og:description"
          content="輕鬆快速縮短網址，並自訂連結預覽"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
}
export default DefaultHead;
