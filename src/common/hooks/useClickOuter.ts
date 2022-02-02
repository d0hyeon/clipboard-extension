import { useCallback, useEffect, useState } from 'react';

const useClickOuter = <T extends HTMLElement>(ref: React.MutableRefObject<T | null>) => {
  const [isClick, setIsClick] = useState(false);
  const handleClick = useCallback((e: MouseEvent) => {
    if (Array.isArray(ref)) {
      for (const {current} of ref) {
        if (!current) { return null; }
        if (!!current.contains && current.contains(e.target as Node)) { return null; }
      }
    } else {
      if (!ref.current) { return null; }
      if (ref.current.contains(e.target as Node)) { return null; }
    }
    setIsClick(true);
  }, [ref]);

  useEffect(() => {
    isClick && setIsClick(false);
  }, [isClick]);

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick]);

  return isClick;
};

export default useClickOuter;