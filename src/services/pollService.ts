import { supabase } from '../config/supabase';
import { Poll, PollVote, PollResults, CustomError } from '../types';

/**
 * Create a new poll (admin only)
 * @param gameId ID of the game the poll is associated with
 * @param questionText The poll question
 * @param options Array of poll options
 * @returns The created poll
 */
export const createPoll = async (
  gameId: string,
  questionText: string,
  options: string[]
): Promise<Poll | CustomError> => {
  try {
    // Validate inputs
    if (!gameId || !questionText || !options || options.length < 2) {
      return {
        error: {
          code: '400-INVALID-INPUT',
          message: 'Missing or invalid game ID, question, or options.',
        },
      };
    }

    // Create poll
    const { data: pollData, error: pollError } = await supabase
      .from('polls')
      .insert([
        {
          game_id: gameId,
          question_text: questionText,
          options,
          status: 'active',
        },
      ])
      .select()
      .single();

    if (pollError) {
      return {
        error: {
          code: '500-SERVER-ERROR',
          message: 'Failed to create poll.',
        },
      };
    }

    return pollData as Poll;
  } catch (error) {
    console.error('Create poll error:', error);
    return {
      error: {
        code: '500-SERVER-ERROR',
        message: 'Failed to create poll due to server issue.',
      },
    };
  }
};

/**
 * Get active polls for a game
 * @param gameId ID of the game
 * @returns List of active polls
 */
export const getActivePolls = async (gameId: string): Promise<Poll[] | CustomError> => {
  try {
    // Validate inputs
    if (!gameId) {
      return {
        error: {
          code: '400-INVALID-INPUT',
          message: 'Missing game ID.',
        },
      };
    }

    // Get active polls
    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .eq('game_id', gameId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      return {
        error: {
          code: '500-SERVER-ERROR',
          message: 'Failed to fetch polls.',
        },
      };
    }

    return data as Poll[];
  } catch (error) {
    console.error('Get active polls error:', error);
    return {
      error: {
        code: '500-SERVER-ERROR',
        message: 'Failed to fetch polls due to server issue.',
      },
    };
  }
};

/**
 * Submit a vote for a poll option
 * @param pollId ID of the poll
 * @param option The selected option
 * @returns The submitted vote
 */
export const submitPollVote = async (
  pollId: string,
  option: string
): Promise<PollVote | CustomError> => {
  try {
    // Validate inputs
    if (!pollId || !option) {
      return {
        error: {
          code: '400-INVALID-INPUT',
          message: 'Missing poll ID or option.',
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

    // Check if poll is active
    const { data: pollData, error: pollError } = await supabase
      .from('polls')
      .select('*')
      .eq('id', pollId)
      .single();

    if (pollError) {
      return {
        error: {
          code: '404-NOT-FOUND',
          message: 'Poll not found.',
        },
      };
    }

    if (pollData.status !== 'active') {
      return {
        error: {
          code: '403-POLL-CLOSED',
          message: 'Poll is no longer active.',
        },
      };
    }

    // Check if option is valid
    if (!pollData.options.includes(option)) {
      return {
        error: {
          code: '400-INVALID-OPTION',
          message: 'Invalid poll option.',
        },
      };
    }

    // Check if user has already voted
    const { data: existingVote, error: existingError } = await supabase
      .from('poll_votes')
      .select('*')
      .eq('poll_id', pollId)
      .eq('user_id', userData.user.id)
      .maybeSingle();

    // If vote exists, update it
    if (existingVote) {
      const { data: updatedVote, error: updateError } = await supabase
        .from('poll_votes')
        .update({
          option,
        })
        .eq('id', existingVote.id)
        .select()
        .single();

      if (updateError) {
        return {
          error: {
            code: '500-SERVER-ERROR',
            message: 'Failed to update vote.',
          },
        };
      }

      return updatedVote as PollVote;
    }

    // Otherwise, insert new vote
    const { data: newVote, error: insertError } = await supabase
      .from('poll_votes')
      .insert([
        {
          poll_id: pollId,
          user_id: userData.user.id,
          option,
        },
      ])
      .select()
      .single();

    if (insertError) {
      return {
        error: {
          code: '500-SERVER-ERROR',
          message: 'Failed to submit vote.',
        },
      };
    }

    return newVote as PollVote;
  } catch (error) {
    console.error('Submit poll vote error:', error);
    return {
      error: {
        code: '500-SERVER-ERROR',
        message: 'Failed to submit vote due to server issue.',
      },
    };
  }
};

/**
 * Get poll results
 * @param pollId ID of the poll
 * @returns Poll results with vote counts for each option
 */
export const getPollResults = async (pollId: string): Promise<PollResults | CustomError> => {
  try {
    // Validate inputs
    if (!pollId) {
      return {
        error: {
          code: '400-INVALID-INPUT',
          message: 'Missing poll ID.',
        },
      };
    }

    // Get poll
    const { data: pollData, error: pollError } = await supabase
      .from('polls')
      .select('*')
      .eq('id', pollId)
      .single();

    if (pollError) {
      return {
        error: {
          code: '404-NOT-FOUND',
          message: 'Poll not found.',
        },
      };
    }

    // Get votes
    const { data: votesData, error: votesError } = await supabase
      .from('poll_votes')
      .select('option')
      .eq('poll_id', pollId);

    if (votesError) {
      return {
        error: {
          code: '500-SERVER-ERROR',
          message: 'Failed to fetch votes.',
        },
      };
    }

    // Count votes for each option
    const results: Record<string, number> = {};
    
    // Initialize all options with 0 votes
    pollData.options.forEach((option: string) => {
      results[option] = 0;
    });
    
    // Count votes
    votesData.forEach((vote: { option: string }) => {
      if (results[vote.option] !== undefined) {
        results[vote.option]++;
      }
    });

    return {
      poll: pollData as Poll,
      results,
    };
  } catch (error) {
    console.error('Get poll results error:', error);
    return {
      error: {
        code: '500-SERVER-ERROR',
        message: 'Failed to fetch results due to server issue.',
      },
    };
  }
};

/**
 * Close a poll (admin only)
 * @param pollId ID of the poll to close
 * @returns The updated poll
 */
export const closePoll = async (pollId: string): Promise<Poll | CustomError> => {
  try {
    // Validate inputs
    if (!pollId) {
      return {
        error: {
          code: '400-INVALID-INPUT',
          message: 'Missing poll ID.',
        },
      };
    }

    // Update poll
    const { data: pollData, error: pollError } = await supabase
      .from('polls')
      .update({
        status: 'closed',
      })
      .eq('id', pollId)
      .select()
      .single();

    if (pollError) {
      return {
        error: {
          code: '500-SERVER-ERROR',
          message: 'Failed to close poll.',
        },
      };
    }

    return pollData as Poll;
  } catch (error) {
    console.error('Close poll error:', error);
    return {
      error: {
        code: '500-SERVER-ERROR',
        message: 'Failed to close poll due to server issue.',
      },
    };
  }
};

/**
 * Subscribe to poll votes
 * @param pollId ID of the poll
 * @param callback Function to call when a new vote is received
 * @returns Subscription object with unsubscribe method
 */
export const subscribeToPollVotes = (
  pollId: string,
  callback: (vote: PollVote) => void
) => {
  return supabase
    .channel(`poll:${pollId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'poll_votes',
        filter: `poll_id=eq.${pollId}`,
      },
      (payload: { new: Record<string, any> }) => {
        callback(payload.new as PollVote);
      }
    )
    .subscribe();
}; 