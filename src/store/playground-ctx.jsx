"use client";

import React, { useState, useEffect, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

import {
  getCurrentGame,
  storeCurrentGame,
  storeCurrentQuestion,
  getCurrentQuestion,
  storeCurrentPlayerRole,
  getCurrentPlayerRole,
} from "../utils/local-storage";
import GeneralContext from "./general-ctx";

const PlaygroundContext = React.createContext({});

export function PlaygroundContextProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { authData } = useContext(GeneralContext);
  const [loadingGame, setLoadingGame] = useState(true);
  const [updatingGame, setUpdatingGame] = useState(false);
  const [currentGame, setCurrentGame] = useState({});
  const [currentYamaatScorePosition, setCurrentYamaatScorePosition] =
    useState("top");
  const [
    currentHorrorScorePositionNumber,
    setCurrentHorrorScorePositionNumber,
  ] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [isVertebraeTry, setIsVertebraeTry] = useState(false);
  const [playingPlayer, setPlayingPlayer] = useState("first_player");
  const [yamaatGameMode, setYamaatGameMode] = useState("yamaat");
  const [currentGameState, setCurrentGameState] = useState({
    categories: [
      { id: 0, viewed_question_points: [], viewed_question: [] },
      { id: 0, viewed_question_points: [], viewed_question: [] },
      { id: 0, viewed_question_points: [], viewed_question: [] },
      { id: 0, viewed_question_points: [], viewed_question: [] },
      { id: 0, viewed_question_points: [], viewed_question: [] },
      { id: 0, viewed_question_points: [], viewed_question: [] },
    ],

    // First player
    first_player_points: 0,
    first_player_al_jleeb: 0,
    first_player_tow_answer: 0,
    first_player_no_answer: 0,
    first_player_vertebrae_one: 0,
    first_player_vertebrae_two: 0,

    // Second player
    second_player_points: 0,
    second_player_al_jleeb: 0,
    second_player_tow_answer: 0,
    second_player_no_answer: 0,
    second_player_vertebrae_one: 0,
    second_player_vertebrae_two: 0,
  });

  useEffect(() => {
    const currGame = getCurrentGame();

    // Get the stored player role for this specific game
    const storedPlayerRole = getCurrentPlayerRole(currGame.id);
    setPlayingPlayer(storedPlayerRole);

    setCurrentGameState((prev) => ({
      categories: currGame.categories.map((category) => {
        return {
          id: category.id,
          viewed_question_points: category.viewed_question_points || [],
          viewed_question: category.viewed_question || [],
        };
      }),

      // First player
      first_player_points: currGame.first_player.points,
      first_player_al_jleeb: currGame.first_player.al_jleeb,
      first_player_tow_answer: currGame.first_player.tow_answer,
      first_player_no_answer: currGame.first_player.no_answer,
      first_player_vertebrae_one:
        currGame.first_player.first_player_vertebrae_one,
      first_player_vertebrae_two:
        currGame.first_player.first_player_vertebrae_two,

      // Second player
      second_player_points: currGame.second_player.points,
      second_player_al_jleeb: currGame.second_player.al_jleeb,
      second_player_tow_answer: currGame.second_player.tow_answer,
      second_player_no_answer: currGame.second_player.no_answer,
      second_player_vertebrae_one:
        currGame.second_player.second_player_vertebrae_one,
      second_player_vertebrae_two:
        currGame.second_player.second_player_vertebrae_two,
    }));
    setCurrentGame(currGame);
    setCurrentQuestion(getCurrentQuestion());
    setYamaatGameMode("qrcode");
    setLoadingGame(false);
  }, []);

  const handleGetQuestion = async (
    points,
    categoryID,
    gameID,
    scorePosition = "top",
    horrorScoreNumber = 1
  ) => {
    if (categoryID === 2) activateVertebraeTry();
    else deactivateVertebraeTry();

    setLoadingGame(true);

    const reqQuery = `points=${points}&category_id=${categoryID}&my_game_id=${gameID}&postion=${scorePosition}&numper=${horrorScoreNumber}`;

    try {
      // أول API -> get-question
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-question?${reqQuery}`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );

      if (response.data.status_code === 200) {
        const question = response.data.data;
        setCurrentQuestion(question);
        storeCurrentQuestion(question);
        // console.log("Current Question:", question);

        // ✅ تاني API -> qrcode-generate بالـ question.id
        try {
          const qrResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/qrcode-generate?question_id=${question.id}`,
            {
              headers: {
                Authorization: `Bearer ${authData.token}`,
              },
            }
          );

          if (
            qrResponse.data.status_code === 200 ||
            qrResponse.data.status === true
          ) {
            // console.log("QR Code:", qrResponse.data.data);

          sessionStorage.setItem('currentQrCode', qrResponse.data.data.qr_code_url);
          
               
          }
        } catch (err) {
          console.error("Error fetching QR Code:", err);
        }

        // ✅ بعد ما جه السؤال و الـ QR Code -> نعمل push
        router.push(
          question.no_words == 1
            ? "/qrcode-playground/game"
            : categoryID != 1
            ? "/yamaat-playground/game"
            : "/roab-playground/game"
        );
      }
    } catch (error) {
      console.error(error);
    }

    setLoadingGame(false);
  };

  // ^ The current state of the currently played game
  const handleUpdateCurrentGameState = (key, value) => {
    // ## Some Filters
    if (value === 2) {
      if (Object.values(currentGameState).includes(value)) {
        return;
      } else if (!key.includes(playingPlayer)) {
        return;
      }
    }

    const newCurrentGameState = { ...currentGameState };
    newCurrentGameState[key] = value;

    // ## Mark the vertebrae game as played
    if (key.includes("_points") && isVertebraeTry) {
      newCurrentGameState[
        currentQuestion.points === 400
          ? `${playingPlayer}_vertebrae_one`
          : `${playingPlayer}_vertebrae_two`
      ] = 1;
    }

    const newCurrentGame = { ...currentGame };

    newCurrentGame.categories = newCurrentGame.categories.map((category) => {
      return {
        ...category,
        viewed_question_points: newCurrentGameState.categories.find(
          (c) => c.id === category.id
        ).viewed_question_points,
        viewed_question: newCurrentGameState.categories.find(
          (c) => c.id === category.id
        ).viewed_question,
      };
    });

    newCurrentGame.first_player = {
      ...newCurrentGame.first_player,
      points: newCurrentGameState.first_player_points,
      al_jleeb: newCurrentGameState.first_player_al_jleeb,
      tow_answer: newCurrentGameState.first_player_tow_answer,
      no_answer: newCurrentGameState.first_player_no_answer,
      first_player_vertebrae_one:
        newCurrentGameState.first_player_vertebrae_one,
      first_player_vertebrae_two:
        newCurrentGameState.first_player_vertebrae_two,
    };

    newCurrentGame.second_player = {
      ...newCurrentGame.second_player,
      points: newCurrentGameState.second_player_points,
      al_jleeb: newCurrentGameState.second_player_al_jleeb,
      tow_answer: newCurrentGameState.second_player_tow_answer,
      no_answer: newCurrentGameState.second_player_no_answer,
      second_player_vertebrae_one:
        newCurrentGameState.second_player_vertebrae_one,
      second_player_vertebrae_two:
        newCurrentGameState.second_player_vertebrae_two,
    };

    setCurrentGameState(newCurrentGameState);
    setCurrentGame(newCurrentGame);
    storeCurrentGame(newCurrentGame);
  };

  const handlewinAljaleeb = (playerAnswered) => {
    if (
      currentGameState[playingPlayer + "_al_jleeb"] !== 2 ||
      playerAnswered !== playingPlayer
    )
      return;

    const newCurrentGameState = { ...currentGameState };
    const newCurrentGame = { ...currentGame };

    let loser =
      playingPlayer === "first_player" ? "second_player" : "first_player";

    newCurrentGameState[loser + "_points"] -= currentQuestion.points;
    newCurrentGame[loser] = {
      ...newCurrentGame[loser],
      points: newCurrentGameState[loser + "_points"],
    };

    newCurrentGameState[playingPlayer + "_points"] += currentQuestion.points;
    newCurrentGame[playingPlayer] = {
      ...newCurrentGame[playingPlayer],
      points: newCurrentGameState[playingPlayer + "_points"],
    };

    // ## Mark the vertebrae game as played
    if (isVertebraeTry) {
      newCurrentGameState[
        currentQuestion.points === 400
          ? `${playingPlayer}_vertebrae_one`
          : `${playingPlayer}_vertebrae_two`
      ] = 1;
    }

    setCurrentGameState(newCurrentGameState);
    setCurrentGame(newCurrentGame);
    storeCurrentGame(newCurrentGame);
  };

  const handleUpdateGameInBackend = async () => {
    setUpdatingGame(true);

    const reqBody = {
      // First player
      first_player_points: currentGameState.first_player_points,
      first_player_al_jleeb: currentGameState.first_player_al_jleeb,
      first_player_tow_answer: currentGameState.first_player_tow_answer,
      first_player_no_answer: currentGameState.first_player_no_answer,
      first_player_vertebrae_one: currentGameState.first_player_vertebrae_one,
      first_player_vertebrae_two: currentGameState.first_player_vertebrae_two,

      // Second player
      second_player_points: currentGameState.second_player_points,
      second_player_al_jleeb: currentGameState.second_player_al_jleeb,
      second_player_tow_answer: currentGameState.second_player_tow_answer,
      second_player_no_answer: currentGameState.second_player_no_answer,
      second_player_vertebrae_one: currentGameState.second_player_vertebrae_one,
      second_player_vertebrae_two: currentGameState.second_player_vertebrae_two,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/games/${currentGame.id}`,
        reqBody,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );
      // if (response.data.status_code === 200) {
      //   console.log(response.data);
      // }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingGame(false);
    }
  };

  const handleStoreQuestionView = async () => {
    // ## Setting the category id based on game type and question type
    let categoryId = currentQuestion.category_id;
    if (currentGame.type_of_game === "horror") categoryId = 1;
    else if (isVertebraeTry) categoryId = 2;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/store-question-view`,
        {
          question_id: currentQuestion.id,
          my_game_id: currentGame.id,
          category_id: categoryId,
          postion: currentYamaatScorePosition,
          numper: currentHorrorScorePositionNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );
    } catch (error) {
      console.log("Error in getQrCodeQuestion:", error);
    }
  };

  const handleTurnPlayer = () => {
    if (
      pathname !== "/yamaat-playground" &&
      pathname !== "/yamaat-playground/game/who-answered" &&
      pathname !== "/roab-playground" &&
      pathname !== "/roab-playground/game/who-answered"
    )
      return;

    setPlayingPlayer((prev) => {
      const newRole =
        prev === "first_player" ? "second_player" : "first_player";
      // Store the new role when it changes
      storeCurrentPlayerRole(currentGame.id, newRole);
      return newRole;
    });
  };

  const activateVertebraeTry = () => {
    setIsVertebraeTry(true);
  };

  const deactivateVertebraeTry = () => {
    setIsVertebraeTry(false);
  };

  const handleSetCurrentYamaatScorePosition = (position) => {
    setCurrentYamaatScorePosition(position);
  };

  const handleSetCurrentHorrorScorePositionNumber = (positionNumber) => {
    setCurrentHorrorScorePositionNumber(positionNumber);
  };

  const context = {
    updatingGame,
    loadingGame,
    currentGame,
    currentQuestion,
    currentGameState,
    playingPlayer,
    yamaatGameMode,
    isVertebraeTry,
    currentYamaatScorePosition,
    currentHorrorScorePositionNumber,
    // * METHODs
    activateVertebraeTry: activateVertebraeTry,
    getQuestion: handleGetQuestion,
    updateCurrentGameState: handleUpdateCurrentGameState,
    updateGameInBackend: handleUpdateGameInBackend,
    storeQuestionView: handleStoreQuestionView,
    turnPlayer: handleTurnPlayer,
    winAljaleeb: handlewinAljaleeb,
    setCurrentYamaatScorePosition: handleSetCurrentYamaatScorePosition,
    setCurrentHorrorScorePositionNumber:
      handleSetCurrentHorrorScorePositionNumber,
  };

  return (
    <PlaygroundContext.Provider value={context}>
      {children}
    </PlaygroundContext.Provider>
  );
}

export default PlaygroundContext;
