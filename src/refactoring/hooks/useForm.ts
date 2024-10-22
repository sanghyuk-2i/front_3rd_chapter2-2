import { useState } from 'react';

export const useForm = <T extends object>(defaultValues: T) => {
  const [values, setValues] = useState<T>(defaultValues);

  const getValue = <K extends keyof T>(key: K): T[K] => {
    return values[key];
  };

  const setValue = <K extends keyof T>(key: K, value: T[K]) => {
    setValues((prevValues) => ({ ...prevValues, [key]: value }));
  };

  const validateSubmit = (callback: (data: T) => void) => {
    callback(values);
  };

  const reset = () => {
    setValues(defaultValues);
  };

  return { values, getValue, setValue, validateSubmit, reset };
};
