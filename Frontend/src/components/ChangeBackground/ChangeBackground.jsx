// ChangeBackground.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageList from './ImageList';
function ChangeBackground(props) {
  const [backgroundImages, setBackgroundImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          'https://api.unsplash.com/search/photos?query=background images&client_id=GO3WbE7Xn5UpoYWyfIR2u6HE2qgkqlM9JRiHuv7C8yM&page=1&per_page=30'
        );
        setBackgroundImages(response.data.results);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const handleImageClick = (image) => {
    props.onImageClick(image);
  };


  return (
    <div className="background-images-container">
      <ImageList images={backgroundImages} onImageClick={handleImageClick} />
    </div>
  );
}

export default ChangeBackground;
