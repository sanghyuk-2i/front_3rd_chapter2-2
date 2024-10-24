import { useState } from 'react';

export const useUser = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  return { isAdmin, setIsAdmin };
};
