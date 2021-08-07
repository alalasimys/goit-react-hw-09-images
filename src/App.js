import React, { useState } from "react";

import "./styles.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import fetchImages from "../src/services/imagesApi";
import Loader from "react-loader-spinner";

import Searchbar from "./components/Searchbar";
import ImageGallery from "./components/ImageGallery";
import ImageGalleryItem from "./components/ImageGalleryItem";
import Button from "./components/Button";
import Modal from "./components/Modal";

export const App = () => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [largeImageURL, setLargeImageURL] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setSearchQuery(e.currentTarget.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetchImages(1, searchQuery)
      .then((response) => {
        if (response.length < 1) {
          setImages([]);
          setSearchQuery("");
          throw new Error("Please try again your request");
        }
        setImages(response);
        setCurrentPage(1);
        setError(null);
      })
      .catch((error) => setError(error.message))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onLoadMore = () => {
    setIsLoading(true);

    fetchImages(currentPage + 1, searchQuery)
      .then((images) => {
        setImages((prevImages) => [...prevImages, ...images]);
        setCurrentPage((prevCurrentPage) => ++prevCurrentPage);
      })
      .catch((error) => setError(error.message))
      .finally(() => {
        setIsLoading(false);

        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      });
  };

  const toggleModal = () => {
    setShowModal((prevShowModal) => !prevShowModal);
  };

  const handleClick = (image) => {
    toggleModal();
    setLargeImageURL(image);
  };

  const renderLoadButton = images.length > 1 && !isLoading;

  return (
    <div>
      <Searchbar
        onChangeQuery={handleChange}
        onSubmit={onSubmit}
        query={searchQuery}
      />

      {error && (
        <h2 style={{ textAlign: "center" }}>Please try again your request</h2>
      )}

      <ImageGallery>
        <ImageGalleryItem images={images} onClick={handleClick} />
      </ImageGallery>

      {isLoading && (
        <Loader
          className="Loader"
          type="Circles"
          color="#471135"
          height={100}
          width={100}
        />
      )}

      {renderLoadButton && <Button onClick={onLoadMore} />}

      {showModal && (
        <Modal onClose={toggleModal}>
          <img src={largeImageURL} alt="" />
        </Modal>
      )}
    </div>
  );
};

export default App;
