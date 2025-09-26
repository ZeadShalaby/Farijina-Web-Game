"use client";

import { useContext, useState, useEffect } from "react";
import classes from "./WhoAnswered.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";

import PlaygroundContext from "@/store/playground-ctx";
import { getCurrentGame } from "@/utils/local-storage";

function WhoAnswered() {
  const router = useRouter();
  const {
    currentGame,
    currentQuestion,
    currentGameState,
    updateCurrentGameState,
    loadingGame,
    storeQuestionView,
    winAljaleeb,
    turnPlayer,
    isVertebraeTry,
    playingPlayer,
    currentYamaatScorePosition,
    currentHorrorScorePositionNumber,
  } = useContext(PlaygroundContext);

  const getLocaleStorageData = getCurrentGame();
  const isVertebrae = getLocaleStorageData.type_of_game === "vertebrae";

  // Initialize count from localStorage or default to 0
  const [count, setCount] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCount = localStorage.getItem("yamaat-game-count");
      return savedCount ? parseInt(savedCount, 10) : 0;
    }
    return 0;
  });

  // Save count to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("yamaat-game-count", count.toString());
    }
  }, [count]);

  console.log("count", count);
  console.log("isVertebrae", isVertebrae);

  const handleChooseWinner = (e) => {
    const currentGame = { ...currentGameState };

    // 1. Adding the current score to the viewed question points of its category
    const currentGameCategories = [...currentGameState.categories];
    const categoryIndex = currentGameCategories.findIndex(
      (cat) => cat.id === currentQuestion.category_id
    );
    if (categoryIndex !== -1) {
      currentGameCategories[categoryIndex].viewed_question_points.push(
        currentQuestion.points
      );
      currentGameCategories[categoryIndex].viewed_question.push({
        points: currentQuestion.points,
        postion: currentYamaatScorePosition,
        numper: currentHorrorScorePositionNumber,
      });
    }

    updateCurrentGameState("categories", currentGameCategories);

    // 2. Getting the winner team and add the score to him
    const winnerID = e.target.dataset.playerid;
    if (winnerID == 1) {
      updateCurrentGameState(
        "first_player_points",
        currentGame.first_player_points + currentQuestion.points
      );

      // # decrement the opposite player score if the playing player is AL_JALEEB Winner
      winAljaleeb("first_player");
    } else if (winnerID == 2) {
      updateCurrentGameState(
        "second_player_points",
        currentGame.second_player_points + currentQuestion.points
      );

      // # decrement the opposite player score if the playing player is AL_JALEEB Winner
      winAljaleeb("second_player");
    }

    // 3. Calculate the total answered questions
    const totalAnsweredQuestions = currentGame.categories.reduce(
      (answeredQuestionsSum, category) =>
        answeredQuestionsSum + category.viewed_question.length,
      0
    );

    // 4. Mark the current question as ended in the backend
    storeQuestionView();

    // 5. Turn player
    turnPlayer();

    // 6. If all questions are answered, redirect to result page
    // ...existing code...
    // 6. If all questions are answered and vertebrae is integrated, redirect to result page
    // if (totalAnsweredQuestions === 36) {
    //   router.push("/yamaat-playground/result");
    // } else {
    //   router.push("/yamaat-playground");
    // }
    const newCount = count + 1;
    setCount(newCount);

    const isFinished = !isVertebrae
      ? totalAnsweredQuestions === 36
      : count === 39;

    console.log("totalAnsweredQuestions", totalAnsweredQuestions);

    if (isFinished) {
      router.push("/yamaat-playground/result");
    } else {
      router.push("/yamaat-playground");
    }
  };

  const handleDecideVertAnswer = (e) => {
    const currentGame = { ...currentGameState };

    // 1. Add score if the playing player won the vertebrae question try
    const isVertebraeAnswered = e.target.dataset.isanswered;
    if (isVertebraeAnswered == 1) {
      console.log(
        "YES clicked - Adding points to current player: " + playingPlayer
      );
      console.log("Current points: " + currentGame[`${playingPlayer}_points`]);
      console.log("Adding points: " + currentQuestion.points);
      console.log(
        "New total will be: " +
          (currentGame[`${playingPlayer}_points`] + currentQuestion.points)
      );

      updateCurrentGameState(
        `${playingPlayer}_points`,
        currentGame[`${playingPlayer}_points`] + currentQuestion.points
      );

      // # decrement the opposite player score if the playing player is AL_JALEEB Winner
      winAljaleeb(playingPlayer);
    } else {
      console.log(
        "NO clicked - Adding points to opposite player: " + playingPlayer
      );
      console.log("Current points: " + currentGame[`${playingPlayer}_points`]);
      console.log("Adding points: " + currentQuestion.points);
      console.log(
        "New total will be: " +
          (currentGame[`${playingPlayer}_points`] + currentQuestion.points)
      );
      const oppositePlayer =
        playingPlayer === "first_player" ? "second_player" : "first_player";
      updateCurrentGameState(
        `${oppositePlayer}_points`,
        currentGame[`${oppositePlayer}_points`] + currentQuestion.points
      );

      // # decrement the opposite player score if the playing player is AL_JALEEB Winner
      winAljaleeb(oppositePlayer);
    }

    // 2. Mark the current question as ended in the backend
    storeQuestionView();

    // 3. Calculate the total answered questions
    const totalAnsweredQuestions = currentGame.categories.reduce(
      (answeredQuestionsSum, category) =>
        answeredQuestionsSum + category.viewed_question.length,
      0
    );

    // 3. Turn player
    turnPlayer();

    const newCount = count + 1;
    setCount(newCount);

    const isFinished = !isVertebrae
      ? totalAnsweredQuestions === 36
      : count === 39;

    console.log("totalAnsweredQuestions", totalAnsweredQuestions);

    if (isFinished) {
      router.push("/yamaat-playground/result");
    } else {
      router.push("/yamaat-playground");
    }
  };

  return (
    <section
      className={`${classes.main} ${
        isVertebraeTry ? classes.vertebraeMode : ""
      }`}
    >
      <div className={classes.whoAnsedContainer}>
        <p className={classes.whoAnsedText}>
          {isVertebraeTry
            ? "هل الفريق تخطى هذه الفقرة؟"
            : "منو جاوب هذا السؤال؟"}
        </p>
        <div className={classes.whoAnsedOptions}>
          {isVertebraeTry ? (
            <div className={classes.team1Or2Btns}>
              <button
                type="button"
                className={classes.team1Btn}
                data-isanswered="1"
                onClick={handleDecideVertAnswer}
              >
                نعم
              </button>
              <button
                type="button"
                className={classes.team2Btn}
                data-isanswered="0"
                onClick={handleDecideVertAnswer}
              >
                لا
              </button>
            </div>
          ) : (
            <>
              <div className={classes.team1Or2Btns}>
                <button
                  type="button"
                  className={`${classes.team1Btn} ${
                    !loadingGame
                      ? currentGame.first_player.name.length > 10
                        ? classes.limitExc
                        : ""
                      : ""
                  }`}
                  data-playerid="1"
                  onClick={handleChooseWinner}
                >
                  {!loadingGame ? currentGame.first_player.name : ""}
                </button>
                <button
                  type="button"
                  className={`${classes.team2Btn} ${
                    !loadingGame
                      ? currentGame.second_player.name.length > 10
                        ? classes.limitExc
                        : ""
                      : ""
                  }`}
                  data-playerid="2"
                  onClick={handleChooseWinner}
                >
                  {!loadingGame ? currentGame.second_player.name : ""}
                </button>
              </div>
              <button
                type="button"
                className={classes.noOneBtn}
                data-playerid="0"
                onClick={handleChooseWinner}
              >
                ولا أحد
              </button>
            </>
          )}
        </div>

        {/* = = = = = = = Absolutely Positioned Elements = = = = = = =  */}
        <Link
          href={
            isVertebraeTry
              ? "/yamaat-playground/game"
              : "/yamaat-playground/game/answer"
          }
          className={classes.returnToAnswer}
        >
          {isVertebraeTry ? "الرجوع للفقرة" : "الرجوع للجواب"}
        </Link>
      </div>
    </section>
  );
}

export default WhoAnswered;
