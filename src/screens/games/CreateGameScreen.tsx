import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GameStackParamList } from '../../navigation/types';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import { useGame } from '../../hooks/useGame';

type CreateGameScreenProps = NativeStackScreenProps<GameStackParamList, 'CreateGame'>;

const CreateGameScreen = ({ navigation }: CreateGameScreenProps) => {
  const [name, setName] = useState('');
  const [timerEnd, setTimerEnd] = useState('');
  const [questions, setQuestions] = useState([
    { question_text: '', answer_type: 'text' as const }
  ]);
  const [validationError, setValidationError] = useState('');
  const { createGame, loading, error } = useGame();

  const addQuestion = () => {
    setQuestions([...questions, { question_text: '', answer_type: 'text' as const }]);
  };

  const updateQuestion = (index: number, field: string, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setQuestions(updatedQuestions);
  };

  const handleCreateGame = async () => {
    // Reset validation error
    setValidationError('');
    
    // Validate inputs
    if (!name) {
      setValidationError('Game name is required');
      return;
    }
    
    if (!timerEnd) {
      setValidationError('Timer end date is required');
      return;
    }
    
    // Validate questions
    const validQuestions = questions.filter(q => q.question_text.trim() !== '');
    if (validQuestions.length === 0) {
      setValidationError('At least one question is required');
      return;
    }
    
    try {
      // Call createGame function (to be implemented in useGame hook)
      // await createGame(name, timerEnd, validQuestions);
      Alert.alert('Success', 'Game created successfully!');
      navigation.navigate('GameList');
    } catch (err) {
      console.error('Failed to create game:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create New Game</Text>
        </View>

        <ErrorMessage message={validationError || error} />
        
        <Input
          label="Game Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter game name"
        />
        
        <Input
          label="Timer End (YYYY-MM-DD HH:MM)"
          value={timerEnd}
          onChangeText={setTimerEnd}
          placeholder="e.g., 2023-12-31 23:59"
        />
        
        <Text style={styles.sectionTitle}>Questions</Text>
        
        {questions.map((question, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.questionNumber}>Question {index + 1}</Text>
            
            <Input
              label="Question Text"
              value={question.question_text}
              onChangeText={(text) => updateQuestion(index, 'question_text', text)}
              placeholder="Enter your question"
              multiline
              numberOfLines={2}
            />
            
            <View style={styles.typeContainer}>
              <Text style={styles.typeLabel}>Answer Type:</Text>
              <View style={styles.typeButtons}>
                <Button
                  title="Text"
                  onPress={() => updateQuestion(index, 'answer_type', 'text')}
                  mode={question.answer_type === 'text' ? 'primary' : 'outline'}
                  style={styles.typeButton}
                />
                <Button
                  title="Multiple Choice"
                  onPress={() => updateQuestion(index, 'answer_type', 'multiple_choice')}
                  mode={question.answer_type === 'multiple_choice' ? 'primary' : 'outline'}
                  style={styles.typeButton}
                />
              </View>
            </View>
          </View>
        ))}
        
        <Button
          title="Add Question"
          onPress={addQuestion}
          mode="outline"
          style={styles.addButton}
        />
        
        <Button
          title="Create Game"
          onPress={handleCreateGame}
          loading={loading}
          disabled={loading}
          mode="primary"
          style={styles.createButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#424242',
    marginTop: 24,
    marginBottom: 16,
  },
  questionContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 8,
  },
  typeContainer: {
    marginTop: 8,
  },
  typeLabel: {
    fontSize: 16,
    color: '#424242',
    marginBottom: 8,
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  addButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  createButton: {
    marginBottom: 24,
  },
});

export default CreateGameScreen; 