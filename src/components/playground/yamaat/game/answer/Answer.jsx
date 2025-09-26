"use client";

import { useContext, useState } from "react";
import classes from "./Answer.module.css";
import Image from "next/image";
import Link from "next/link";

import AudioPlayer from "../../../../general/AudioPlayer";
import VideoPlayer from "../../../../general/VideoPlayer";
import ImagePreviewer from "../../../general/ImagePreviewer";

import PlaygroundContext from "@/store/playground-ctx";

// ✅ الامتدادات المسموح بها للفيديو
const videoExtensions = [".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm", ".mpeg"];

// ✅ الامتدادات المسموح بها للصوت
const audioExtensions = [".mp3", ".wav", ".ogg", ".m4a", ".aac"];

// ✅ دالة للتأكد من أن الرابط فيديو
function isValidVideo(link, type) {
  if (type !== "video") return false;
  const ext = link.split(".").pop().toLowerCase();
  return videoExtensions.includes(`.${ext}`);
}

// ✅ دالة للتأكد من أن الرابط صوت
function isValidAudio(link, type) {
  if (type !== "voice") return false;
  const ext = link.split(".").pop().toLowerCase();
  return audioExtensions.includes(`.${ext}`);
}

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
        <p className={classes.ansText}>{currentQuestion.answer}</p>

        {/* الميديا */}
        {currentQuestion.link_answer_type !== "text" && (
          <div
            className={`${classes.ansMedia} 
              ${isValidVideo(currentQuestion.link_answer, currentQuestion.link_answer_type) ? classes.videoAnsMedia : ""} 
              ${isValidAudio(currentQuestion.link_answer, currentQuestion.link_answer_type) ? classes.audioAnsMedia : ""}`
            }
          >
            {/* صورة */}
            {currentQuestion.link_answer_type === "image" && (
              <Image
                src={currentQuestion.link_answer}
                alt={currentQuestion.answer}
                fill
                onClick={() =>
                  handleToggleImagePreviewer(currentQuestion.link_answer)
                }
              />
            )}

            {/* صوت */}
            {isValidAudio(currentQuestion.link_answer, currentQuestion.link_answer_type) && (
              <AudioPlayer src={currentQuestion.link_answer} />
            )}

            {/* فيديو */}
            {isValidVideo(currentQuestion.link_answer, currentQuestion.link_answer_type) && (
              <VideoPlayer src={currentQuestion.link_answer} />
            )}
          </div>
        )}

        {/* روابط التنقل */}
        <Link
          href="/yamaat-playground/game/who-answered"
          className={classes.whoAnswered}
        >
          منو جاوب ؟
        </Link>
        <Link
          href="/yamaat-playground/game"
          className={classes.returnToQuestion}
        >
          الرجوع للسؤال
        </Link>
      </div>

      {/* معاينة الصور */}
      <ImagePreviewer
        show={isPreviewerVisible}
        onToggle={handleToggleImagePreviewer}
        image={previewerImage}
      />
    </section>
  );
}

export default Answer;
