import { supabase } from '../config/supabase';
import { User, AuthResponse, CustomError } from '../types';
import { compressImage } from '../utils/imageCompression';

/**
 * Sign up a new user
 * @param email User's email
 * @param password User's password
 * @param name User's name
 * @param selfieUri Optional URI to user's selfie image
 * @returns User and session data
 */
export const signUp = async (
  email: string,
  password: string,
  name: string,
  selfieUri?: string
): Promise<AuthResponse | CustomError> => {
  try {
    // Validate inputs
    if (!email || !password || !name) {
      return {
        error: {
          code: '400-INVALID-INPUT',
          message: 'Invalid email, password, or name format.',
        },
      };
    }

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (authError) {
      return {
        error: {
          code: authError.status === 409 ? '409-USER-EXISTS' : '500-SERVER-ERROR',
          message: authError.message,
        },
      };
    }

    if (!authData.user || !authData.session) {
      return {
        error: {
          code: '500-SERVER-ERROR',
          message: 'Failed to create user.',
        },
      };
    }

    // If selfie provided, upload it
    let selfieUrl = null;
    if (selfieUri) {
      try {
        // Compress the image first
        const compressedUri = await compressImage(selfieUri);
        
        // Upload to Supabase Storage
        const fileName = `${authData.user.id}_${Date.now()}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('selfies')
          .upload(fileName, {
            uri: compressedUri,
            type: 'image/jpeg',
            name: fileName,
          } as any);

        if (uploadError) {
          console.error('Selfie upload error:', uploadError);
        } else if (uploadData) {
          // Get public URL
          const { data: urlData } = supabase.storage
            .from('selfies')
            .getPublicUrl(fileName);
          
          selfieUrl = urlData.publicUrl;
          
          // Update user metadata with selfie URL
          await supabase.auth.updateUser({
            data: {
              name,
              selfie_url: selfieUrl,
            },
          });
        }
      } catch (err) {
        console.error('Error processing selfie:', err);
      }
    }

    // Return user and session
    return {
      user: {
        ...authData.user,
        email: authData.user.email || '',
        user_metadata: {
          name,
          selfie_url: selfieUrl,
        },
      } as User,
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
      },
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      error: {
        code: '500-SERVER-ERROR',
        message: 'Failed to create user due to server issue.',
      },
    };
  }
};

/**
 * Log in a user
 * @param email User's email
 * @param password User's password
 * @returns User and session data
 */
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse | CustomError> => {
  try {
    // Validate inputs
    if (!email || !password) {
      return {
        error: {
          code: '400-INVALID-INPUT',
          message: 'Invalid email or password format.',
        },
      };
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return {
        error: {
          code: authError.status === 401 ? '401-UNAUTHORIZED' : '500-SERVER-ERROR',
          message: authError.message || 'Incorrect email or password.',
        },
      };
    }

    if (!authData.user || !authData.session) {
      return {
        error: {
          code: '500-SERVER-ERROR',
          message: 'Failed to log in.',
        },
      };
    }

    // Return user and session
    return {
      user: {
        ...authData.user,
        email: authData.user.email || '',
        user_metadata: authData.user.user_metadata as { name: string; selfie_url?: string },
      } as User,
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      error: {
        code: '500-SERVER-ERROR',
        message: 'Login failed due to server issue.',
      },
    };
  }
};

/**
 * Get the current user's profile
 * @returns User profile data
 */
export const getProfile = async (): Promise<User | CustomError> => {
  try {
    // Get current session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
      return {
        error: {
          code: '401-UNAUTHORIZED',
          message: 'Invalid or missing authentication token.',
        },
      };
    }

    // Get user data
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      return {
        error: {
          code: '404-NOT-FOUND',
          message: 'User profile not found.',
        },
      };
    }

    // Return user data
    return {
      ...userData.user,
      email: userData.user.email || '',
      user_metadata: userData.user.user_metadata as { name: string; selfie_url?: string },
    } as User;
  } catch (error) {
    console.error('Get profile error:', error);
    return {
      error: {
        code: '500-SERVER-ERROR',
        message: 'Failed to fetch profile due to server issue.',
      },
    };
  }
};

/**
 * Log out the current user
 */
export const logout = async (): Promise<void | CustomError> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        error: {
          code: '500-SERVER-ERROR',
          message: error.message,
        },
      };
    }
  } catch (error) {
    console.error('Logout error:', error);
    return {
      error: {
        code: '500-SERVER-ERROR',
        message: 'Failed to log out due to server issue.',
      },
    };
  }
}; 