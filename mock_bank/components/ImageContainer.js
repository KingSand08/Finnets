import Image from 'next/image';
import React from 'react';

const ImageContainer = ({ srcImg, w = 100, h = w, alt, q = 100 }) => {
  return (
    <div style={{ position: 'relative', width: `${w}px`, height: `${h}px` }}>
      <Image src={srcImg} alt={alt} fill quality={q} />
    </div>
  );
};

export default ImageContainer;
