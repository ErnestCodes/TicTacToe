import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./StackNavigator";
import { Provider } from "react-redux";
import { store } from "./src/app/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Onboarding from "./src/components/Onboarding";
import { OnboardingProvider } from "./src/hooks/useOnboarding";

export default function App() {
  // const [loading, setLoading] = useState(true);
  // const [viewedOnboarding, setViewedOnboarding] = useState(false);

  // const checkOnboarding = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem("@viewedOnboarding");

  //     if (value !== null) {
  //       setViewedOnboarding(true);
  //     }
  //   } catch (error) {
  //     console.log("Error @checkOnboarding: ", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   checkOnboarding();
  // }, []);
  return (
    <Provider store={store}>
      <NavigationContainer>
        <OnboardingProvider>
          <StackNavigator />
        </OnboardingProvider>
        {/* {viewedOnboarding ? <StackNavigator /> : <Onboarding />} */}
      </NavigationContainer>
    </Provider>
  );
}
