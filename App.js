import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
} from "react-native";
import bg from "./assets/bg.png";

const emptyMap = [
  // defining my 2D grid/matrix
  ["", "", ""], // 1st row
  ["", "", ""], // 2nd row
  ["", "", ""], // 3rd row
];

export default function App() {
  const [map, setMap] = useState(emptyMap);

  const [currentTurn, setCurrentTurn] = useState("x");

  const onPress = (rowIndex, columnIndex) => {
    console.warn("hello", rowIndex, columnIndex);
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

    checkWinningState();
  };

  const checkWinningState = () => {
    // check rows
    for (let i = 0; i < 3; i++) {
      const isRowXWinning = map[i].every((cell) => cell == "x");
      const isRowOWinning = map[i].every((cell) => cell == "o");

      if (isRowXWinning) {
        gameWon("x");
      }

      if (isRowOWinning) {
        gameWon("o");
      }
    }
    // check colums
    for (let col = 0; col < 3; col++) {
      let isColumnXWinner = true;
      let isColumnYWinner = true;

      for (let row = 0; row < 3; row++) {
        if (map[row][col] !== "x") {
          isColumnXWinner = false;
        }

        if (map[row][col] !== "o") {
          isColumnYWinner = false;
        }
      }

      if (isColumnXWinner) {
        gameWon("x");
        break;
      }

      if (isColumnYWinner) {
        gameWon("o");
        break;
      }
    }

    // check diagonals
    let isDiagonal1OWinining = true;
    let isDiagonal1XWinining = true;
    let isDiagonal2OWinining = true;
    let isDiagonal2XWinining = true;
    for (i = 0; i < 3; i++) {
      if (map[i][i] !== "o") {
        isDiagonal1OWinining = false;
      }

      if (map[i][i] !== "x") {
        isDiagonal1XWinining = false;
      }
      // length - col - 1 for the column
      if (map[i][2 - i] !== "o") {
        isDiagonal2OWinining = false;
      }

      if (map[i][2 - i] !== "x") {
        isDiagonal2XWinining = false;
      }
    }

    if (isDiagonal1OWinining) {
      gameWon("o");
    }
    if (isDiagonal1XWinining) {
      gameWon("x");
    }
    if (isDiagonal2OWinining) {
      gameWon("o");
    }
    if (isDiagonal2XWinining) {
      gameWon("o");
    }
  };

  const gameWon = (player) => {
    Alert.alert(`Hurray`, `Player ${player} won`, [
      {
        text: "Play Again",
        onPress: resetGame,
      },
    ]);
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

  return (
    <View style={styles.container}>
      <ImageBackground source={bg} style={styles.bg} resizeMode="contain">
        <View style={styles.map}>
          {map.map((row, rowIndex) => (
            // Now we map for each cell in that row
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map((cell, columnIndex) => (
                <Pressable
                  key={`row-${rowIndex}-col-${columnIndex}`}
                  onPress={() => onPress(rowIndex, columnIndex)}
                  style={styles.cell}
                >
                  {/* <View style={styles.circle} /> */}
                  {cell == "o" && <View style={styles.circle} />}
                  {cell == "x" && (
                    <View style={styles.cross}>
                      <View style={styles.crossLine} />
                      <View
                        style={[styles.crossLine, styles.crossLineReversed]}
                      />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          ))}

          {/* 
          <View style={styles.cross}>
            <View style={styles.crossLine} />
            <View style={[styles.crossLine, styles.crossLineReversed]} />
          </View> */}
        </View>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
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
  cell: {
    width: 100,
    height: 100,
    flex: 1,
  },
  circle: {
    flex: 1,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    borderWidth: 10,
    borderColor: "#87E43A",
  },
  cross: {
    flex: 1,
  },
  crossLine: {
    position: "absolute",
    left: "48%",
    width: 10,
    height: "100%",
    borderRadius: 5,
    backgroundColor: "#F54D62",
    transform: [
      {
        rotate: "45deg",
      },
    ],
  },
  crossLineReversed: {
    transform: [
      {
        rotate: "-45deg",
      },
    ],
  },
});
