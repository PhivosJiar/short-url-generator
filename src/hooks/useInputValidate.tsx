import { useEffect, useReducer, useState } from 'react';

// init input state
const initialInput = {
  value: '',
  isTouched: false,
};

const inputReducer = (
  state: { isTouched: boolean; value: any },
  action: { type: any; value: any }
) => {
  switch (action.type) {
    case 'INPUT':
      return { value: action.value, isTouched: state.isTouched };
    case 'BLUR':
      return { value: state.value, isTouched: true };
    case 'RESET':
      return { value: '', isTouched: false };
    default:
      return state;
  }
};

const useInputValidate = (
  validateValue?: (arg0: any) => boolean | Promise<boolean>,
  debounceTime = 500
) => {
  const [input, dispatch] = useReducer(inputReducer, initialInput);
  const [isDebounced, setIsDebounced] = useState(false);
  const [valueIsValid, setValueIsValid] = useState(true);
  const hasError = !valueIsValid && input.isTouched;

  // handle input onChange,update state value
  const onChangeValue = (e: { target: { value: any } }) => {
    dispatch({ type: 'INPUT', value: e.target.value });
  };

  // handle blur,update state isTouched
  const onBlurValue = () => {
    dispatch({
      type: 'BLUR',
      value: '',
    });
  };

  // handle state value reset
  const reset = () => {
    dispatch({
      type: 'RESET',
      value: '',
    });
  };

  // debounce validateValue
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDebounced(true);
    }, debounceTime);

    return () => {
      clearTimeout(timer);
    };
  }, [input.value, debounceTime]);

  useEffect(() => {
    const valid = async () => {
      if (isDebounced && validateValue) {
        setIsDebounced(false);
        setValueIsValid(await validateValue(input.value));
      }
    };
    valid();
  }, [isDebounced, validateValue]);

  return {
    value: input.value,
    isValid: valueIsValid,
    hasError,
    onChangeValue,
    onBlurValue,
    reset,
  };
};

export default useInputValidate;
