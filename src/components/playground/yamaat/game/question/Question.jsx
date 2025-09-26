"use client";

import { useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import classes from "./Question.module.css";
import Image from "next/image";
import Score from "../../general/Score";
import NameCat from "../../general/NameCat";
import Counter from "../../general/Counter";
import Issue from "../../../general/Issue";
import AudioPlayer from "../../../../general/AudioPlayer";
import VideoPlayer from "../../../../general/VideoPlayer";
import ImagePreviewer from "../../../general/ImagePreviewer";
import Clue from "../../general/Clue";
import PlaygroundContext from "@/store/playground-ctx";

// ✅ الامتدادات المسموح بها للفيديو
const videoExtensions = [
  ".mp4",
  ".avi",
  ".mov",
  ".wmv",
  ".flv",
  ".webm",
  ".mpeg",
];

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

function Question() {
  const router = useRouter();
  const { currentQuestion, isVertebraeTry } = useContext(PlaygroundContext);

  const [isPreviewerVisible, setIsPreviewerVisible] = useState(false);
  const [previewerImage, setPreviewerImage] = useState("");

  const questRef = useRef(null);

  // ✅ ضبط حجم الخط بحيث النص ما يتعداش 3 سطور
  useEffect(() => {
    const el = questRef.current;
    if (!el) return;

    let fontSize = 22; // الحجم الأساسي
    el.style.fontSize = fontSize + "px";

    const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
    const maxHeight = lineHeight * 3; // 3 سطور بالكتير

    while (el.scrollHeight > maxHeight && fontSize > 12) {
      fontSize -= 1;
      el.style.fontSize = fontSize + "px";
    }
  }, [currentQuestion]);

  // ✅ الذهاب لصفحة الإجابة
  const handleGoToAnswer = () => {
    if (isVertebraeTry) {
      router.push("/yamaat-playground/game/who-answered");
    } else {
      router.push("/yamaat-playground/game/answer");
    }
  };

  // ✅ فتح/إغلاق معاينة الصور
  const handleToggleImagePreviewer = (image) => {
    setIsPreviewerVisible((prev) => !prev);
    setPreviewerImage(image);
  };

  return (
    <section
      className={`${classes.main} ${
        currentQuestion.link_type === "text" ? classes.vertebraeMode : ""
      }`}
    >
      <div className={classes.questionContainer}>
        {/* نص السؤال */}
        <p
          ref={questRef}
          className={`${classes.questText} ${
            currentQuestion.link_type === null && classes.questTextOnly
          }`}
        >
          {currentQuestion.question}
        </p>

        {/* وسائط السؤال */}
        {currentQuestion.link_type !== "text" && (
          <div
            className={`${classes.questMedia} 
              ${
                isValidVideo(
                  currentQuestion.link_question,
                  currentQuestion.link_type
                )
                  ? classes.videoMedia
                  : ""
              } 
              ${
                isValidAudio(
                  currentQuestion.link_question,
                  currentQuestion.link_type
                )
                  ? classes.audioMedia
                  : ""
              }`}
          >
            {/* صورة */}
            {currentQuestion.link_type === "image" && (
              <Image
                src={currentQuestion.link_question}
                alt={currentQuestion.question}
                fill
                onClick={() =>
                  handleToggleImagePreviewer(currentQuestion.link_question)
                }
              />
            )}

            {/* صوت */}
            {isValidAudio(
              currentQuestion.link_question,
              currentQuestion.link_type
            ) && <AudioPlayer src={currentQuestion.link_question} />}

            {/* فيديو */}
            {isValidVideo(
              currentQuestion.link_question,
              currentQuestion.link_type
            ) && <VideoPlayer src={currentQuestion.link_question} />}
          </div>
        )}

        {/* عناصر إضافية */}
        <Score className={classes.questPoints}>
          {currentQuestion.points} نقطة {isVertebraeTry ? "(فقرة)" : ""}
        </Score>

        <NameCat className={classes.questPointsLeft}>
          {currentQuestion.category}
        </NameCat>

        {(currentQuestion.direction || currentQuestion.notes) && (
          <Clue
            type={
              currentQuestion.direction && currentQuestion.direction.length > 0
                ? "direction"
                : "notes"
            }
          >
            {currentQuestion.direction || currentQuestion.notes}
          </Clue>
        )}

        <Issue />

        <span className={classes.questAnswer} onClick={handleGoToAnswer}>
          {isVertebraeTry ? "تخطيتوا الفقرة؟" : "الإجابة"}
        </span>

        <Counter />
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

export default Question;
