import React, { useEffect, useCallback } from 'react';

const Overlay = ({ document, onClose }) => {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="overlay active" onClick={onClose}>
      <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
        <img src={document.imageurl} alt={document.title} />
      </div>
    </div>
  );
};

export default Overlay;
