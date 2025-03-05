import { supabase } from '../config/supabase';
import { 
  Game, 
  Question, 
  Answer, 
  Vote, 
  GameWithQuestions, 
  GameResults, 
  CustomError 
} from '../types';

/**
 * Create a new game (admin only)
 * @param name Game name
 * @param timerEnd Timestamp for when the game timer ends
 * @param questions Array of questions for the game
 * @returns The created game with questions
 */
export const createGame = async (
  name: string,
  timerEnd: string,
  questions: { question_text: string; answer_type: 'multiple_choice' | 'text' }[]
): Promise<GameWithQuestions | CustomError> => {
  try {
    // Validate inputs
    if (!name || !timerEnd || !questions || questions.length === 0) {
      return {
        error: {
          code: '400-INVALID-INPUT',
          message: 'Missing or invalid game name, timer, or questions.',
        },
      };
    }

    // Create game
    const { data: gameData, error: gameError } = await supabase
      .from('games')
      .insert([
        {
          name,
          timer_end: timerEnd,
          status: 'active',
        },
      ])
      .select()
      .single();

    if (gameError) {
      return {
        error: {
          code: '500-SERVER-ERROR',
          message: 'Failed to create game.',
        },
      };
    }

    // Create questions
    const questionsToInsert = questions.map((q) => ({
      game_id: gameData.id,
      question_text: q.question_text,
      answer_type: q.answer_type,
    }));

    const { data: questionsData, error: questionsError } = await supabase
      .from('questions')
      .insert(questionsToInsert)
      .select();

    if (questionsError) {
      return {
        error: {
          code: '500-SERVER-ERROR',
          message: 'Failed to create questions.',
        },
      };
    }

    return {
      ...gameData,
      questions: questionsData,
    } as GameWithQuestions;
  } catch (error) {
    console.error('Create game error:', error);
    return {
      error: {
        code: '500-SERVER-ERROR',
        message: 'Failed to create game due to server issue.',
      },
    };
  }
};

/**
 * Get all active games
 * @returns List of active games
 */
export const getActiveGames = async (): Promise<Game[] | CustomError> => {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('status', 'active')
      .order('timer_end', { ascending: true });

    if (error) {
      return {
        error: {
          code: '500-SERVER-ERROR',
          message: 'Failed to fetch games.',
        },
      };
    }

    return data as Game[];
  } catch (error) {
    console.error('Get active games error:', error);
    return {
      error: {
        code: '500-SERVER-ERROR',
        message: 'Failed to fetch games due to server issue.',
      },
    };
  }
};

/**
 * Get a specific game with its questions
 * @param gameId ID of the game to fetch
 * @returns Game with questions
 */
