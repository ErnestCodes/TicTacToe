import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Onboarding from "./src/components/Onboarding";
import UseOnboarding from "./src/hooks/useOnboarding";
import HomeScreen from "./src/screens/HomeScreen";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { viewedOnboarding } = UseOnboarding();
  return (
    <>
      {viewedOnboarding ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="HomeScreen"
            component={!viewedOnboarding && HomeScreen}
          />
          <Stack.Screen name="OnboardingScreen" component={Onboarding} />
        </Stack.Navigator>
      )}
    </>
  );
};

export default StackNavigator;
