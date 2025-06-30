import { SafeAreaProvider } from "react-native-safe-area-context"
import Home from "./home";

export default function App() {
    return (
        <SafeAreaProvider>
            <Home />
        </SafeAreaProvider>
    )
}