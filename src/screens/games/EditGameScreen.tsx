import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GameStackParamList } from '../../navigation/types';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import { useGame } from '../../hooks/useGame';

type EditGameScreenProps = NativeStackScreenProps<GameStackParamList, 'EditGame'>;

const EditGameScreen = ({ route, navigation }: EditGameScreenProps) => {
  const { gameId } = route.params;
  const { game, questions, loading, error, loadGame, updateGame } = useGame(gameId);
  
  const [name, setName] = useState('');
  const [timerEnd, setTimerEnd] = useState('');
  const [gameQuestions, setGameQuestions] = useState<Array<{
    id?: string;
    question_text: string;
    answer_type: 'text' | 'multiple_choice';
  }>>([]);
  const [validationError, setValidationError] = useState('');

  // Load game data when component mounts
  useEffect(() => {
    loadGame(gameId);
  }, [gameId, loadGame]);

  // Update local state when game data is loaded
  useEffect(() => {
    if (game) {
      setName(game.name);
      setTimerEnd(game.timer_end);
    }
    
    if (questions) {
      setGameQuestions(questions.map(q => ({
        id: q.id,
        question_text: q.question_text,
        answer_type: q.answer_type
      })));
    }
  }, [game, questions]);

  const addQuestion = () => {
    setGameQuestions([...gameQuestions, { question_text: '', answer_type: 'text' }]);
  };

  const updateQuestion = (index: number, field: string, value: string) => {
    const updatedQuestions = [...gameQuestions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setGameQuestions(updatedQuestions);
  };

  const handleUpdateGame = async () => {
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
    const validQuestions = gameQuestions.filter(q => q.question_text.trim() !== '');
    if (validQuestions.length === 0) {
      setValidationError('At least one question is required');
      return;
    }
    
    try {
      // Call updateGame function (to be implemented in useGame hook)
      // await updateGame(gameId, name, timerEnd, validQuestions);
      Alert.alert('Success', 'Game updated successfully!');
      navigation.goBack();
    } catch (err) {
      console.error('Failed to update game:', err);
    }
  };

  if (loading && !game) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading game details...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit Game</Text>
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
        
        {gameQuestions.map((question, index) => (
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
        
        <View style={styles.buttonContainer}>
          <Button
            title="Update Game"
            onPress={handleUpdateGame}
            loading={loading}
            disabled={loading}
            mode="primary"
            style={styles.button}
          />
          
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            mode="outline"
            style={styles.button}
          />
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonContainer: {
    marginBottom: 24,
  },
  button: {
    marginVertical: 8,
  },
});

export default EditGameScreen; 