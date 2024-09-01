import React from 'react';

const CustomPrevArrow = ({ className, style, onClick }) => {
  return (
    <button
      type="button"
      className={`${className} slick-prev`}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      ←
    </button>
  );
};

const CustomNextArrow = ({ className, style, onClick }) => {
  return (
    <button
      type="button"
      className={`${className} slick-next`}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      →
    </button>
  );
};

export { CustomPrevArrow, CustomNextArrow };
