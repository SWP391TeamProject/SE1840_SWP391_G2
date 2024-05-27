import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
interface AcceptedFile extends File {
  preview: string;
}
export default function DropzoneComponent(props) {
  const [acceptedFiles, setAcceptedFiles] = useState<AcceptedFile[]>([]); // Explicit typing
  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (newAcceptedFiles) => {
      // Rename to clarify the new files
      setAcceptedFiles((prevAcceptedFiles) => [
        ...prevAcceptedFiles, // Keep the existing files
        ...newAcceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
    },
  });

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li key={file.path}>
      {/* Display image preview */}
      <img src={file.preview} alt={file.name} style={{ maxWidth: "100px" }} />
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some images here, or click to select images</p>
      </div>
      <aside>
        <h4>Accepted files</h4>
        <ul>{acceptedFileItems}</ul>
        <h4>Rejected files</h4>
        {/* <ul>{fileRejectionItems}</ul> */}
      </aside>
    </section>
  );
}
