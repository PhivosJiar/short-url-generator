import React, { useState } from 'react';

import { createShortUrl, verifyUrl } from '@/api/apiHandle';
import useInputValidate from '@/hooks/useInputValidate';
import styles from '@/styles/Shortner.module.scss';
import type { Field, RspShortUrl } from '@/type/api';
import { checkUrlIsValid } from '@/utils/checkIsValid';
import { formatUrl } from '@/utils/formatUrl';

import ErrorPopup from './popup/errorPopup';
import LoadingPopup from './popup/loadingPopup';

interface FormProps {
  handleShortListUpdate: (newShortUrl: string) => void;
}

function Form({ handleShortListUpdate }: FormProps) {
  // hdndle loading status
  const [isLoading, setIsLoading] = useState(false);
  // handle error status
  const [hasError, setHasError] = useState(false);
  // handle url verifying
  const [isVerifying, setIsVerifying] = useState(false);
  // verify url is valid
  const isValidUrl = async (url: string): Promise<boolean> => {
    if (!checkUrlIsValid(url, 'url')) return false;

    try {
      // Send a request to verify the URL's availability.
      setIsVerifying(true);
      const targetUrl = formatUrl(url);
      await verifyUrl(targetUrl);
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  // verify imgUrl is valid
  const isValidImg = (value: string): boolean => {
    // Since it is an optional item, a value must be present for it to be checked.
    return !value.trim() || checkUrlIsValid(value, 'img');
  };

  // title
  const {
    value: title,
    isValid: titleIsValid,
    onChangeValue: onChangeTitle,
    onBlurValue: onBlurTitle,
    reset: resetTitle,
  } = useInputValidate();

  // description
  const {
    value: description,
    isValid: descriptionIsValid,
    onChangeValue: onChangeDescription,
    onBlurValue: onBlurDescription,
    reset: resetDescription,
  } = useInputValidate();

  // imageUrl
  const {
    value: imageUrl,
    isValid: imageUrlIsValid,
    hasError: imgUrlError,
    onChangeValue: onChangeImageUrl,
    onBlurValue: onBlurImageUrl,
    reset: resetImageUrl,
  } = useInputValidate(isValidImg);

  // targetUrl
  const {
    value: targetUrl,
    isValid: targetUrlIsValid,
    hasError: targetUrlError,
    onChangeValue: onChangeTargetUrl,
    onBlurValue: onBlurTargetUrl,
    reset: resetTargetUrl,
  } = useInputValidate(isValidUrl);

  // handleFormSubmit
  const onFormSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);

    if (!targetUrlIsValid) {
      return;
    }

    try {
      // generate short url
      const shortUrl = await generateShortUrl({
        title,
        description,
        imageUrl,
        targetUrl,
      });

      // update shortUrlList and re-render
      handleShortListUpdate(shortUrl);
      // reset
      resetTitle();
      resetDescription();
      resetImageUrl();
      resetTargetUrl();
    } catch (error) {
      setHasError(true);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // generate short url
  const generateShortUrl = async (props: {
    title: string | undefined | null;
    description: string | undefined | null;
    imageUrl: string | undefined | null;
    targetUrl: string | undefined | null;
  }) => {
    try {
      const axiosResp = await createShortUrl(props).then(
        (res) => res.data as Field
      );
      const { shortUrl } = axiosResp.data as RspShortUrl;
      return shortUrl;
    } catch (error) {
      throw new Error(`${(error as Error).message}`);
    }
  };

  // handle popup confirm btn click
  const handleErrorPopupClose = () => {
    setHasError(false);
  };

  // handle input error class
  const targetUrlInputClasses = targetUrlError ? styles.error : styles.input;

  return (
    <>
      <form onSubmit={onFormSubmit} className={styles.form}>
        <div className={styles.subForm}>
          <h3>Redirect target url(required):</h3>
          <div className={styles.subContent}>
            <div>
              <label htmlFor="targetUrl">targetUrl: </label>
              <input
                type="targetUrl"
                id="targetUrl"
                onChange={onChangeTargetUrl}
                onBlur={onBlurTargetUrl}
                value={targetUrl}
                className={targetUrlInputClasses}
              />
            </div>

            {targetUrlError && !isVerifying && (
              <p className={styles.hint}>Please enter a valid url.</p>
            )}
            {isVerifying && <p className={styles.hint}>Verifying...</p>}
          </div>
        </div>

        <div className={styles.subForm}>
          <h3>Adjust link preview:</h3>
          <div className={styles.subContent}>
            <div>
              <label htmlFor="title">title: </label>
              <input
                type="title"
                id="title"
                onChange={onChangeTitle}
                onBlur={onBlurTitle}
                value={title}
                className={styles.input}
              />
            </div>
            <div>
              <label htmlFor="description">description: </label>
              <input
                type="description"
                id="description"
                onChange={onChangeDescription}
                onBlur={onBlurDescription}
                value={description}
                className={styles.input}
              />
            </div>
            <div>
              <label htmlFor="imageUrl">imageUrl: </label>
              <input
                type="imageUrl"
                id="imageUrl"
                onChange={onChangeImageUrl}
                onBlur={onBlurImageUrl}
                value={imageUrl}
                className={styles.input}
              />
            </div>
            {imgUrlError && (
              <p className={styles.hint}>Please enter a valid image url.</p>
            )}
          </div>
        </div>
        <button
          disabled={
            !titleIsValid ||
            !descriptionIsValid ||
            !targetUrlIsValid ||
            !imageUrlIsValid
          }
        >
          Submit
        </button>
      </form>
      {/* loading popup */}
      {isLoading && <LoadingPopup />}
      {/* error popup */}
      {hasError && (
        <ErrorPopup
          title="Error"
          content="Please check your network and try again."
          onConfirmClick={handleErrorPopupClose}
        />
      )}
    </>
  );
}

export default Form;
