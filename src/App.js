import React, { useState, useEffect } from "react";

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
  // state = {
  //   images: [],
  //   currentPage: 1,
  //   searchQuery: "",
  //   isLoading: false,
  //   error: null,
  //   largeImageURL: "",
  //   showModal: false,
  // };

  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [largeImageURL, setLargeImageURL] = useState("");
  const [showModal, setShowModal] = useState(false);

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.searchQuery !== this.state.searchQuery) {
  //     this.getImages();
  //   }
  // }

  const onChangeQuery = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setImages([]);
    setError(null);
  };

  useEffect(() => {
    setIsLoading(true);

    fetchImages({ currentPage, searchQuery })
      .then((images) => {
        setImages((prevImages) => [...prevImages, ...images]);
        setCurrentPage((prevCurrentPage) => prevCurrentPage + 1);
        if (currentPage > 1) {
          window.scrollTo({
            top: document.querySelector("#imageGallery").scrollHeight,
            behavior: "smooth",
          });
        }
        if (images.length < 1) {
          throw new Error("Please try again your request");
        }
      })
      .catch((error) => setError(error.message))
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchQuery]);

  const toggleModal = () => {
    setShowModal((prevShowModal) => !prevShowModal);
  };

  const handleClick = (image) => {
    toggleModal();
    setLargeImageURL(image);
  };

  const renderLoadButton = images.length > 0 && !isLoading;

  return (
    <div>
      <Searchbar onSubmit={onChangeQuery} />

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

      {renderLoadButton && <Button onClick={() => null} />}

      {showModal && (
        <Modal onClose={toggleModal}>
          <img src={largeImageURL} alt="" />
        </Modal>
      )}
    </div>
  );
};

export default App;
