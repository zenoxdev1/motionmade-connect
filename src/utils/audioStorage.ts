/**
 * Smart Audio Storage Management for Motion Connect
 * Handles localStorage optimization, quota management, and audio caching
 */

interface StorageItem {
  key: string;
  size: number;
  lastAccessed: number;
  accessCount: number;
}

class AudioStorageManager {
  private readonly MAX_STORAGE_SIZE = 50 * 1024 * 1024; // 50MB limit
  private readonly CLEANUP_THRESHOLD = 0.8; // Cleanup when 80% full
  private readonly AUDIO_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB per audio file

  /**
   * Attempts to store audio data with smart cleanup
   */
  async storeAudio(key: string, audioData: string): Promise<boolean> {
    try {
      // Validate audio data
      if (!this.isValidAudioData(audioData)) {
        throw new Error("Invalid audio data format");
      }

      // Check file size
      const audioSize = this.calculateSize(audioData);
      if (audioSize > this.AUDIO_SIZE_LIMIT) {
        console.warn(
          `Audio file too large: ${audioSize} bytes. Using streaming instead.`,
        );
        return false; // Will fall back to streaming
      }

      // Check if cleanup is needed
      const currentUsage = this.getCurrentStorageUsage();
      const availableSpace = this.MAX_STORAGE_SIZE - currentUsage;

      if (audioSize > availableSpace) {
        console.log("Storage space low, performing cleanup...");
        await this.performCleanup(audioSize);
      }

      // Try to store
      localStorage.setItem(key, audioData);

      // Update access metadata
      this.updateAccessMetadata(key, audioSize);

      return true;
    } catch (error) {
      console.error("Storage failed:", error);

      if (
        error instanceof DOMException &&
        error.name === "QuotaExceededError"
      ) {
        // Emergency cleanup
        await this.emergencyCleanup();

        // Try one more time
        try {
          localStorage.setItem(key, audioData);
          this.updateAccessMetadata(key, this.calculateSize(audioData));
          return true;
        } catch {
          console.warn("Storage quota exceeded, using streaming mode");
          return false;
        }
      }

      return false;
    }
  }

