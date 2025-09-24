import { useEffect, useState } from "react";
import classes from "./ImagePreviewer.module.css";
import Image from "next/image";

function ImagePreviewer({ show, onToggle, image }) {
  const [isImageVeryWide, setIsImageVeryWide] = useState(false);

  useEffect(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const windowAspectRatio = viewportWidth / viewportHeight;
    console.log(`Viewport Aspect Ratio: ${windowAspectRatio}`);

    // Check if the image is very wide compared to the viewport
    const img = document.getElementById("myImg");
    img.onload = function () {
      const ImageAspectRatio = img.naturalWidth / img.naturalHeight;
      console.log(`Aspect Ratio: ${ImageAspectRatio}`);
      setIsImageVeryWide(ImageAspectRatio > windowAspectRatio);
    };
  }, [image]);

  return (
    <>
      <div className={`backdrop ${show ? "active" : ""}`} />
      <div
        className={`${classes.main} ${show ? classes.active : ""} ${
          isImageVeryWide ? classes.wide : ""
        }`}
      >
        <span className={classes.closePreviewer} onClick={onToggle}>
          ×
        </span>
        <Image
          id="myImg"
          src={image}
          alt="image previewer"
          width="10"
          height="10"
        />
      </div>
    </>
  );
}

export default ImagePreviewer;
