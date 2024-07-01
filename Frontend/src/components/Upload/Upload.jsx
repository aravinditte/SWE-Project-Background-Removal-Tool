import React, { useState } from "react";
import "./Upload.css";
import { FaCirclePlus } from "react-icons/fa6";

function Upload({
  removedImage,
  selectedFile,
  setSelectedFile,
  handleUpload
}) {
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="dotted-border">
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {!removedImage && selectedFile && (
        <img
          src={URL.createObjectURL(selectedFile)}
          alt={selectedFile.name}
          style={{ width: "60%", margin: "10px 0px" }}
        />
      )}

      {!removedImage && (
        <button onClick={handleUpload}>
          {!selectedFile && <FaCirclePlus />}
          {selectedFile ? "Remove Background" : "Start from a photo"}
        </button>
      )}

      {!selectedFile && <span>or drop an image here</span>}
      <a>
        {removedImage && (
          <img
            style={{ maxWidth: "100%" }}
            src={`http://localhost:8000${removedImage}`}
          />
        )}{" "}
      </a>
    </div>
  );
}

export default Upload;
