import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const DropzoneComponent = () => {
  const [files, setFiles] = useState([]);
  const onDrop = useCallback((acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const fileList = files.map((file) => (
    <li key={file.name}>
      <img src={file.preview} alt={file.name} />
      <span>{file.name}</span>
    </li>
  ));

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag and drop your files here, or click to select files</p>
      <ul>{fileList}</ul>
    </div>
  );
};

export default DropzoneComponent;
