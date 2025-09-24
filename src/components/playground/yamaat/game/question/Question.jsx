"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import classes from "./Question.module.css";
import Image from "next/image";
import Link from "next/link";
import Score from "../../general/Score";
import NameCat from "../../general/NameCat";
import Counter from "../../general/Counter";
import Issue from "../../../general/Issue";
import AudioPlayer from "../../../../general/AudioPlayer";
import VideoPlayer from "../../../../general/VideoPlayer";
import ImagePreviewer from "../../../general/ImagePreviewer";
import Clue from "../../general/Clue";
import PlaygroundContext from "@/store/playground-ctx";

function Question() {
  const router = useRouter();
  const { currentQuestion, isVertebraeTry } = useContext(PlaygroundContext);
  const [isPreviewerVisible, setIsPreviewerVisible] = useState(false);
  const [previewerImage, setPreviewerImage] = useState("");

  const handleGoToAnswer = () => {
    if (isVertebraeTry) {
      router.push("/yamaat-playground/game/who-answered");
    } else {
      router.push("/yamaat-playground/game/answer");
    }
  };

  const handleToggleImagePreviewer = (image) => {
    setIsPreviewerVisible((prev) => !prev);
    setPreviewerImage(image);
  };

  return (
    <section
      className={`${classes.main} ${
        // isVertebraeTry || currentQuestion.link_type === "text"
        currentQuestion.link_type === "text" ? classes.vertebraeMode : ''
      }`}
    >
      <div className={classes.questionContainer}>
        <p
          className={`${classes.questText} ${
            currentQuestion.link_type === null && classes.questTextOnly
          }`}
        >
          {currentQuestion.question}
        </p>
        {currentQuestion.link_type === "text" ? null : (
          // {isVertebraeTry || currentQuestion.link_type === "text" ? null : (
          <div className={classes.questMedia}>
            {currentQuestion.link_type === "image" ? (
              <Image
                src={currentQuestion.link_question}
                alt={currentQuestion.question}
                fill
                onClick={handleToggleImagePreviewer.bind(
                  this,
                  currentQuestion.link_question
                )}
              />
            ) : null}
            {currentQuestion.link_type === "voice" ? (
              <AudioPlayer src={currentQuestion.link_question} />
            ) : null}
            {currentQuestion.link_type === "video" ? (
              <VideoPlayer src={currentQuestion.link_question} />
            ) : null}
          </div>
        )}

        {/* = = = = = = = Absolutely Positioned Elements = = = = = = =  */}
        <Score className={classes.questPoints}>
          {currentQuestion.points} نقطة {isVertebraeTry ? "(فقرة)" : ""}
        </Score>

        <NameCat className={classes.questPointsLeft}>
          {currentQuestion.category_name}
        </NameCat>
        
        <Clue>
          {currentQuestion.direction?.notes || currentQuestion.notes || ''}''
        </Clue>

        <Issue />
        <span className={classes.questAnswer} onClick={handleGoToAnswer}>
          {isVertebraeTry ? "تخطيتوا الفقرة؟" : "الإجابة"}
        </span>

        <Counter />
      </div>

      <ImagePreviewer
        show={isPreviewerVisible}
        onToggle={handleToggleImagePreviewer}
        image={previewerImage}
      />
    </section>
  );
}

export default Question;
