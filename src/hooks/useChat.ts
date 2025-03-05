import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatRoom, Message } from '../types';
import * as chatService from '../services/chatService';
import { isCustomError, getErrorMessage, logError } from '../utils/errorHandler';

export const useChat = (roomId?: string) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  // Load available chat rooms
  const loadChatRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await chatService.getChatRooms();

      if (isCustomError(result)) {
        setError(getErrorMessage(result));
      } else {
        setChatRooms(result);
      }
    } catch (err) {
      logError(err, 'useChat.loadChatRooms');
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Load messages for a specific chat room
  const loadMessages = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await chatService.getMessages(id);

      if (isCustomError(result)) {
        setError(getErrorMessage(result));
      } else {
        setMessages(result);
      }
    } catch (err) {
      logError(err, 'useChat.loadMessages');
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Send a message to a chat room
  const sendMessage = useCallback(async (id: string, content: string, photoUri?: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await chatService.sendMessage(id, content, photoUri);

      if (isCustomError(result)) {
        setError(getErrorMessage(result));
        return null;
      } else {
        return result;
      }
    } catch (err) {
      logError(err, 'useChat.sendMessage');
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new chat room
  const createChatRoom = useCallback(async (name: string, isPrivate: boolean, participants: string[] = []) => {
    try {
      setLoading(true);
      setError(null);

      const result = await chatService.createChatRoom(name, isPrivate, participants);

      if (isCustomError(result)) {
        setError(getErrorMessage(result));
        return null;
      } else {
        await loadChatRooms();
        return result;
      }
    } catch (err) {
      logError(err, 'useChat.createChatRoom');
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, [loadChatRooms]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!roomId) return;

    // Clean up previous subscription if it exists
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }

    // Set up new subscription
    const subscription = chatService.subscribeToMessages(roomId, (newMessage) => {
      setMessages((prevMessages) => {
        // Check if message already exists to avoid duplicates
        if (prevMessages.some((msg) => msg.id === newMessage.id)) {
          return prevMessages;
        }
        return [...prevMessages, newMessage];
      });
    });

    subscriptionRef.current = subscription;

    // Clean up subscription on unmount or roomId change
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [roomId]);

  // Load initial data
  useEffect(() => {
    if (roomId) {
      loadMessages(roomId);
    } else {
      loadChatRooms();
    }
  }, [roomId, loadMessages, loadChatRooms]);

  return {
    chatRooms,
    messages,
    loading,
    error,
    loadChatRooms,
    loadMessages,
    sendMessage,
    createChatRoom,
  };
}; 