  /**
   * Retrieves audio data and updates access metadata
   */
  getAudio(key: string): string | null {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        this.updateAccessMetadata(key, this.calculateSize(data));
      }
      return data;
    } catch (error) {
      console.error("Failed to retrieve audio:", error);
      return null;
    }
  }

  /**
   * Removes audio data and cleans up metadata
   */
  removeAudio(key: string): void {
    try {
      localStorage.removeItem(key);
      this.removeAccessMetadata(key);
    } catch (error) {
      console.error("Failed to remove audio:", error);
    }
  }

  /**
   * Gets current storage usage in bytes
   */
  getCurrentStorageUsage(): number {
    let totalSize = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += this.calculateSize(value);
          }
        }
      }
    } catch (error) {
      console.error("Failed to calculate storage usage:", error);
    }
    return totalSize;
  }

  /**
   * Gets storage statistics
   */
  getStorageStats(): {
    used: number;
    available: number;
    total: number;
    usagePercentage: number;
    audioFiles: number;
  } {
    const used = this.getCurrentStorageUsage();
    const available = this.MAX_STORAGE_SIZE - used;
    const usagePercentage = (used / this.MAX_STORAGE_SIZE) * 100;

    let audioFiles = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && this.isAudioKey(key)) {
          audioFiles++;
        }
      }
    } catch (error) {
      console.error("Failed to count audio files:", error);
    }

    return {
      used,
      available,
      total: this.MAX_STORAGE_SIZE,
      usagePercentage,
      audioFiles,
    };
  }

  /**
   * Performs intelligent cleanup based on access patterns
   */
  private async performCleanup(requiredSpace: number): Promise<void> {
    const items = this.getStorageItems();
    const audioItems = items.filter((item) => this.isAudioKey(item.key));

    // Sort by access pattern (least recently used + least accessed first)
    audioItems.sort((a, b) => {
      const scoreA = a.lastAccessed + a.accessCount * 86400000; // Boost frequently accessed items
      const scoreB = b.lastAccessed + b.accessCount * 86400000;
      return scoreA - scoreB;
    });

    let freedSpace = 0;
    let cleanedCount = 0;

    for (const item of audioItems) {
      if (freedSpace >= requiredSpace * 1.2) break; // Clean a bit more than needed

      try {
        localStorage.removeItem(item.key);
        this.removeAccessMetadata(item.key);
        freedSpace += item.size;
        cleanedCount++;
      } catch (error) {
        console.error(`Failed to remove ${item.key}:`, error);
      }
    }

    console.log(
      `Cleanup completed: freed ${freedSpace} bytes from ${cleanedCount} items`,
    );
  }

  /**
   * Emergency cleanup when quota is exceeded
   */
  private async emergencyCleanup(): Promise<void> {
    console.warn("Performing emergency cleanup...");

    const items = this.getStorageItems();
    const audioItems = items.filter((item) => this.isAudioKey(item.key));

    // Remove oldest 50% of audio files
    const toRemove = audioItems
      .sort((a, b) => a.lastAccessed - b.lastAccessed)
      .slice(0, Math.ceil(audioItems.length * 0.5));

    for (const item of toRemove) {
      try {
        localStorage.removeItem(item.key);
        this.removeAccessMetadata(item.key);
      } catch (error) {
        console.error(`Emergency cleanup failed for ${item.key}:`, error);
      }
    }

    console.log(`Emergency cleanup: removed ${toRemove.length} items`);
  }

  /**
   * Gets all storage items with metadata
   */
  private getStorageItems(): StorageItem[] {
    const items: StorageItem[] = [];

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            const metadata = this.getAccessMetadata(key);
            items.push({
              key,
              size: this.calculateSize(value),
              lastAccessed: metadata.lastAccessed,
              accessCount: metadata.accessCount,
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to get storage items:", error);
    }

    return items;
  }

  /**
   * Updates access metadata for tracking usage patterns
   */
  private updateAccessMetadata(key: string, size: number): void {
    try {
      const metadataKey = `__meta_${key}`;
      const existing = this.getAccessMetadata(key);

      const metadata = {
        lastAccessed: Date.now(),
        accessCount: existing.accessCount + 1,
        size,
      };

      localStorage.setItem(metadataKey, JSON.stringify(metadata));
    } catch (error) {
      // Metadata is optional, don't fail the main operation
      console.debug("Failed to update access metadata:", error);
    }
  }

  /**
   * Gets access metadata for a key
   */
  private getAccessMetadata(key: string): {
    lastAccessed: number;
    accessCount: number;
  } {
    try {
      const metadataKey = `__meta_${key}`;
      const data = localStorage.getItem(metadataKey);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          lastAccessed: parsed.lastAccessed || Date.now(),
          accessCount: parsed.accessCount || 1,
        };
      }
    } catch (error) {
      console.debug("Failed to get access metadata:", error);
    }

    return { lastAccessed: Date.now(), accessCount: 1 };
  }

  /**
   * Removes access metadata
   */
  private removeAccessMetadata(key: string): void {
    try {
      const metadataKey = `__meta_${key}`;
      localStorage.removeItem(metadataKey);
    } catch (error) {
      console.debug("Failed to remove access metadata:", error);
    }
  }

  /**
   * Checks if a key is for audio data
   */
  private isAudioKey(key: string): boolean {
    return (
      key.startsWith("tracks_") ||
      key.includes("audio_") ||
      key.includes("_track_")
    );
  }

  /**
   * Validates audio data format
   */
  private isValidAudioData(data: string): boolean {
    return data.startsWith("data:audio/") && data.includes(",");
  }

  /**
   * Calculates approximate size of string in bytes
   */
  private calculateSize(str: string): number {
    return new Blob([str]).size;
  }

  /**
   * Clears all audio data (useful for debugging)
   */
  clearAllAudio(): void {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && this.isAudioKey(key)) {
        keys.push(key);
      }
    }

    keys.forEach((key) => {
      localStorage.removeItem(key);
      this.removeAccessMetadata(key);
    });

    console.log(`Cleared ${keys.length} audio files from storage`);
  }
}

// Singleton instance
export const audioStorage = new AudioStorageManager();

/**
 * Enhanced audio storage functions with fallback to streaming
 */
export const storeAudioSafely = async (
  key: string,
  audioData: string,
): Promise<{ stored: boolean; shouldStream: boolean }> => {
  const stored = await audioStorage.storeAudio(key, audioData);
  return {
    stored,
    shouldStream: !stored,
  };
};

export const getAudioSafely = (key: string): string | null => {
  return audioStorage.getAudio(key);
};

export const removeAudioSafely = (key: string): void => {
  audioStorage.removeAudio(key);
};

export const getStorageInfo = () => {
  return audioStorage.getStorageStats();
};

/**
 * Cleanup function for component unmount or app close
 */
export const cleanupOldAudio = async (): Promise<void> => {
  const stats = audioStorage.getStorageStats();
  if (stats.usagePercentage > 70) {
    console.log("Performing scheduled cleanup...");
    await audioStorage.performCleanup(stats.used * 0.3); // Free 30% of current usage
  }
};
