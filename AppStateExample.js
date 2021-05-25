/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, { useRef, useState, useEffect } from "react";
import { Alert, AppState, Button, StyleSheet, Text, View } from "react-native";

const AppStateExample = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log("AppState", appState.current);
  };

  const sendAlert = () => {
      console.log("Início!")
      setTimeout(function(){ console.log("Passou 15 segundos!"); }, 15000);
      setTimeout(function(){ console.log("Passou 30 segundos!"); }, 30000);
      setTimeout(function(){ console.log("Passou 45 segundos!"); }, 45000);
      setTimeout(function(){ console.log("Passou 60 segundos!"); }, 30000);
      setTimeout(function(){ Alert.alert("Mudança de estado com 90 segundos!"); }, 30000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>O estado atual é:</Text>
      <Text style={styles.title}>{appStateVisible}</Text>
      <Button
        color="#841584"
        title="Mudando o estado"
        onPress={sendAlert}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#ff0000",
    fontSize: 35,
    marginBottom: 15,
  },
  button: {
    color:"#ff0",
  },
});

export default AppStateExample;


