import "./ImageList.css";
import ImageCard from "./ImageCard";
import React from "react";

const ImageList = (props) => {
  const handleImageClick = (image) => {
    props.onImageClick(image);
  };
  
  const images = props.images.map((image) => {
    return <ImageCard key={image.id} image={image} onImageClick={handleImageClick} />

  });
 
  return <div className="image-list">{images}</div>;
};

export default ImageList; 