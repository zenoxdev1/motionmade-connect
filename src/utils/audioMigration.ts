/**
 * Audio Data Migration Utility
 * Helps migrate existing tracks to the new optimized storage system
 */

import { storeAudioSafely, getStorageInfo } from "./audioStorage";

interface Track {
  id: string;
  audioUrl?: string;
  isStreaming?: boolean;
  [key: string]: any;
}

/**
 * Migrates a user's tracks to the new storage system
 */
export const migrateUserTracks = async (
  userId: string,
): Promise<{
  migrated: number;
  failed: number;
  totalSize: number;
}> => {
  const userTracks = JSON.parse(
    localStorage.getItem(`tracks_${userId}`) || "[]",
  );

  let migrated = 0;
  let failed = 0;
  let totalSize = 0;
  const updatedTracks: Track[] = [];

  for (const track of userTracks) {
    if (
      track.audioUrl &&
      track.audioUrl.startsWith("data:audio/") &&
      !track.audioUrl.startsWith("stored:")
    ) {
      try {
        const audioSize = new Blob([track.audioUrl]).size;
        totalSize += audioSize;

        // Store audio separately
        const storageResult = await storeAudioSafely(
          `track_audio_${track.id}`,
          track.audioUrl,
        );

        if (storageResult.stored) {
          // Update track to reference stored audio
          updatedTracks.push({
            ...track,
            audioUrl: `stored:track_audio_${track.id}`,
            isStreaming: false,
          });
          migrated++;
        } else {
          // Keep original for streaming
          updatedTracks.push({
            ...track,
            isStreaming: true,
          });
          failed++;
        }
      } catch (error) {
        console.error(`Failed to migrate track ${track.id}:`, error);
        updatedTracks.push({
          ...track,
          isStreaming: true,
        });
        failed++;
      }
    } else {
      // Track already migrated or no audio
      updatedTracks.push(track);
    }
  }

  // Update user tracks with migrated data
  if (migrated > 0 || failed > 0) {
    try {
      localStorage.setItem(`tracks_${userId}`, JSON.stringify(updatedTracks));
    } catch (error) {
      console.error("Failed to save migrated tracks:", error);
    }
  }

  return { migrated, failed, totalSize };
};

/**
 * Checks if migration is needed for a user
 */
export const checkMigrationNeeded = (userId: string): boolean => {
  const userTracks = JSON.parse(
    localStorage.getItem(`tracks_${userId}`) || "[]",
  );

  return userTracks.some(
    (track: Track) =>
      track.audioUrl &&
      track.audioUrl.startsWith("data:audio/") &&
      !track.audioUrl.startsWith("stored:"),
  );
};

/**
 * Gets migration statistics for a user
 */
export const getMigrationStats = (
  userId: string,
): {
  totalTracks: number;
  needsMigration: number;
  estimatedSize: number;
} => {
  const userTracks = JSON.parse(
    localStorage.getItem(`tracks_${userId}`) || "[]",
  );

  let needsMigration = 0;
  let estimatedSize = 0;

  userTracks.forEach((track: Track) => {
    if (
      track.audioUrl &&
      track.audioUrl.startsWith("data:audio/") &&
      !track.audioUrl.startsWith("stored:")
    ) {
      needsMigration++;
      estimatedSize += new Blob([track.audioUrl]).size;
    }
  });

  return {
    totalTracks: userTracks.length,
    needsMigration,
    estimatedSize,
  };
};

/**
 * Performs automatic migration when storage quota is exceeded
 */
export const emergencyMigration = async (userId: string): Promise<boolean> => {
  console.log("Starting emergency migration...");

  try {
    const result = await migrateUserTracks(userId);
    console.log(
      `Emergency migration completed: ${result.migrated} tracks migrated, ${result.failed} failed`,
    );
    return result.migrated > 0;
  } catch (error) {
    console.error("Emergency migration failed:", error);
    return false;
  }
};

/**
 * Resolves audio URL (handles both stored and direct URLs)
 */
export const resolveAudioUrl = (audioUrl: string): string | null => {
  if (!audioUrl) return null;

  if (audioUrl.startsWith("stored:")) {
    // This will be handled by the music player context
    return audioUrl;
  }

  if (audioUrl.startsWith("data:audio/")) {
    return audioUrl;
  }

  return null;
};
