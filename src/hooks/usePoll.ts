import { useState, useEffect, useCallback, useRef } from 'react';
import { Poll, PollVote, PollResults } from '../types';
import * as pollService from '../services/pollService';
import { isCustomError, getErrorMessage, logError } from '../utils/errorHandler';

export const usePoll = (gameId?: string, pollId?: string) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [pollResults, setPollResults] = useState<PollResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  // Load active polls for a game
  const loadActivePolls = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await pollService.getActivePolls(id);

      if (isCustomError(result)) {
        setError(getErrorMessage(result));
      } else {
        setPolls(result);
      }
    } catch (err) {
      logError(err, 'usePoll.loadActivePolls');
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Load results for a specific poll
  const loadPollResults = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await pollService.getPollResults(id);

      if (isCustomError(result)) {
        setError(getErrorMessage(result));
        setPollResults(null);
      } else {
        setPollResults(result);
      }
    } catch (err) {
      logError(err, 'usePoll.loadPollResults');
      setError(getErrorMessage(err));
      setPollResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Submit a vote for a poll
  const submitPollVote = useCallback(async (id: string, option: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await pollService.submitPollVote(id, option);

      if (isCustomError(result)) {
        setError(getErrorMessage(result));
        return null;
      } else {
        // Refresh poll results if we have a pollId
        if (pollId) {
          await loadPollResults(pollId);
        }
        return result;
      }
    } catch (err) {
      logError(err, 'usePoll.submitPollVote');
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, [pollId, loadPollResults]);

  // Create a new poll
  const createPoll = useCallback(async (id: string, questionText: string, options: string[]) => {
    try {
      setLoading(true);
      setError(null);

      const result = await pollService.createPoll(id, questionText, options);

      if (isCustomError(result)) {
        setError(getErrorMessage(result));
        return null;
      } else {
        // Refresh active polls if we have a gameId
        if (gameId) {
          await loadActivePolls(gameId);
        }
        return result;
      }
    } catch (err) {
      logError(err, 'usePoll.createPoll');
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, [gameId, loadActivePolls]);

  // Close a poll
  const closePoll = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await pollService.closePoll(id);

      if (isCustomError(result)) {
        setError(getErrorMessage(result));
        return null;
      } else {
        // Refresh active polls if we have a gameId
        if (gameId) {
          await loadActivePolls(gameId);
        }
        // Refresh poll results if we have a pollId
        if (pollId === id) {
          await loadPollResults(id);
        }
        return result;
      }
    } catch (err) {
      logError(err, 'usePoll.closePoll');
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, [gameId, pollId, loadActivePolls, loadPollResults]);

  // Subscribe to real-time poll votes
  useEffect(() => {
    if (!pollId) return;

    // Clean up previous subscription if it exists
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }

    // Set up new subscription
    const subscription = pollService.subscribeToPollVotes(pollId, () => {
      // When a new vote comes in, refresh the poll results
      loadPollResults(pollId);
    });

    subscriptionRef.current = subscription;

    // Clean up subscription on unmount or pollId change
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [pollId, loadPollResults]);

  // Load initial data
  useEffect(() => {
    if (pollId) {
      loadPollResults(pollId);
    } else if (gameId) {
      loadActivePolls(gameId);
    }
  }, [gameId, pollId, loadActivePolls, loadPollResults]);

  return {
    polls,
    pollResults,
    loading,
    error,
    loadActivePolls,
    loadPollResults,
    submitPollVote,
    createPoll,
    closePoll,
  };
}; 