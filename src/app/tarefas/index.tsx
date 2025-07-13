import { StatusBar } from 'expo-status-bar';
import { 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  FlatList, 
  Alert, 
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles';

const { width } = Dimensions.get('window');

interface Tarefa {
  id: string;
  texto: string;
  concluida: boolean;
  criadaEm: number;
}

const TAREFAS_KEY = '@tarefas';

const TaskItem = ({ item, onToggle, onRemove }: { 
  item: Tarefa; 
  onToggle: (id: string) => void; 
  onRemove: (id: string) => void; 
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRemove = () => {
    Alert.alert(
      'Remover Tarefa',
      'Tem certeza que deseja remover esta tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            Animated.parallel([
              Animated.timing(slideAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: 250,
                useNativeDriver: true,
              }),
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
              }),
            ]).start(() => onRemove(item.id));
          },
        },
      ]
    );
  };

  return (
    <Animated.View
      style={[
        styles.taskContainer,
        {
          transform: [
            { 
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [width, 0],
              })
            },
            { scale: scaleAnim }
          ],
          opacity: fadeAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.taskContent, item.concluida && styles.taskCompleted]}
        onPress={() => onToggle(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.taskHeader}>
          <View style={[styles.checkbox, item.concluida && styles.checkboxCompleted]}>
            {item.concluida && (
              <MaterialIcons name="check" size={16} color="#ffffff" />
            )}
          </View>
          <Text style={[styles.taskText, item.concluida && styles.taskTextCompleted]}>
            {item.texto}
          </Text>
        </View>
        <Text style={styles.taskDate}>
          {new Date(item.criadaEm).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={handleRemove}
        activeOpacity={0.7}
      >
        <MaterialIcons name="delete-outline" size={24} color="#ff6b6b" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function Tarefas() {
  const [conteudo, setConteudo] = useState('');
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const carregarTarefas = async () => {
      try {
        const json = await AsyncStorage.getItem(TAREFAS_KEY);
        if (json) {
          setTarefas(JSON.parse(json));
        }
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarTarefas();
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.stagger(200, [
        Animated.timing(headerAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(formAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading]);

  useEffect(() => {
    if (!loading) {
      const salvarTarefas = async () => {
        try {
          await AsyncStorage.setItem(TAREFAS_KEY, JSON.stringify(tarefas));
        } catch (error) {
          console.error('Erro ao salvar tarefas:', error);
        }
      };

      salvarTarefas();
    }
  }, [tarefas, loading]);

  const adicionarTarefa = () => {
    if (conteudo.trim().length < 3) {
      Alert.alert('Atenção', 'Digite pelo menos 3 caracteres');
      return;
    }

    const novaTarefa: Tarefa = {
      id: Date.now().toString(),
      texto: conteudo.trim(),
      concluida: false,
      criadaEm: Date.now(),
    };

    setTarefas(prevState => [novaTarefa, ...prevState]);
    setConteudo('');
  };

  const removerTarefa = (id: string) => {
    setTarefas(prevState => prevState.filter(tarefa => tarefa.id !== id));
  };

  const toggleTarefa = (id: string) => {
    setTarefas(prevState =>
      prevState.map(tarefa =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
      )
    );
  };

  const tarefasAtivas = tarefas.filter(t => !t.concluida).length;
  const tarefasConcluidas = tarefas.filter(t => t.concluida).length;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: headerAnim,
              transform: [
                {
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.titleContainer}>
            <Image source={require('../../../assets/icon.png')} style={{width: 48, height: 48}} />
            <Text style={styles.title}>Tarefas</Text>
          </View>
          <Text style={styles.subtitle}>Organize suas tarefas com elegância</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{tarefasAtivas}</Text>
              <Text style={styles.statLabel}>Ativas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{tarefasConcluidas}</Text>
              <Text style={styles.statLabel}>Concluídas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{tarefas.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </Animated.View>

        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={tarefas}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TaskItem
              item={item}
              onToggle={toggleTarefa}
              onRemove={removerTarefa}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma tarefa encontrada</Text>
              <Text style={styles.emptySubtext}>
                Adicione uma nova tarefa para começar a organizar seu dia!
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />

        <Animated.View 
          style={[
            styles.form,
            {
              opacity: formAnim,
              transform: [
                {
                  translateY: formAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Digite sua nova tarefa..."
              placeholderTextColor="#888"
              onChangeText={setConteudo}
              value={conteudo}
              multiline
              maxLength={150}
              returnKeyType="done"
              blurOnSubmit={true}
            />
            <View style={styles.inputFooter}>
              <Text style={styles.charCount}>
                {conteudo.length}/150
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.button, !conteudo.trim() && styles.buttonDisabled]}
            onPress={adicionarTarefa}
            disabled={!conteudo.trim()}
            activeOpacity={0.8}
          >
            <MaterialIcons 
              name="add-circle-outline" 
              size={20} 
              color={conteudo.trim() ? '#ffffff' : '#666'} 
            />
            <Text style={[styles.buttonText, !conteudo.trim() && styles.buttonTextDisabled]}>
              Adicionar Tarefa
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}