import { Tabs } from 'expo-router';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { FontAwesome } from '@expo/vector-icons'

export default function App() {
    return (
        <SafeAreaProvider>
            <Tabs screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#424242',
                },
                tabBarActiveBackgroundColor: '#6c5ce7',
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: '#888'
            }}>
            <Tabs.Screen name='tarefas/index' options={{
                title: 'Tarefas',
                tabBarIcon: ({color}) => <FontAwesome name='calendar' color={color} size={20} />
                }} />
            <Tabs.Screen name='anotacoes/index' options={{
                title: 'Anotações',
                tabBarIcon: ({color}) => <FontAwesome name='sticky-note-o' color={color} size={20} />
                }} />
            <Tabs.Screen name='feedbackScreen' options={{
                title: 'Feedback',
                tabBarIcon: ({color}) => <FontAwesome name='feed' color={color} size={20} />
                }} />
            </Tabs>
        </SafeAreaProvider>
    )
}