export const getGame = async (gameId: string): Promise<GameWithQuestions | CustomError> => {
  try {
    // Get game
    const { data: gameData, error: gameError } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .single();

    if (gameError) {
      return {
        error: {
          code: '404-NOT-FOUND',
          message: 'Game not found.',
        },
      };
    }

    // Get questions
    const { data: questionsData, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('game_id', gameId);

    if (questionsError) {
      return {
        error: {
          code: '500-SERVER-ERROR',
          message: 'Failed to fetch questions.',
        },
      };
    }

    return {
      ...gameData,
      questions: questionsData,
    } as GameWithQuestions;
  } catch (error) {
    console.error('Get game error:', error);
    return {
      error: {
        code: '500-SERVER-ERROR',
        message: 'Failed to fetch game due to server issue.',
      },
    };
  }
};

/**
 * Submit an answer to a question
 * @param questionId ID of the question
 * @param answerText Text answer (for text questions)
 * @param choice Choice answer (for multiple choice questions)
 * @returns The submitted answer
 */
export const submitAnswer = async (
  questionId: string,
  answerText?: string,
  choice?: string
): Promise<Answer | CustomError> => {
  try {
    // Validate inputs
    if (!questionId || (!answerText && !choice)) {
      return {
        error: {
          code: '400-INVALID-INPUT',
          message: 'Missing question ID or answer.',
        },
      };
    }

    // Get question to check answer type and game timer
    const { data: questionData, error: questionError } = await supabase
      .from('questions')
      .select('*, games!inner(*)')
      .eq('id', questionId)
      .single();

    if (questionError) {
      return {
        error: {
          code: '404-NOT-FOUND',
          message: 'Question not found.',
        },
      };
    }

    // Check if game timer has expired
    const timerEnd = new Date(questionData.games.timer_end);
    if (timerEnd < new Date()) {
      return {
        error: {
          code: '403-TIMER-EXPIRED',
          message: 'Game timer has expired.',
        },
      };
    }

    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return {
        error: {
          code: '401-UNAUTHORIZED',
          message: 'User not authenticated.',
        },
      };
    }

    // Check if user has already answered this question
    const { data: existingAnswer, error: existingError } = await supabase
      .from('answers')
      .select('*')
      .eq('question_id', questionId)
      .eq('user_id', userData.user.id)
      .maybeSingle();

    // If answer exists, update it
    if (existingAnswer) {
      const { data: updatedAnswer, error: updateError } = await supabase
        .from('answers')
        .update({
          answer_text: questionData.answer_type === 'text' ? answerText : null,
          choice: questionData.answer_type === 'multiple_choice' ? choice : null,
        })
        .eq('id', existingAnswer.id)
        .select()
        .single();

      if (updateError) {
        return {
          error: {
            code: '500-SERVER-ERROR',
            message: 'Failed to update answer.',
          },
        };
      }

      return updatedAnswer as Answer;
    }

    // Otherwise, insert new answer
    const { data: newAnswer, error: insertError } = await supabase
      .from('answers')
      .insert([
        {
          question_id: questionId,
          user_id: userData.user.id,
          answer_text: questionData.answer_type === 'text' ? answerText : null,
          choice: questionData.answer_type === 'multiple_choice' ? choice : null,
        },
      ])
      .select()
      .single();

    if (insertError) {
      return {
        error: {
          code: '500-SERVER-ERROR',
          message: 'Failed to submit answer.',
        },
      };
    }

    return newAnswer as Answer;
  } catch (error) {
    console.error('Submit answer error:', error);
    return {
      error: {
        code: '500-SERVER-ERROR',
        message: 'Failed to submit answer due to server issue.',
      },
    };
  }
};

/**
 * Submit a vote for an answer
 * @param answerId ID of the answer to vote for
 * @returns The submitted vote
 */
export const submitVote = async (answerId: string): Promise<Vote | CustomError> => {
  try {
    // Validate inputs
    if (!answerId) {
      return {
        error: {
          code: '400-INVALID-INPUT',
          message: 'Missing answer ID.',
        },
      };
    }

    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return {
        error: {
          code: '401-UNAUTHORIZED',
          message: 'User not authenticated.',
        },
      };
    }

    // Get answer to check question and game timer
    const { data: answerData, error: answerError } = await supabase
      .from('answers')
      .select('*, questions!inner(*, games!inner(*))')
      .eq('id', answerId)
      .single();

    if (answerError) {
      return {
        error: {
          code: '404-NOT-FOUND',
          message: 'Answer not found.',
        },
      };
    }

    // Check if game timer has expired
    const timerEnd = new Date(answerData.questions.games.timer_end);
    if (timerEnd >= new Date()) {
      return {
        error: {
          code: '403-TIMER-NOT-EXPIRED',
          message: 'Game timer has not expired yet.',
        },
      };
    }

    // Check if user has already voted for this answer
    const { data: existingVote, error: existingError } = await supabase
      .from('votes')
      .select('*')
      .eq('answer_id', answerId)
      .eq('user_id', userData.user.id)
      .maybeSingle();

    if (existingVote) {
      return {
        error: {
          code: '409-VOTE-EXISTS',
          message: 'You have already voted for this answer.',
        },
      };
    }

    // Insert vote
    const { data: voteData, error: voteError } = await supabase
      .from('votes')
      .insert([
        {
          answer_id: answerId,
          user_id: userData.user.id,
        },
      ])
      .select()
      .single();

    if (voteError) {
      return {
        error: {
          code: '500-SERVER-ERROR',
          message: 'Failed to submit vote.',
        },
      };
    }

    return voteData as Vote;
  } catch (error) {
    console.error('Submit vote error:', error);
    return {
      error: {
        code: '500-SERVER-ERROR',
        message: 'Failed to submit vote due to server issue.',
      },
    };
  }
};

