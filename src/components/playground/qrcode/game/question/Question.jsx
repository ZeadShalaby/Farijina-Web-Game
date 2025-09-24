"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import classes from "./Question.module.css";
import Score from "../../general/Score";
import NameCat from "../../general/NameCat";
import Issue from "../../../general/Issue";
import ImagePreviewer from "../../../general/ImagePreviewer";
import PlaygroundContext from "@/store/playground-ctx";

function Question() {
  const router = useRouter();
  const { currentQuestion, isVertebraeTry } = useContext(PlaygroundContext);
  const [isPreviewerVisible, setIsPreviewerVisible] = useState(false);
  const [previewerImage, setPreviewerImage] = useState("");

  const handleGoToAnswer = () => {
    if (isVertebraeTry) {
      router.push("/qrcode-playground/game/who-answered");
    } else {
      router.push("/qrcode-playground/game/ready");
    }
  };

  const handleToggleImagePreviewer = (image) => {
    setIsPreviewerVisible((prev) => !prev);
    setPreviewerImage(image);
  };

  const storedQrCode = sessionStorage.getItem("currentQrCode");

  return (
    <section
      className={`${classes.main} ${
        currentQuestion.link_type === "text" ? classes.vertebraeMode : ''
      }`}
    >

      <div className={classes.questionContainer}>
              <span/>

        <p className={classes.questText}>
          اقرأ القوانين عدل.. وبعدها اضغط جاهز
        </p>

        {/* ✅ القوانين الجديدة */}
        <div className={classes.rulesContainer}>
          <div className={classes.qrWrapper}>
            <div className={classes.qrCircle}>
              {storedQrCode ? (
                <img src={storedQrCode} alt="qr code" />
              ) : (
                <p>جاري تحميل الكود...</p>
              )}
            </div>
            <span className={classes.qrLabel}>السؤال</span>
          </div>

          <div className={classes.rulesList}>
            <p>
              <span>1</span> <label>اختر شخص مختلف من فريقك للتمثيل</label>
            </p>
            <p>
              <span>2</span>{' '}
              <label>هذا الشخص هو الوحيد المسموح له بتصوير الباركود</label>
            </p>
            <p>
              <span>3</span>{' '}
              <label>الباركود صالح للاستخدام مرة واحدة فقط لمنع الغش</label>
            </p>
            <p>
              <span>4</span>{' '}
              <label>بعد تصوير الباركود وظهور السؤال اضغط "جاهز"</label>
            </p>
          </div>
        </div>

        <Score className={classes.questPoints}>
          {currentQuestion.points} نقطة {isVertebraeTry ? "(فقرة)" : ''}
        </Score>

        <NameCat className={classes.questPointsLeft}>
          {currentQuestion.category_name}
        </NameCat>

        <Issue />
        <span className={classes.questAnswer} onClick={handleGoToAnswer}>
          {isVertebraeTry ? "تخطيتوا الفقرة؟" : "جاهز"}
        </span>
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
