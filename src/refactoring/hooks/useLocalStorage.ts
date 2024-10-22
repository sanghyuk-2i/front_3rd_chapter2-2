export const useLocalStorage = () => {
  const getStorage = (key: string) => {
    const jsonContent = localStorage.getItem(key);
    if (!jsonContent) return;

    return JSON.parse(jsonContent);
  };

  const updateStorage = (key: string, value: object | string | number) => {
    const jsonContent = JSON.stringify(value);

    localStorage.setItem(key, jsonContent);
  };

  const deleteStorage = (key: string) => {
    localStorage.removeItem(key);
  };

  const clearStorage = () => {
    localStorage.clear();
  };

  return { getStorage, updateStorage, deleteStorage, clearStorage };
};
