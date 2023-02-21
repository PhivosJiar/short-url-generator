import React, { useState } from 'react';

import Form from '@/components/form';
import List from '@/components/list';

function Shortner() {
  const [shortUrlList, setShortUrl] = useState(['']);

  // update shortUrlList and re-render
  const handleShortListUpdate = (newShortUrl: string) => {
    setShortUrl([...shortUrlList, newShortUrl]);
  };

  return (
    <>
      <Form handleShortListUpdate={handleShortListUpdate} />
      <List list={shortUrlList} />
    </>
  );
}

export default Shortner;
