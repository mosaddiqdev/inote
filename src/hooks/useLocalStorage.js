import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export function useLocalStorage(key, initialValue) {
  const loadErrorShownRef = useRef(false);
  const saveErrorShownRef = useRef(false);
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      if (!loadErrorShownRef.current) {
        toast.error('We could not load your saved data. Using fresh defaults.');
        loadErrorShownRef.current = true;
      }
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
      if (!saveErrorShownRef.current) {
        toast.error('Saving failed. Free up storage and try again.');
        saveErrorShownRef.current = true;
      }
    }
  }, [key, value]);

  return [value, setValue];
}
