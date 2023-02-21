import { useReducer } from 'react';

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

const useInputValidate = (validateValue?: (arg0: any) => boolean) => {
  const [input, dispatch] = useReducer(inputReducer, initialInput);

  // If there is no verification function, it means that no verification is required, directly set valueIsValid to true
  const valueIsValid = validateValue ? validateValue(input.value) : true;
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
