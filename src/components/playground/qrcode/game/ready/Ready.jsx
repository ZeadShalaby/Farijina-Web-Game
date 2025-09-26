"use client";

import { useContext, useState } from "react";
import classes from "./Ready.module.css";
import Image from "next/image";
import Link from "next/link";

import AudioPlayer from "../../../../general/AudioPlayer";
import VideoPlayer from "../../../../general/VideoPlayer";
import ImagePreviewer from "../../../general/ImagePreviewer";

import PlaygroundContext from "@/store/playground-ctx";
import Counter from "../../general/Counter";

function Answer() {
  const { currentQuestion } = useContext(PlaygroundContext);
  const [isPreviewerVisible, setIsPreviewerVisible] = useState(false);
  const [previewerImage, setPreviewerImage] = useState("");

  const handleToggleImagePreviewer = (image) => {
    setIsPreviewerVisible((prev) => !prev);
    setPreviewerImage(image);
  };

  return (
    <section
      className={`${classes.main} ${
        currentQuestion.link_answer_type === "text" ? classes.center : ""
      }`}
    >
      <div className={classes.ansContainer}>
        {currentQuestion.link_answer_type === "text" ? null : (
          <div className={classes.ansMedia}>
        <Counter />

          </div>
        )}

        {/* = = = = = = = Absolutely Positioned Elements = = = = = = =  */}
        <Link
          href="/qrcode-playground/game/answer"
          className={classes.whoAnswered}
        >
          الإجابة
        </Link>
        <Link
          href="/qrcode-playground/game"
          className={classes.returnToQuestion}
        >
         ⮚ الرجوع للسؤال
        </Link>
      </div>

      <ImagePreviewer
        show={isPreviewerVisible}
        onToggle={handleToggleImagePreviewer}
        image={previewerImage}
      />
    </section>
  );
}

export default Answer;
