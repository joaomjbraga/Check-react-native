import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, TouchableOpacity, View, FlatList, Alert } from 'react-native';
import { styles } from './styles';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Tarefa {
  id: string;
  texto: string;
  concluida: boolean;
}

const TAREFAS_KEY = '@tarefas';

export default function Home() {
  const [conteudo, setConteudo] = useState('');
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);

  // Carrega as tarefas salvas no AsyncStorage
  useEffect(() => {
    const carregarTarefas = async () => {
      try {
        const json = await AsyncStorage.getItem(TAREFAS_KEY);
        if (json) {
          setTarefas(JSON.parse(json));
        }
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
      }
    };

    carregarTarefas();
  }, []);

  // Salva sempre que tarefas mudarem
  useEffect(() => {
    const salvarTarefas = async () => {
      try {
        await AsyncStorage.setItem(TAREFAS_KEY, JSON.stringify(tarefas));
      } catch (error) {
        console.error('Erro ao salvar tarefas:', error);
      }
    };

    salvarTarefas();
  }, [tarefas]);

  const adicionarTarefa = () => {
    if (conteudo.trim().length < 3) {
      Alert.alert('Atenção', 'Digite pelo menos 3 caracteres');
      return;
    }

    const novaTarefa: Tarefa = {
      id: Date.now().toString(),
      texto: conteudo.trim(),
      concluida: false,
    };

    setTarefas(prevState => [...prevState, novaTarefa]);
    setConteudo('');
  };

  const removerTarefa = (id: string) => {
    Alert.alert(
      'Remover Tarefa',
      'Tem certeza que deseja remover esta tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => setTarefas(prevState => prevState.filter(tarefa => tarefa.id !== id)),
        },
      ]
    );
  };

  const toggleTarefa = (id: string) => {
    setTarefas(prevState =>
      prevState.map(tarefa =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
      )
    );
  };

  const renderTarefa = ({ item }: { item: Tarefa }) => (
    <View style={styles.taskContainer}>
      <TouchableOpacity
        style={[styles.taskContent, item.concluida && styles.taskCompleted]}
        onPress={() => toggleTarefa(item.id)}
      >
        <Text style={[styles.taskText, item.concluida && styles.taskTextCompleted]}>
          {item.texto}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => removerTarefa(item.id)}>
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#161616' }}>
      <View style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.header}>
          <Text style={styles.title}>Lista de Tarefas</Text>
          <Text style={styles.subtitle}>
            {tarefas.length} {tarefas.length === 1 ? 'tarefa' : 'tarefas'}
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua tarefa aqui..."
            placeholderTextColor="#999"
            onChangeText={setConteudo}
            value={conteudo}
            multiline
            maxLength={100}
          />
          <TouchableOpacity
            style={[styles.button, !conteudo.trim() && styles.buttonDisabled]}
            onPress={adicionarTarefa}
            disabled={!conteudo.trim()}
          >
            <Text style={styles.buttonText}>+ Adicionar</Text>
          </TouchableOpacity>
        </View>

        {tarefas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma tarefa adicionada ainda</Text>
            <Text style={styles.emptySubtext}>Adicione uma tarefa acima para começar</Text>
          </View>
        ) : (
          <FlatList
            data={tarefas}
            keyExtractor={item => item.id}
            renderItem={renderTarefa}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
