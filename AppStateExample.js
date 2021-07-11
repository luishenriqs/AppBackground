/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, { useRef, useState, useEffect, useCallback } from "react";
import { AppState, Button, StyleSheet, Text, View } from "react-native";
import moment from "moment";
/* *****************************************************************************
===> Importe as bibliotecas: 'moment' e 'AppState';
***************************************************************************** */

const AppStateExample = () => {
  const appState = useRef(AppState.currentState);
  const [state, setState] = useState('LOGADO!');
  const [timeToBackground, setTimeToBackground] = useState('');
  const [timeToForeground, setTimeToForeground] = useState('');

  /* ***************************************************************************
  ===> useEffect que adiciona na lib 'AppState' um addEventListener que monitora
  quando o app entra em background e quando ele volta para o primeiro plano; */

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, [_handleAppStateChange]);

  const handleLogIn = () => {
    setState('LOGADO!');
  };
  /* ************************************************************************ */

  let TimeToLogOut;

  /* ***************************************************************************
  ===> Esta função é disparada quando o app entra em background. Ela inicia
  o setTimeout com a contagem de tempo para efetuar o logout; */

  const StartLogOut = useCallback(
    function StartLogOut() {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      TimeToLogOut = setTimeout(function() {
        setState('DESLOGADO!');
      }, 15000);
    }, []
  );
  /* ************************************************************************ */


  /* ***************************************************************************
  ===> A função stopLogOut é chamada pelo useEffect sempre que o app entrar em
  background ou voltar para o primeiro plano. Ela compara e calcula a diferença de
  tempo entre um momento e o outro e seta o valor na variável 'backgroundTime'.*/

  const stopLogOut = useCallback(
    function stopLogOut(initialTime, finalTime) {
      var ms = moment(finalTime,"YYYY-MM-DDTHH:mm:ss").diff(moment(initialTime,"YYYY-MM-DDTHH:mm:ss"));
      var d = moment.duration(ms);
      var backgroundTime = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");

      console.log('==========================================================');
      console.log('### Momento da saída: ', initialTime);
      console.log('### Momento da volta: ', finalTime);
      console.log('### Tempo de duração no background: ', backgroundTime);
      console.log('==========================================================');

      // Aqui isolamos os valores das horas, minutos e segundos da 'backgroundTime';
      let Horas = parseFloat(backgroundTime.slice(0,1));
      let Minutos = parseFloat(backgroundTime.slice(2,4));
      let Segundos = parseFloat(backgroundTime.slice(5,7));

      /*
      ===> Se o tempo em background for menor do que o estabelecido no setTimout
      o processamento entra na condicional interrompe o setTimeout executando o
      'clearTimeout' e NÃO desloga o app. Caso contrário o app é deslogado;
      */
      if (Horas === 0 && Minutos === 0 && Segundos < 15) {
        clearTimeout(TimeToLogOut);
        console.log('=====> NÃO DESLOGA, passou apenas ', Segundos, 'segundos');
        return;
      }
      console.log('=====> DESLOGA, ja passou ', Segundos, 'segundos');
    }, [TimeToLogOut]
  );
  /* ************************************************************************ */

  /* ***************************************************************************
  ===> Monitora as variáveis de momento de entrada e de saída do app em
  background e chama a função 'stopLogOut'; */

  useEffect(() => {
    const initialTime = timeToBackground;
    const finalTime = timeToForeground;
    stopLogOut(initialTime, finalTime);
  }, [timeToForeground, timeToBackground, stopLogOut]);
  /* ************************************************************************ */


  /* ***************************************************************************
  Esta função é um listener que é disparado toda vez que o app entra em
  backgroud e quando ele volta para o primeiro plano; */

  const _handleAppStateChange = useCallback(
    function _handleAppStateChange(nextAppState) {
      /* ***********************************************************************
      ===> Quando o app entra em background captura o momento da saída e chama
      a função 'StartLogOut' que é a responsável por disparar o setTimeout;
      *********************************************************************** */
      if (
        appState.current.match(/active|foreground/) &&
        nextAppState === "background"
      ) {
        let out = moment().format();
        setTimeToBackground(out);
        StartLogOut();
      }

      /* ***********************************************************************
      ===> Quando o app volta para o primeiro plano captura o momento da
      volta;
      *********************************************************************** */
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        let into = moment().format();
        setTimeToForeground(into);
      }

      appState.current = nextAppState;
    }, [StartLogOut]
  );
  /* ************************************************************************ */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Você está</Text>
      <Text style={styles.state}>{state}</Text>
      <Button
        color="#fd151b"
        title="Logar"
        onPress={() => handleLogIn()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#01295f",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#ffb30f",
    fontSize: 35,
    marginBottom: 15,
  },
  state: {
    color: "#ffb30b",
    fontWeight: 'bold',
    fontSize: 50,
    marginBottom: 15,
  },
});

export default AppStateExample;


