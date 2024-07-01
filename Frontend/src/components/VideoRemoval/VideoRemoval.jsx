import React, { useState, useRef } from "react";
import "./VideoRemoval.css";
import { MdCancel } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import CircularProgress from "@material-ui/core/CircularProgress"; // Import CircularProgress

function VideoRemoval() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [removedImage, setRemovedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [displayFlag, setDisplayFlag] = useState(true);
  const fileInputRef = useRef(null);

  function handleReset() {
    setSelectedFile(null);
    setRemovedImage(null);
    setDisplayFlag(true);
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      setProcessing(true); 
      setTimeout(() => {
        setProcessing(false);
        setRemovedImage("output.mp4");
        setDisplayFlag(false);
      }, 20000);
    }
  };

  const handleButtonClick = () => {
    if (!selectedFile) {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } else {
      handleUpload();
    }
  };

  return (
    <>
      <div className="remove-wrapper">
        <div className="card-left">
          {removedImage && (
            <div className="icon-container">
              <MdCancel className="remove-icon" onClick={handleReset} />
            </div>
          )}

          <div className="dotted-border">
            <input
              ref={fileInputRef}
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {displayFlag && (
              <button onClick={handleButtonClick}>
                {!selectedFile && <FaCirclePlus />}
                {selectedFile ? "Remove Background" : "Upload the file"}
              </button>
            )}

            {processing && (
              <CircularProgress
                className="progress"
                color="#ffffff"
                size={30}
                thickness={5}
              />
            )}

            {removedImage && !processing && (
              <video style={{ maxWidth: "100%" }} controls>
                <source src={removedImage} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoRemoval;
