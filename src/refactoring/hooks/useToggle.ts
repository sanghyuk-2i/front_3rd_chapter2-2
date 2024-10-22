import { useState } from 'react';

export const useToggle = () => {
  const [isToggle, setIsToggle] = useState<boolean>(false);

  const toggle = () => {
    setIsToggle((prevToggle) => !prevToggle);
  };

  const turnToggleOn = () => {
    setIsToggle(true);
  };

  const turnToggleOff = () => {
    setIsToggle(true);
  };

  return { isToggle, toggle, turnToggleOn, turnToggleOff };
};
