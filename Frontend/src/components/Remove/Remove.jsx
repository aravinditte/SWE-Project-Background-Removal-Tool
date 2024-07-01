import React, { useState, useEffect } from "react";
import "./Remove.css";
import Upload from "../Upload/Upload";
import ChangeBackground from "../ChangeBackground/ChangeBackground";
import axios from "axios";
import { MdCancel } from "react-icons/md";
import { MdDownloadForOffline } from "react-icons/md";
import CircularProgress from "@material-ui/core/CircularProgress";

function Remove({ tokens, setTokens }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [removedImage, setRemovedImage] = useState(null);
  const [backgroundUrl, setBackgroundUrl] = useState(
    "https://unsplash.com/photos/h0Vxgz5tyXA/download?ixid=M3w1OTUwNjZ8MHwxfHNlYXJjaHwxfHxiYWNrZ3JvdW5kJTIwaW1hZ2VzfGVufDB8fHx8MTcxNDMxNjk4OHww"
  );
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        setLoading(true);
        return config;
      },
      (error) => {
        setLoading(false);
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        setLoading(false);
        return response;
      },
      (error) => {
        setLoading(false);
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);
  const handleImageClick = (image) => {
    console.log("Image clicked:", image);
    setBackgroundUrl(image.links.download);
    handleUpload();
  };

  function decreaseTokens() {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      axios.post("http://127.0.0.1:8000/api/decrease_tokens", {
        user_id: user.email,
      });
      setTokens(tokens - 1);
    } catch (error) {
      console.error("Error fetching available tokens:", error);
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      document.getElementById("fileInput").click();
      return;
    }

    if (tokens <= 0) {
      alert("You have no tokens left!");
      return;
    }

    const formData = new FormData();
    formData.append("original_image", selectedFile);
    formData.append("background_image", backgroundUrl);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/process_file/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        setRemovedImage(data.file_path + `?timestamp=${new Date().getTime()}`);
        console.log("File uploaded successfully:", data.file_path);

        decreaseTokens();
      } else {
        console.error("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  function handleReset() {
    setSelectedFile(null);
    setRemovedImage(null);
  }
  function handleDownload() {
    if (removedImage && selectedFile) {
      const fileName = `removed_file.jpg`;
      const link = document.createElement("a");
      link.href = `http://localhost:8000${removedImage}`;
      link.setAttribute("download", fileName);
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  return (
    <>
      <div className="remove-wrapper">
        <div className="card-left">
          {loading && <CircularProgress className="progress" />}
          {removedImage && (
            <div className="icon-container">
              <MdCancel className="remove-icon" onClick={handleReset} />
              <MdDownloadForOffline
                className="download-icon"
                onClick={handleDownload}
              />
            </div>
          )}

          <Upload
            removedImage={removedImage}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            handleUpload={handleUpload}
          />
        </div>

        {removedImage && (
          // { (
          <div className="card-right">
            <ChangeBackground onImageClick={handleImageClick} />
          </div>
        )}
      </div>
    </>
  );
}

export default Remove;
