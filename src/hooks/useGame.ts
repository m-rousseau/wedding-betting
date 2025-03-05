import { useState, useEffect, useCallback } from 'react';
import { Game, GameWithQuestions, GameResults, Question, Answer, Vote, CustomError } from '../types';
import * as gameService from '../services/gameService';
import { isCustomError, getErrorMessage, logError } from '../utils/errorHandler';

export const useGame = (gameId?: string) => {
  const [games, setGames] = useState<Game[]>([]);
  const [game, setGame] = useState<GameWithQuestions | null>(null);
  const [gameResults, setGameResults] = useState<GameResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  // Load active games
  const loadActiveGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await gameService.getActiveGames();

      if (isCustomError(result)) {
        setError(getErrorMessage(result));
      } else {
        setGames(result);
      }
    } catch (err) {
      logError(err, 'useGame.loadActiveGames');
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Load a specific game
  const loadGame = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await gameService.getGame(id);

      if (isCustomError(result)) {
        setError(getErrorMessage(result));
        setGame(null);
      } else {
        setGame(result);
        
        // Check if game timer has expired
        const timerEnd = new Date(result.timer_end);
        setIsExpired(timerEnd <= new Date());
      }
    } catch (err) {
      logError(err, 'useGame.loadGame');
      setError(getErrorMessage(err));
      setGame(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load game results
  const loadGameResults = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await gameService.getGameResults(id);

      if (isCustomError(result)) {
        setError(getErrorMessage(result));
        setGameResults(null);
      } else {
        setGameResults(result);
      }
    } catch (err) {
      logError(err, 'useGame.loadGameResults');
      setError(getErrorMessage(err));
      setGameResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Submit an answer
  const submitAnswer = useCallback(async (questionId: string, answerText?: string, choice?: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await gameService.submitAnswer(questionId, answerText, choice);

      if (isCustomError(result)) {
        setError(getErrorMessage(result));
        return null;
      } else {
        // Refresh game data if we have a gameId
        if (gameId) {
          await loadGame(gameId);
        }
        return result;
      }
    } catch (err) {
      logError(err, 'useGame.submitAnswer');
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, [gameId, loadGame]);

  // Submit a vote
  const submitVote = useCallback(async (answerId: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await gameService.submitVote(answerId);

      if (isCustomError(result)) {
        setError(getErrorMessage(result));
        return null;
      } else {
        // Refresh game results if we have a gameId
        if (gameId) {
          await loadGameResults(gameId);
        }
        return result;
      }
    } catch (err) {
      logError(err, 'useGame.submitVote');
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, [gameId, loadGameResults]);

  // Create a new game
  const createGame = useCallback(async (
    name: string,
    timerEnd: string,
    questions: { question_text: string; answer_type: 'multiple_choice' | 'text' }[]
  ) => {
    try {
      setLoading(true);
      setError(null);

      const result = await gameService.createGame(name, timerEnd, questions);

      if (isCustomError(result)) {
        setError(getErrorMessage(result));
        return null;
      } else {
        await loadActiveGames();
        return result;
      }
    } catch (err) {
      logError(err, 'useGame.createGame');
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, [loadActiveGames]);

  // Load game data if gameId is provided
  useEffect(() => {
    if (gameId) {
      loadGame(gameId);
    }
  }, [gameId, loadGame]);

  return {
    games,
    game,
    gameResults,
    loading,
    error,
    loadActiveGames,
    loadGame,
    loadGameResults,
    submitAnswer,
    submitVote,
    createGame,
    isExpired,
  };
}; 