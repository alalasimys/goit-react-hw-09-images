import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";

const modalRoot = document.querySelector("#modal-root");

export const Modal = ({ children, onClose }) => {
  // componentDidMount() {
  //   window.addEventListener("keydown", this.handleKeyDown);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener("keydown", this.handleKeyDown);
  // }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  const handleKeyDown = (e) => {
    if (e.code === "Escape") {
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  return createPortal(
    <div className="Overlay" onClick={handleOverlayClick}>
      <div className="Modal">{children}</div>
    </div>,
    modalRoot
  );
};

Modal.propTypes = {
  children: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
