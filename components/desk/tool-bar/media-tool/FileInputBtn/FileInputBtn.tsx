import React, { useRef, useImperativeHandle, forwardRef } from 'react';


interface FileInputBtnProps {
    dispatch: <A,P>(action: A, payload: P) => void;
}

/**
 * This component is used to upload an image from the user's computer.
 * It doesn't render anything, but triggers a popup to select a file.
 */
const FileInputBtn = forwardRef<HTMLInputElement , FileInputBtnProps>(
  function FileInputBtn({ dispatch }, ref) {
  
  const localInputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => localInputRef.current as HTMLInputElement);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string; // Data URL
        dispatch<string, string>("providedAnImage", imageSrc);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
      <input
        type="file"
        ref={localInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*"
      />
  );
});

export default FileInputBtn;
