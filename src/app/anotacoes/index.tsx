import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaces
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  color: string;
}

// Cores disponíveis para as notas
const NOTE_COLORS = [
  '#1c1c1c', // Padrão (escuro)
  '#2a1f1f', // Vermelho escuro
  '#1a2a22', // Verde escuro
  '#1f2a2a', // Azul escuro
  '#2a2a1f', // Amarelo escuro
  '#2a1f2a', // Roxo escuro
];

const NotesApp: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editColor, setEditColor] = useState(NOTE_COLORS[0]);

  // Carregar notas do AsyncStorage
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
    }
  };

  const saveNotes = async (notesToSave: Note[]) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(notesToSave));
    } catch (error) {
      console.error('Erro ao salvar notas:', error);
    }
  };

  const createNote = () => {
    if (newTitle.trim() === '' && newContent.trim() === '') {
      Alert.alert('Erro', 'Adicione um título ou conteúdo para a nota');
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      content: newContent.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color: selectedColor,
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);

    // Limpar formulário
    setNewTitle('');
    setNewContent('');
    setSelectedColor(NOTE_COLORS[0]);
    setIsCreating(false);
  };

  const openNote = (note: Note) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditColor(note.color);
  };

  const closeNote = () => {
    setSelectedNote(null);
    setIsEditing(false);
    setEditTitle('');
    setEditContent('');
    setEditColor(NOTE_COLORS[0]);
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const saveEdit = () => {
    if (!selectedNote) return;

    if (editTitle.trim() === '' && editContent.trim() === '') {
      Alert.alert('Erro', 'Adicione um título ou conteúdo para a nota');
      return;
    }

    const updatedNote: Note = {
      ...selectedNote,
      title: editTitle.trim(),
      content: editContent.trim(),
      color: editColor,
      updatedAt: new Date().toISOString(),
    };

    const updatedNotes = notes.map(note => 
      note.id === selectedNote.id ? updatedNote : note
    );

    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setIsEditing(false);
    setSelectedNote(updatedNote);
  };

  const cancelEdit = () => {
    if (!selectedNote) return;
    
    setEditTitle(selectedNote.title);
    setEditContent(selectedNote.content);
    setEditColor(selectedNote.color);
    setIsEditing(false);
  };

  const deleteNote = (id: string) => {
    Alert.alert(
      'Excluir Nota',
      'Tem certeza que deseja excluir esta nota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            const updatedNotes = notes.filter(note => note.id !== id);
            setNotes(updatedNotes);
            saveNotes(updatedNotes);
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  const renderNote = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={[styles.noteContainer, { backgroundColor: item.color }]}
      onPress={() => openNote(item)}
      onLongPress={() => deleteNote(item.id)}
    >
      {item.title ? (
        <Text style={styles.noteTitle} numberOfLines={2}>
          {item.title}
        </Text>
      ) : null}
      {item.content ? (
        <Text style={styles.noteContent} numberOfLines={8}>
          {item.content}
        </Text>
      ) : null}
      <Text style={styles.noteDate}>
        {formatDate(item.updatedAt)}
      </Text>
    </TouchableOpacity>
  );

  const renderColorPicker = (isEdit: boolean = false) => (
    <View style={styles.colorPickerContainer}>
      {NOTE_COLORS.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorOption,
            { backgroundColor: color },
            (isEdit ? editColor : selectedColor) === color && styles.colorOptionSelected,
          ]}
          onPress={() => isEdit ? setEditColor(color) : setSelectedColor(color)}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      
      {/* Visualização/Edição de Nota */}
      {selectedNote && (
        <View style={styles.noteViewContainer}>
          <View style={styles.noteViewHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={closeNote}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.noteViewTitle}>
              {isEditing ? 'Editando' : 'Visualizando'}
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={isEditing ? saveEdit : startEditing}
            >
              <Text style={styles.editButtonText}>
                {isEditing ? 'Salvar' : 'Editar'}
              </Text>
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <ScrollView style={styles.editForm}>
              <View style={[styles.inputContainer, { backgroundColor: editColor }]}>
                <TextInput
                  style={styles.titleInput}
                  placeholder="Título"
                  placeholderTextColor="#7a7a7a"
                  value={editTitle}
                  onChangeText={setEditTitle}
                  maxLength={100}
                />
                <TextInput
                  style={styles.contentInputExpanded}
                  placeholder="Escreva sua nota..."
                  placeholderTextColor="#7a7a7a"
                  value={editContent}
                  onChangeText={setEditContent}
                  multiline
                  maxLength={1000}
                />
              </View>
              
              {renderColorPicker(true)}
              
              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={cancelEdit}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteNoteButton}
                  onPress={() => {
                    closeNote();
                    deleteNote(selectedNote.id);
                  }}
                >
                  <Text style={styles.deleteNoteButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          ) : (
            <ScrollView style={styles.noteViewContent} contentContainerStyle={[styles.noteViewContentInner, { backgroundColor: selectedNote.color }]}>
              {selectedNote.title ? (
                <Text style={styles.noteViewTitleText}>
                  {selectedNote.title}
                </Text>
              ) : null}
              {selectedNote.content ? (
                <Text style={styles.noteViewContentText}>
                  {selectedNote.content}
                </Text>
              ) : null}
              <Text style={styles.noteViewDate}>
                Criado em {formatDate(selectedNote.createdAt)}
                {selectedNote.updatedAt !== selectedNote.createdAt && (
                  <Text> • Editado em {formatDate(selectedNote.updatedAt)}</Text>
                )}
              </Text>
            </ScrollView>
          )}
        </View>
      )}

      {/* Tela principal */}
      {!selectedNote && (
        <>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Image source={require('../../../assets/icon.png')} style={{width: 48, height: 48}} />
              <Text style={styles.title}>Suas Notes</Text>
            </View>
            <Text style={styles.subtitle}>
              {notes.length} {notes.length === 1 ? 'nota' : 'notas'}
            </Text>
          </View>

          {/* Formulário de nova nota */}
          {isCreating && (
            <View style={styles.createForm}>
              <View style={[styles.inputContainer, { backgroundColor: selectedColor }]}>
                <TextInput
                  style={styles.titleInput}
                  placeholder="Título"
                  placeholderTextColor="#7a7a7a"
                  value={newTitle}
                  onChangeText={setNewTitle}
                  maxLength={100}
                />
                <TextInput
                  style={styles.contentInput}
                  placeholder="Escreva sua nota..."
                  placeholderTextColor="#7a7a7a"
                  value={newContent}
                  onChangeText={setNewContent}
                  multiline
                  maxLength={1000}
                />
              </View>
              
              {renderColorPicker()}
              
              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setIsCreating(false);
                    setNewTitle('');
                    setNewContent('');
                    setSelectedColor(NOTE_COLORS[0]);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={createNote}
                >
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Lista de notas */}
          <FlatList
            data={notes}
            renderItem={renderNote}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              !isCreating ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Nenhuma nota ainda</Text>
                  <Text style={styles.emptySubtext}>
                    Toque no botão + para criar sua primeira nota
                  </Text>
                </View>
              ) : null
            }
          />

          {/* Botão de adicionar */}
          {!isCreating && (
            <TouchableOpacity
              style={styles.fab}
              onPress={() => setIsCreating(true)}
            >
              <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#161616',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 16,
    marginTop: 25,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    marginTop: 20,
  },
  title: {
    color: '#e0e0e0',
    fontSize: 28,
    fontWeight: '600',
    marginLeft: 12,
    letterSpacing: -0.4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  subtitle: {
    color: '#8a8a8a',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  createForm: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  inputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3a3a3a',
    marginBottom: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  titleInput: {
    color: '#e0e0e0',
    fontSize: 16,
    fontWeight: '500',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  contentInput: {
    color: '#e0e0e0',
    fontSize: 14,
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  colorPickerContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#5a67d8',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#8a8a8a',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  saveButton: {
    backgroundColor: '#5a67d8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  noteContainer: {
    flex: 1,
    margin: 6,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3a3a3a',
    minHeight: 120,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  noteTitle: {
    color: '#e0e0e0',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  noteContent: {
    color: '#e0e0e0',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  noteDate: {
    color: '#7a7a7a',
    fontSize: 11,
    marginTop: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5a67d8',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#5a67d8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  fabText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '300',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyText: {
    color: '#8a8a8a',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  emptySubtext: {
    color: '#7a7a7a',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  // Estilos para visualização/edição de nota
  noteViewContainer: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  noteViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#161616',
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#e0e0e0',
    fontSize: 24,
    fontWeight: '300',
  },
  noteViewTitle: {
    color: '#e0e0e0',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  editButton: {
    backgroundColor: '#5a67d8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  editForm: {
    flex: 1,
    padding: 16,
  },
  contentInputExpanded: {
    color: '#e0e0e0',
    fontSize: 14,
    padding: 16,
    minHeight: 200,
    textAlignVertical: 'top',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  noteViewContent: {
    flex: 1,
    margin: 16,
  },
  noteViewContentInner: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3a3a3a',
    minHeight: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  noteViewTitleText: {
    color: '#e0e0e0',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  noteViewContentText: {
    color: '#e0e0e0',
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  noteViewDate: {
    color: '#7a7a7a',
    fontSize: 12,
    marginTop: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  deleteNoteButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  deleteNoteButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});

export default NotesApp;