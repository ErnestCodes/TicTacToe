import { createContext, useEffect, useState, useContext, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OnboardingContext = createContext({});

export const OnboardingProvider = ({ children }) => {
  const [viewedOnboarding, setViewedOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem("@viewedOnboarding");

        if (value !== null) {
          setViewedOnboarding(true);
        }
      } catch (error) {
        console.log("Error @checkOnboarding: ", error);
      } finally {
        setLoading(false);
      }
    };

    checkOnboarding();
  }, []);

  // for caching when one dependency changes
  // and performance optimization
  const memoedValue = useMemo(
    () => ({
      viewedOnboarding,
      loading,
    }),
    [viewedOnboarding, loading]
  );

  return (
    <OnboardingContext.Provider value={memoedValue}>
      {!loading && children}
    </OnboardingContext.Provider>
  );
};

export default function UseOnboarding() {
  return useContext(OnboardingContext);
}