/**
 * Remove a vote
 * @param voteId ID of the vote to remove
 * @returns Success status
 */
export const removeVote = async (voteId: string): Promise<{ success: boolean } | CustomError> => {
  try {
    // Validate inputs
    if (!voteId) {
      return {
        error: {
          code: '400-INVALID-INPUT',
          message: 'Missing vote ID.',
        },
      };
    }

    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return {
        error: {
          code: '401-UNAUTHORIZED',
          message: 'User not authenticated.',
        },
      };
    }

    // Delete vote
    const { error: deleteError } = await supabase
      .from('votes')
      .delete()
      .eq('id', voteId)
      .eq('user_id', userData.user.id);

    if (deleteError) {
      return {
        error: {
          code: '500-SERVER-ERROR',
          message: 'Failed to remove vote.',
        },
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Remove vote error:', error);
    return {
      error: {
        code: '500-SERVER-ERROR',
        message: 'Failed to remove vote due to server issue.',
      },
    };
  }
};

/**
 * Get game results
 * @param gameId ID of the game
 * @returns Game results with questions, answers, and votes
 */
export const getGameResults = async (gameId: string): Promise<GameResults | CustomError> => {
  try {
    // Get game
    const { data: gameData, error: gameError } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .single();

    if (gameError) {
      return {
        error: {
          code: '404-NOT-FOUND',
          message: 'Game not found.',
        },
      };
    }

    // Get questions with answers and votes
    const { data: questionsData, error: questionsError } = await supabase
      .from('questions')
      .select(`
        *,
        answers:answers(
          *,
          votes:votes(count)
        )
      `)
      .eq('game_id', gameId);

    if (questionsError) {
      return {
        error: {
          code: '500-SERVER-ERROR',
          message: 'Failed to fetch questions and answers.',
        },
      };
    }

    // Format the results
    const questions = questionsData.map((q) => {
      const answers = q.answers.map((a: any) => ({
        ...a,
        votes: a.votes[0]?.count || 0,
      }));

      return {
        ...q,
        answers,
      };
    });

    return {
      game: {
        ...gameData,
        confirmed_winners: gameData.confirmed_winners || [],
      },
      questions,
    } as GameResults;
  } catch (error) {
    console.error('Get game results error:', error);
    return {
      error: {
        code: '500-SERVER-ERROR',
        message: 'Failed to fetch results due to server issue.',
      },
    };
  }
};

/**
 * Confirm winners for a game (admin only)
 * @param gameId ID of the game
 * @param winnerIds Array of user IDs who are winners
 * @returns Updated game
 */
export const confirmWinners = async (
  gameId: string,
  winnerIds: string[]
): Promise<Game | CustomError> => {
  try {
    // Validate inputs
    if (!gameId || !winnerIds) {
      return {
        error: {
          code: '400-INVALID-INPUT',
          message: 'Missing game ID or winner IDs.',
        },
      };
    }

    // Update game
    const { data: gameData, error: gameError } = await supabase
      .from('games')
      .update({
        status: 'ended',
        confirmed_winners: winnerIds,
      })
      .eq('id', gameId)
      .select()
      .single();

    if (gameError) {
      return {
        error: {
          code: '500-SERVER-ERROR',
          message: 'Failed to confirm winners.',
        },
      };
    }

    return gameData as Game;
  } catch (error) {
    console.error('Confirm winners error:', error);
    return {
      error: {
        code: '500-SERVER-ERROR',
        message: 'Failed to confirm winners due to server issue.',
      },
    };
  }
}; 