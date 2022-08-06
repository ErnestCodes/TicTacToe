import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  Platform,
  View,
  Pressable,
  Alert,
  SafeAreaView,
  Image,
} from "react-native";
import bg from "../../assets/bg.png";
import { Audio } from "expo-av";
import Cell from "../components/Cell";
import { useDispatch, useSelector } from "react-redux";
import {
  setPlayerOneScore,
  setPlayerTwoScore,
  setReset,
  setResetEasy,
  setResetMedium,
  setTrophyScore,
  setTrophyScoreEasy,
  setTrophyScoreMedium,
} from "../features/score/scoreSlice";

const emptyMap = [
  // defining my 2D grid/matrix
  ["", "", ""], // 1st row
  ["", "", ""], // 2nd row
  ["", "", ""], // 3rd row
];

const copyArray = (original) => {
  const copy = original.map((arr) => {
    return arr.slice();
  });
  return copy;
};

export default function HomeScreen() {
  const [map, setMap] = useState(emptyMap);
  const [gameMode, setGameMode] = useState("BOT_MEDIUM");
  const [gameSetting, setGameSetting] = useState();
  // Local, BOT_EASY, BOT_MEDIUM
  const [currentTurn, setCurrentTurn] = useState("x");
  const [sound, setSound] = useState(null);
  const dispatch = useDispatch();

  const { playerOneScore, playerTwoScore, easyScore, mediumScore } =
    useSelector((state) => state.score);

  useEffect(() => resetGame(), [gameMode]);

  useEffect(() => {
    if (currentTurn == "o" && gameMode !== "LOCAL") {
      // setTimeout(() => botTurn(), 1000);
      botTurn();
    }
  }, [currentTurn, gameMode]);

  useEffect(() => {
    const winner = getWinner(map);
    if (winner) {
      gameWon(winner);
    } else {
      checkTieState();
    }
  }, [map]);

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/sounds/cash.mp3")
    );
    setSound(sound);

    // console.log("Playing Sound");
    await sound.playAsync();
  }

  async function playSoundAww() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/sounds/aww.mp3")
    );
    // setSoundTwo(sound);

    // console.log("Playing Sound");
    await sound.playAsync();
  }

  // useEffect(() => {
  //   return sound
  //     ? () => {
  //         console.log("Unloading Sound");
  //         sound.unloadAsync();
  //       }
  //     : undefined;
  // }, [sound]);

  const onPress = (rowIndex, columnIndex) => {
    // console.warn("hello", rowIndex, columnIndex);
    if (map[rowIndex][columnIndex] !== "") {
      Alert.alert("Position already occupied");
      return;
    }

    setMap((exisitingMap) => {
      const updatedMap = [...exisitingMap];
      updatedMap[rowIndex][columnIndex] = currentTurn;
      return updatedMap;
    });

    setCurrentTurn(currentTurn == "x" ? "o" : "x");
  };

  const getWinner = (winnerMap) => {
    // check rows
    for (let i = 0; i < 3; i++) {
      const isRowXWinning = map[i].every((cell) => cell == "x");
      const isRowOWinning = map[i].every((cell) => cell == "o");

      if (isRowXWinning) {
        return "x";
      }

      if (isRowOWinning) {
        return "o";
      }
    }
    // check colums
    for (let col = 0; col < 3; col++) {
      let isColumnXWinner = true;
      let isColumnYWinner = true;

      for (let row = 0; row < 3; row++) {
        if (winnerMap[row][col] !== "x") {
          isColumnXWinner = false;
        }

        if (winnerMap[row][col] !== "o") {
          isColumnYWinner = false;
        }
      }

      if (isColumnXWinner) {
        return "x";
        break;
      }

      if (isColumnYWinner) {
        return "o";
        break;
      }
    }

    // check diagonals
    let isDiagonal1OWinining = true;
    let isDiagonal1XWinining = true;
    let isDiagonal2OWinining = true;
    let isDiagonal2XWinining = true;
    for (i = 0; i < 3; i++) {
      if (winnerMap[i][i] !== "o") {
        isDiagonal1OWinining = false;
      }

      if (winnerMap[i][i] !== "x") {
        isDiagonal1XWinining = false;
      }
      // length - col - 1 for the column
      if (winnerMap[i][2 - i] !== "o") {
        isDiagonal2OWinining = false;
      }

      if (winnerMap[i][2 - i] !== "x") {
        isDiagonal2XWinining = false;
      }
    }

    if (isDiagonal1OWinining || isDiagonal2OWinining) {
      return "o";
    }
    if (isDiagonal1XWinining || isDiagonal2XWinining) {
      return "x";
    }
  };

  const checkTieState = () => {
    // if no cell contains an empty string
    if (!map.some((row) => row.some((cell) => cell === ""))) {
      Alert.alert(`It's a Tie`, `tie`, [
        {
          text: "Restart",
          onPress: resetGame,
        },
      ]);
    }
  };

  const gameWon = (player) => {
    if (gameMode === "BOT_EASY" && player === "x") {
      dispatch(setTrophyScoreEasy());
      playSound();
    } else if (gameMode === "BOT_EASY" && player !== "x") {
      playSoundAww();
    }

    if (gameMode === "BOT_MEDIUM" && player === "x") {
      playSound();
      dispatch(setTrophyScoreMedium());
    } else if (gameMode === "BOT_MEDIUM" && player !== "x") {
      playSoundAww();
    }

    if (gameMode === "LOCAL" && player === "x") {
      playSound();
      dispatch(setPlayerOneScore());
    } else if (gameMode === "LOCAL" && player !== "x") {
      playSoundAww();
      dispatch(setPlayerTwoScore());
    }

    // Alert.alert(`Hurray`, `Player ${player} won`, [
    //   {
    //     text: "Reset",
    //     onPress: resetGame,
    //   },
    // ]);

    setTimeout(() => resetGame(), 100);
  };

  // reset game
  const resetGame = () => {
    setMap([
      // defining my 2D grid/matrix
      ["", "", ""], // 1st row
      ["", "", ""], // 2nd row
      ["", "", ""], // 3rd row
    ]);
    setCurrentTurn("x");
  };

  const botTurn = () => {
    // select all possible option
    const possiblePositions = [];

    map.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell === "") {
          possiblePositions.push({ row: rowIndex, col: columnIndex });
        }
      });
    });

    let chosenOption;

    if (gameMode === "BOT_MEDIUM") {
      // Attack
      possiblePositions.forEach((possiblePosition) => {
        const mapCopy = copyArray(map);
        mapCopy[possiblePosition.row][possiblePosition.col] = "o";

        const winner = getWinner(mapCopy);
        if (winner === "o") {
          // defend that position
          chosenOption = possiblePosition;
        }
      });

      // Defend
      // Check if the opponents WINS if it takes one of the possible position
      if (!chosenOption) {
        possiblePositions.forEach((possiblePosition) => {
          const mapCopy = copyArray(map);
          mapCopy[possiblePosition.row][possiblePosition.col] = "x";

          const winner = getWinner(mapCopy);
          if (winner === "x") {
            // defend that position
            chosenOption = possiblePosition;
          }
        });
      }
    }

    // resetGame();
    // choose the best option
    if (!chosenOption) {
      chosenOption =
        possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
    }

    if (chosenOption) {
      onPress(chosenOption.row, chosenOption.col);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={bg} style={styles.bg} resizeMode="contain">
        {gameMode == "BOT_EASY" ? (
          <>
            <Pressable
              style={{
                color: "red",
                marginBottom: "auto",
                position: "absolute",
                top: Platform.OS == "android" ? 50 : 30,
                right: 5,
              }}
              onPress={() => dispatch(setResetEasy())}
            >
              <Image
                resizeMode="contain"
                style={{ height: 27 }}
                source={require("../../assets/undo.png")}
              />
            </Pressable>
            <View
              style={{
                color: "#000",
                marginBottom: "auto",
                position: "absolute",
                top: Platform.OS == "android" ? 80 : 85,
                flexDirection: "row",
              }}
            >
              <Image
                style={{
                  width: 28,
                  height: 28,
                  marginTop: Platform.OS == "android" ? 5 : 3,
                  marginRight: 3,
                }}
                source={require("../../assets/trophy.png")}
              />
              <Text style={{ fontSize: 28, fontWeight: "600" }}>
                {easyScore}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: "#fff",
                marginBottom: "auto",
                position: "absolute",
                top: Platform.OS == "android" ? 175 : 160,
              }}
            >
              {/* Current Turn: {currentTurn.toUpperCase()} */}
              Player {currentTurn.toUpperCase()}'s Turn
            </Text>
          </>
        ) : gameMode == "BOT_MEDIUM" ? (
          <>
            <Pressable
              style={{
                color: "red",
                marginBottom: "auto",
                position: "absolute",
                top: Platform.OS == "android" ? 50 : 30,
                right: 5,
              }}
              onPress={() => dispatch(setResetMedium())}
            >
              <Image
                resizeMode="contain"
                style={{ height: 27 }}
                source={require("../../assets/undo.png")}
              />
            </Pressable>
            <View
              style={{
                color: "#000",
                marginBottom: "auto",
                position: "absolute",
                top: Platform.OS == "android" ? 80 : 85,
                flexDirection: "row",
              }}
            >
              <Image
                style={{
                  width: 28,
                  height: 28,
                  marginTop: Platform.OS == "android" ? 5 : 3,
                  marginRight: 3,
                }}
                source={require("../../assets/trophy.png")}
              />
              <Text style={{ fontSize: 28, fontWeight: "600" }}>
                {mediumScore}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: "#fff",
                marginBottom: "auto",
                position: "absolute",
                top: Platform.OS == "android" ? 175 : 160,
              }}
            >
              {/* Current Turn: {currentTurn.toUpperCase()} */}
              Player {currentTurn.toUpperCase()}'s Turn
            </Text>
          </>
        ) : (
          <>
            <Pressable
              style={{
                color: "red",
                marginBottom: "auto",
                position: "absolute",
                top: Platform.OS == "android" ? 50 : 30,
                right: 5,
              }}
              onPress={() => dispatch(setReset())}
            >
              <Image
                resizeMode="contain"
                style={{ height: 27 }}
                source={require("../../assets/undo.png")}
              />
            </Pressable>
            <View
              style={{
                color: "#000",
                marginBottom: "auto",
                position: "absolute",
                top: Platform.OS == "android" ? 80 : 85,
                flexDirection: "row",
              }}
            >
              <Text style={{ fontSize: 28, fontWeight: "600" }}>Score</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                position: "absolute",
                top: Platform.OS == "android" ? 150 : 150,
              }}
            >
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <Text style={{ fontSize: 18, color: "#fff" }}>Player 1</Text>
                <Text
                  style={{ color: "#F54D62", fontSize: 40, fontWeight: "800" }}
                >
                  {playerOneScore}
                </Text>
              </View>
              <View
                style={{
                  borderColor: "#fff",
                  borderWidth: 0.9,
                  height: 30,
                  marginHorizontal: 15,
                }}
              />
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <Text style={{ fontSize: 18, color: "#fff" }}>Player 2</Text>
                <Text
                  style={{ color: "#87E43A", fontSize: 40, fontWeight: "800" }}
                >
                  {playerTwoScore}
                </Text>
              </View>
            </View>
          </>
        )}

        <View style={styles.map}>
          {map.map((row, rowIndex) => (
            // Now we map for each cell in that row
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map((cell, columnIndex) => (
                <Cell
                  key={`row-${rowIndex}-col-${columnIndex}`}
                  cell={cell}
                  onPress={() => onPress(rowIndex, columnIndex)}
                />
              ))}
            </View>
          ))}
        </View>
      </ImageBackground>
      <View
        style={{
          position: "absolute",
          alignItems: "center",
          bottom: 0,
        }}
      >
        <View style={styles.buttons}>
          <Text
            onPress={() => setGameMode("LOCAL")}
            style={[
              styles.button,
              { backgroundColor: gameMode === "LOCAL" ? "#00D2FF" : "#3AB0FF" },
            ]}
          >
            Multiplayer
          </Text>
          <Text
            onPress={() => setGameMode("BOT_EASY")}
            style={[
              styles.button,
              {
                backgroundColor:
                  gameMode === "BOT_EASY" ? "#00D2FF" : "#3AB0FF",
              },
            ]}
          >
            Easy
          </Text>
          <Text
            onPress={() => setGameMode("BOT_MEDIUM")}
            style={[
              styles.button,
              {
                backgroundColor:
                  gameMode === "BOT_MEDIUM" ? "#00D2FF" : "#3AB0FF",
              },
            ]}
          >
            Medium
          </Text>
        </View>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1EA6EA",
    alignItems: "center",
    justifyContent: "center",
  },
  bg: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 63,
  },
  map: {
    width: "80%",
    aspectRatio: 1,
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  buttons: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
  },
  button: {
    color: "white",
    margin: 10,
    fontSize: 16,
    backgroundColor: "#3AB4F2",
    padding: 10,
    borderColor: "red",
    paddingHorizontal: 15,
  },
});
