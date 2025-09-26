"use client";

import { useEffect, useState, useContext } from "react";
import classes from "./LuckCategory.module.css";
import Image from "next/image";

import splitUniqueArrays from "../split-inactive-scores-array.js";
import PlaygroundContext from "@/store/playground-ctx";

function LuckCategory({ categoryID, image, title, inactiveScores }) {
  const [playedScores, setPlayedScores] = useState([]);
  const { currentGame, getQuestion, setCurrentHorrorScorePositionNumber } =
    useContext(PlaygroundContext);

  useEffect(() => {
    setPlayedScores(inactiveScores);
  }, [inactiveScores]);

  const handleRandomScoreClick = () => {
    // 1. Make a random score from 200, 400, and 600
    const questions = [
      { score: 200, numper: 1 },
      { score: 400, numper: 2 },
      { score: 600, numper: 3 },
      { score: 200, numper: 4 },
      { score: 400, numper: 5 },
      { score: 600, numper: 6 },
    ];
    const quest = questions[Math.floor(Math.random() * questions.length)];

    // 2. Confirm that the score has more answers in this category
    console.log(playedScores);

    if (
      playedScores.some(
        (ps) => ps.points == quest.score && ps.numper == quest.numper
      )
    )
      return handleRandomScoreClick();

    // 3. Setting the current yamaat score position selected
    setCurrentHorrorScorePositionNumber(quest.numper);

    // 4. Fetching the question for the selected category score
    getQuestion(quest.score, categoryID, currentGame.id, "top", quest.numper);
  };

  return (
    <div
      className={`${classes.main} ${
        inactiveScores.length >= 6 ? classes.completed : ""
      }`}
      onClick={handleRandomScoreClick}
    >
      <div className={classes.playsNumberContainer}>
        <Image
          className={classes.gameDiceImage}
          src="/icons/game-dice.svg"
          alt="game dice"
          width="36"
          height="36"
        />
        <span className={classes.playsNumber}>
          {6 - inactiveScores.length}/6
        </span>
        <Image
          className={classes.scoreImage}
          src="/vectors/playground-luck-game-card-score-background.png"
          alt="score"
          width="10"
          height="10"
        />
      </div>

      <div className={classes.imageContainer}>
        <Image
          className={classes.mainCatImage}
          src="/vectors/playground-luck-game-card-background.png"
          alt={title}
          width="10"
          height="10"
        />
        <Image
          className={classes.gameImage}
          src={image}
          alt={title}
          width="10"
          height="10"
        />
      </div>

      <h4 className={classes.title}>{title}</h4>
    </div>
  );
}

export default LuckCategory;
