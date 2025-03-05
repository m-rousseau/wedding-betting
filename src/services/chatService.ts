import { supabase } from '../config/supabase';
import { ChatRoom, Message, CustomError } from '../types';
import { compressImage } from '../utils/imageCompression';

/**
 * Create a new chat room
 * @param name Chat room name
 * @param isPrivate Whether the chat room is private
 * @param participants Array of user IDs who can access the private chat
 * @returns The created chat room
 */
export const createChatRoom = async (
  name: string,
  isPrivate: boolean,
  participants: string[] = []
): Promise<ChatRoom | CustomError> => {
  try {
    // Validate inputs
    if (!name) {
      return {
        error: {
          code: '400-INVALID-INPUT',
          message: 'Missing or invalid name.',
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

    // Add current user to participants if private
    let participantsList = participants;
    if (isPrivate) {
      // Make sure current user is included
      if (!participantsList.includes(userData.user.id)) {
        participantsList = [...participantsList, userData.user.id];
      }
    }

    // Create chat room
    const { data: roomData, error: roomError } = await supabase
      .from('chat_rooms')
      .insert([
        {
          name,
          is_private: isPrivate,
          participants: isPrivate ? participantsList : null,
        },
      ])
      .select()
      .single();

    if (roomError) {
      return {
        error: {
          code: '500-SERVER-ERROR',
          message: 'Failed to create chat room.',
        },
      };
    }

    return roomData as ChatRoom;
  } catch (error) {
    console.error('Create chat room error:', error);
    return {
      error: {
        code: '500-SERVER-ERROR',
        message: 'Failed to create chat room due to server issue.',
      },
    };
  }
};

/**
 * Get available chat rooms for the current user
 * @returns List of chat rooms
 */
export const getChatRooms = async (): Promise<ChatRoom[] | CustomError> => {
  try {
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

    // Get public chat rooms and private ones where user is a participant
    const { data, error } = await supabase
      .from('chat_rooms')
      .select('*')
      .or(`is_private.eq.false,participants.cs.{${userData.user.id}}`)
      .order('created_at', { ascending: false });

    if (error) {
      return {
        error: {
          code: '500-SERVER-ERROR',
          message: 'Failed to fetch chat rooms.',
        },
      };
    }

    return data as ChatRoom[];
  } catch (error) {
    console.error('Get chat rooms error:', error);
    return {
      error: {
        code: '500-SERVER-ERROR',
        message: 'Failed to fetch chat rooms due to server issue.',
      },
    };
  }
};

/**
 * Send a message to a chat room
 * @param roomId ID of the chat room
 * @param content Message content
 * @param photoUri Optional URI to photo to include in message
 * @returns The sent message
 */
export const sendMessage = async (
  roomId: string,
  content: string,
  photoUri?: string
): Promise<Message | CustomError> => {
  try {
    // Validate inputs
    if (!roomId || !content) {
      return {
        error: {
          code: '400-INVALID-INPUT',
          message: 'Missing room ID or content.',
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

    // Check if user has access to the chat room
    const { data: roomData, error: roomError } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (roomError) {
      return {
        error: {
          code: '404-NOT-FOUND',
          message: 'Chat room not found.',
        },
      };
    }

    // Check if user has access to private chat
    if (roomData.is_private && !roomData.participants.includes(userData.user.id)) {
      return {
        error: {
          code: '403-FORBIDDEN',
          message: 'User not authorized for this room.',
        },
      };
    }

    // Upload photo if provided
    let photoUrl = null;
    if (photoUri) {
      try {
        // Compress the image first
        const compressedUri = await compressImage(photoUri);
        
        // Upload to Supabase Storage
        const fileName = `${userData.user.id}_${Date.now()}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('chat_photos')
          .upload(fileName, {
            uri: compressedUri,
            type: 'image/jpeg',
            name: fileName,
          } as any);

        if (uploadError) {
          console.error('Photo upload error:', uploadError);
        } else if (uploadData) {
          // Get public URL
          const { data: urlData } = supabase.storage
            .from('chat_photos')
            .getPublicUrl(fileName);
          
          photoUrl = urlData.publicUrl;
        }
      } catch (err) {
        console.error('Error processing photo:', err);
      }
    }

    // Send message
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .insert([
        {
          room_id: roomId,
          user_id: userData.user.id,
          content,
          photo_url: photoUrl,
        },
      ])
      .select()
      .single();

    if (messageError) {
      return {
        error: {
          code: '500-SERVER-ERROR',
          message: 'Failed to send message.',
        },
      };
    }

    return messageData as Message;
  } catch (error) {
    console.error('Send message error:', error);
    return {
      error: {
        code: '500-SERVER-ERROR',
        message: 'Failed to send message due to server issue.',
      },
    };
  }
};

/**
 * Get messages from a chat room
 * @param roomId ID of the chat room
 * @returns List of messages
 */
export const getMessages = async (roomId: string): Promise<Message[] | CustomError> => {
  try {
    // Validate inputs
    if (!roomId) {
      return {
        error: {
          code: '400-INVALID-INPUT',
          message: 'Missing room ID.',
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

    // Check if user has access to the chat room
    const { data: roomData, error: roomError } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (roomError) {
      return {
        error: {
          code: '404-NOT-FOUND',
          message: 'Chat room not found.',
        },
      };
    }

    // Check if user has access to private chat
    if (roomData.is_private && !roomData.participants.includes(userData.user.id)) {
      return {
        error: {
          code: '403-FORBIDDEN',
          message: 'User not authorized for this room.',
        },
      };
    }

    // Get messages
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('timestamp', { ascending: true });

    if (error) {
      return {
        error: {
          code: '500-SERVER-ERROR',
          message: 'Failed to fetch messages.',
        },
      };
    }

    return data as Message[];
  } catch (error) {
    console.error('Get messages error:', error);
    return {
      error: {
        code: '500-SERVER-ERROR',
        message: 'Failed to fetch messages due to server issue.',
      },
    };
  }
};

/**
 * Subscribe to new messages in a chat room
 * @param roomId ID of the chat room
 * @param callback Function to call when a new message is received
 * @returns Subscription object with unsubscribe method
 */
export const subscribeToMessages = (
  roomId: string,
  callback: (message: Message) => void
) => {
  return supabase
    .channel(`room:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      },
      (payload: { new: Record<string, any> }) => {
        callback(payload.new as Message);
      }
    )
    .subscribe();
}; 