import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './tarefas/styles';

interface FeedbackScreenProps {
  onBack: () => void;
}

export default function FeedbackScreen({ onBack }: FeedbackScreenProps) {
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      Alert.alert('Erro', 'Por favor, escreva seu feedback.');
      return;
    }

    if (rating === 0) {
      Alert.alert('Erro', 'Por favor, selecione uma avaliação.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Preparar dados para envio
      const formData = new FormData();
      formData.append('feedback', feedback.trim());
      formData.append('email', email.trim() || 'Não informado');
      formData.append('rating', rating.toString());
      formData.append('ratingText', getRatingText(rating));
      formData.append('timestamp', new Date().toLocaleString('pt-BR'));
      formData.append('platform', Platform.OS);

      // Enviar para Formspree
      const response = await fetch('https://formspree.io/f/xwplkrlb', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        // Limpar campos primeiro
        setFeedback('');
        setEmail('');
        setRating(0);
        
        // Sucesso - mostrar alert e depois voltar
        Alert.alert(
          'Feedback Enviado!',
          'Obrigado pelo seu feedback. Sua opinião é muito importante para nós.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Usar setTimeout para garantir que o Alert seja fechado antes de navegar
                setTimeout(() => {
                  if (onBack && typeof onBack === 'function') {
                    onBack();
                  }
                }, 100);
              },
            },
          ]
        );
      } else {
        // Erro do servidor
        let errorMessage = 'Erro no servidor';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.log('Erro ao parsear resposta de erro:', parseError);
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      Alert.alert(
        'Erro ao Enviar',
        'Não foi possível enviar seu feedback. Verifique sua conexão com a internet e tente novamente.',
        [
          {
            text: 'Tentar Novamente',
            onPress: () => {
              // Tentar novamente sem sair da tela
              setTimeout(() => handleSubmit(), 100);
            },
          },
          {
            text: 'Cancelar',
            style: 'cancel',
          },
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (rating: number): string => {
    switch (rating) {
      case 1: return 'Muito Ruim';
      case 2: return 'Ruim';
      case 3: return 'Regular';
      case 4: return 'Bom';
      case 5: return 'Excelente';
      default: return 'Não avaliado';
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          style={{ marginHorizontal: 4 }}
          disabled={isSubmitting}
        >
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={32}
            color={i <= rating ? '#5a67d8' : '#7a7a7a'}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <TouchableOpacity 
            onPress={onBack}
            disabled={isSubmitting}
          >
            <Ionicons name="arrow-back" size={24} color="#5a67d8" />
          </TouchableOpacity>
          <Text style={styles.title}>Feedback</Text>
          <View style={{ width: 24 }} />
        </View>
        <Text style={styles.subtitle}>
          Sua opinião nos ajuda a melhorar o aplicativo
        </Text>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {/* Rating Section */}
        <View style={[styles.taskContainer, { marginBottom: 24 }]}>
          <View style={styles.taskContent}>
            <Text style={[styles.taskText, { marginBottom: 16, textAlign: 'center' }]}>
              Como você avalia o aplicativo?
            </Text>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              {renderStars()}
            </View>
            <Text style={[styles.taskDate, { textAlign: 'center', marginLeft: 0 }]}>
              {rating === 0 ? 'Selecione uma avaliação' : getRatingText(rating)}
            </Text>
          </View>
        </View>

        {/* Email Section */}
        <View style={[styles.inputContainer, { marginBottom: 16 }]}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Seu e-mail (opcional)"
            placeholderTextColor="#7a7a7a"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isSubmitting}
          />
        </View>

        {/* Feedback Section */}
        <View style={[styles.inputContainer, { marginBottom: 24 }]}>
          <TextInput
            style={[styles.input, { minHeight: 120 }]}
            value={feedback}
            onChangeText={setFeedback}
            placeholder="Escreva seu feedback, sugestões ou relate problemas..."
            placeholderTextColor="#7a7a7a"
            multiline
            maxLength={500}
            textAlignVertical="top"
            editable={!isSubmitting}
          />
          <View style={styles.inputFooter}>
            <Text style={styles.charCount}>
              {feedback.length}/500
            </Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={[styles.taskContainer, { borderColor: '#5a67d8', borderWidth: 1 }]}>
          <View style={styles.taskContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="information-circle" size={20} color="#5a67d8" />
              <Text style={[styles.taskText, { marginLeft: 8, color: '#5a67d8' }]}>
                Informações importantes
              </Text>
            </View>
            <Text style={[styles.taskDate, { marginLeft: 0, lineHeight: 18 }]}>
              • Seu feedback é anônimo, a menos que você forneça seu e-mail{'\n'}
              • Lemos todos os feedbacks e utilizamos para melhorar o app{'\n'}
              • Para suporte técnico, inclua detalhes do problema
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.form}>
        <TouchableOpacity
          style={[styles.button, (!feedback.trim() || rating === 0 || isSubmitting) && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!feedback.trim() || rating === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Ionicons name="hourglass" size={20} color="#ffffff" />
              <Text style={[styles.buttonText, (!feedback.trim() || rating === 0 || isSubmitting) && styles.buttonTextDisabled]}>
                Enviando...
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="send" size={20} color="#ffffff" />
              <Text style={[styles.buttonText, (!feedback.trim() || rating === 0 || isSubmitting) && styles.buttonTextDisabled]}>
                Enviar Feedback
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
