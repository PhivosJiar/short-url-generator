export const checkImgUrlIsValid = (imgUrl: string) => {
  return !!isImg(imgUrl);
};

const isImg = (value: string) => {
  const imgUrlPattern = new RegExp(/\w.(png|jpg|jpeg|svg|webp|gif|bmp)$/i);

  return !!imgUrlPattern.test(value);
};
