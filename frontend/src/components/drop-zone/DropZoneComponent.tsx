import { UploadCloudIcon, X } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller } from "react-hook-form";

interface AcceptedFile extends File {
  preview: string;
}

export default function DropzoneComponent({ control, name }) {
  return (

    <Controller
      control={control}
      name={name}
      render={({ field: { onChange } }) => {
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
            onChange(newAcceptedFiles); // Update the form value
          },
        });
        const removeFile = (fileToRemove) => {
          setAcceptedFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
        };

        const acceptedFileItems = acceptedFiles.map((file, index) => (
          <li key={`${file.path}-${file.lastModified}`} className="flex flex-row gap-2 w-full ustify-between">
            {/* Display image preview */}
            <img src={file.preview} alt={file.name} className="basis 1/3 w-[200px] justify-between" />
            <div className="w-full flex flex-row justify-between">
              <div className="basis-11/12">
                <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <p >{file.path} </p>
              </div>
              <div className=" flex justify-end items-top">
                <X className="hover:cursor-pointer " onClick={() => removeFile(file)} />
              </div>
            </div>
          </li>
        ));

        return (
          <section className="container min-h-[100px] flex justify-center items-center flex-col w-full ">
            <div  {...getRootProps({ className: "dropzone flex justify-center items-center  w-full bg-gray-200 rounded-xl border-red-500 border-dotted h-[100px] hover:cursor-pointer" })}>
              <input {...getInputProps()} />
              <div className="w-full flex justify-center items-center gap-2">
                <UploadCloudIcon />
                <p> Drag 'n' drop some images here, or click to select images</p>
              </div>
            </div>
            <ul className="w-full ">{acceptedFileItems}</ul>
          </section>
        );
      }}
    />
  );
}