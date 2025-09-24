"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import classes from "./CatCard.module.css";
import getTimeDifference from "@/utils/get-time-difference";

function CatCard({
  image,
  title,
  description,
  gamesNumber,
  isSmall,
  isMedium,
  isActive,
  isDisabled,
  ranOut,
  endAt,
  isDraft,
  onClick,
}) {
  const [showDraftOverlay, setShowDraftOverlay] = useState(false);
  const [showGameInfo, setShowGameInfo] = useState(false);

  // 🟢 عرض معلومات اللعبة بشكل مؤقت
  const handleShowGameInfo = (e) => {
    e.stopPropagation();
    setShowGameInfo(true);

    const timer = setTimeout(() => {
      setShowGameInfo(false);
    }, 2500);

    return () => clearTimeout(timer);
  };

  // 🟢 لو الكارد Draft → أظهر Overlay عند أول رندر
  useEffect(() => {
    
    if (isDraft) {
      setShowDraftOverlay(true);
      const timer = setTimeout(() => {
        setShowDraftOverlay(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isDraft]);

  // 🟢 الكارد الرئيسي
  return (
    <div
      className={`
        ${classes.main}
        ${isSmall ? classes.small : ""}
        ${isMedium ? classes.medium : ""}
        ${isActive ? classes.active : ""}
        ${isDisabled ? classes.disabled : ""}
        ${ranOut ? classes.ranOut : ""}
        ${showGameInfo ? classes.gameInfoActive : ""}
      `}
      onClick={(e) => {
        if (isDraft) {
          e.stopPropagation();
          setShowDraftOverlay(true);

          setTimeout(() => {
            setShowDraftOverlay(false);
          }, 4500);

          return; // ❌ ماينفذش onClick لو Draft
        }

        onClick?.(); // ✅ ينفذ onClick العادي
      }}
    >
      {/* 🏳️ الفلاج (حصري / مؤقت) */}
      {!isSmall && !isMedium && (
        endAt === null ? (
          <Image
            className={classes.exclusiveFlagVector}
            src={`/vectors/exclusive-category-flag${isDisabled ? "-disabled" : ""}.png`}
            alt={title}
            width={80}
            height={72}
          />
        ) : (
          <Image
            className={classes.temporaryVector}
            src="/vectors/temporary.png"
            alt={title}
            width={80}
            height={72}
          />
        )
      )}

      {/* ⏱️ الوقت المتبقي */}
      {!isSmall && !isMedium && endAt !== null && (
        <span className={classes.remainingCategoryTime}>
          <Image
            src="/vectors/remaining-time-background.png"
            alt="remaining time"
            width={10}
            height={10}
          />
          <span>{getTimeDifference(endAt)}</span>
        </span>
      )}

      {/* ℹ️ أيقونة المعلومات */}
      {!isMedium && (
        <span className={classes.infoIconCont} onClick={handleShowGameInfo}>
          <Image
            className={classes.excMark}
            src="/icons/exclamation-mark.svg"
            alt="exclamation mark"
            width={3}
            height={10}
          />
        </span>
      )}

      {/* 🖼️ الصورة */}
      <div
        className={`${classes.imageContainer} ${
          isDisabled ? classes.disabled : ""
        }`}
      >
        <Image src={image} alt={title} fill />

        {isDraft && showDraftOverlay && (
          <div className={classes.draftOverlay}>تحت التطوير</div>
        )}
      </div>

      {/* 🔲 الإطار */}
      <div
        className={`${classes.imageBorder} ${
          isActive ? classes.active : ""
        }`}
      />

      {/* 🏷️ العنوان */}
      <h4
        className={`${classes.title} ${
          isActive ? classes.active : ""
        } ${isDisabled ? classes.disabled : ""}`}
      >
        {title}
      </h4>

      {/* 🔙 الخلفية والوصف */}
      <div className={classes.cardBack}>
        <p className={classes.description}>
          {description}
          {!isSmall && !isMedium && (
            <span className={classes.remaining}>باقي {gamesNumber} لعبة</span>
          )}
        </p>
      </div>
    </div>
  );
}

export default CatCard;
