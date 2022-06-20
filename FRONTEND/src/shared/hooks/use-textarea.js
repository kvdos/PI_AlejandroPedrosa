import { useRef, useLayoutEffect } from "react";

const useTextarea = (minHeight, enteredValue) => {
  // ref
  const textareaRef = useRef(null);
  // useLayoutEffect
  useLayoutEffect(() => {
    // Comprobamos que existe el elemento en el DOM
    if (textareaRef.current) {
      // Reseteamos al altura
      textareaRef.current.style.height = "inherit";
      // Definimos la altura
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        minHeight
      )}px`;
    }
  }, [enteredValue, minHeight]);

  return {
    textareaRef,
  };
};

export default useTextarea;
