/**
 * Storage Debugger and Management Utility
 * Helps debug and manage storage issues
 */

import { getStorageInfo, audioStorage } from "./audioStorage";

export interface StorageDebugInfo {
  totalStorage: {
    used: number;
    available: number;
    total: number;
    usagePercentage: number;
  };
  audioFiles: {
    count: number;
    totalSize: number;
    largestFile: { key: string; size: number } | null;
  };
  metadata: {
    userTracks: number;
    globalTracks: number;
    profiles: number;
  };
  recommendations: string[];
}

/**
 * Gets comprehensive storage debug information
 */
export const getStorageDebugInfo = (): StorageDebugInfo => {
  const storageStats = getStorageInfo();

  let largestFile: { key: string; size: number } | null = null;
  let audioTotalSize = 0;
  let userTracksCount = 0;
  let globalTracksCount = 0;
  let profilesCount = 0;

  // Analyze all localStorage items
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    const value = localStorage.getItem(key);
    if (!value) continue;

    const size = new Blob([value]).size;

    // Track audio files
    if (key.includes("track_audio_") || key.startsWith("tracks_")) {
      audioTotalSize += size;

      if (!largestFile || size > largestFile.size) {
        largestFile = { key, size };
      }
    }

    // Count metadata
    if (key.startsWith("tracks_")) userTracksCount++;
    if (key === "allTracks") globalTracksCount++;
    if (key.startsWith("profile_")) profilesCount++;
  }

  const recommendations: string[] = [];

  // Generate recommendations
  if (storageStats.usagePercentage > 80) {
    recommendations.push(
      "Storage is nearly full. Consider cleaning up old tracks.",
    );
  }

  if (largestFile && largestFile.size > 10 * 1024 * 1024) {
    recommendations.push(
      `Large file detected: ${largestFile.key} (${formatFileSize(largestFile.size)}). Consider using streaming mode.`,
    );
  }

  if (storageStats.audioFiles > 20) {
    recommendations.push(
      "Many audio files stored. Automatic cleanup will maintain optimal performance.",
    );
  }

  if (storageStats.usagePercentage < 20) {
    recommendations.push("Storage usage is optimal. No action needed.");
  }

  return {
    totalStorage: {
      used: storageStats.used,
      available: storageStats.available,
      total: storageStats.total,
      usagePercentage: storageStats.usagePercentage,
    },
    audioFiles: {
      count: storageStats.audioFiles,
      totalSize: audioTotalSize,
      largestFile,
    },
    metadata: {
      userTracks: userTracksCount,
      globalTracks: globalTracksCount,
      profiles: profilesCount,
    },
    recommendations,
  };
};

/**
 * Formats file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Forces a storage cleanup
 */
export const forceCleanup = async (): Promise<{
  success: boolean;
  freedSpace: number;
  message: string;
}> => {
  try {
    const beforeStats = getStorageInfo();

    // Clear all audio data (emergency cleanup)
    audioStorage.clearAllAudio();

    const afterStats = getStorageInfo();
    const freedSpace = beforeStats.used - afterStats.used;

    return {
      success: true,
      freedSpace,
      message: `Cleanup completed. Freed ${formatFileSize(freedSpace)} of storage space.`,
    };
  } catch (error) {
    console.error("Force cleanup failed:", error);
    return {
      success: false,
      freedSpace: 0,
      message: "Cleanup failed. Please try refreshing the page.",
    };
  }
};

/**
 * Validates storage health
 */
export const validateStorageHealth = (): {
  isHealthy: boolean;
  issues: string[];
  warnings: string[];
} => {
  const issues: string[] = [];
  const warnings: string[] = [];

  const stats = getStorageInfo();

  // Check for critical issues
  if (stats.usagePercentage > 95) {
    issues.push("Storage is critically full (>95%)");
  }

  // Check for warnings
  if (stats.usagePercentage > 80) {
    warnings.push("Storage usage is high (>80%)");
  }

  if (stats.audioFiles > 50) {
    warnings.push("Many audio files stored. Performance may be affected.");
  }

  // Check for corrupted data
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("tracks_")) {
        const value = localStorage.getItem(key);
        if (value) {
          JSON.parse(value); // Test if JSON is valid
        }
      }
    }
  } catch (error) {
    issues.push("Corrupted track data detected");
  }

  return {
    isHealthy: issues.length === 0,
    issues,
    warnings,
  };
};

/**
 * Exports storage data for backup
 */
export const exportStorageData = (): {
  timestamp: string;
  data: Record<string, any>;
  size: number;
} => {
  const data: Record<string, any> = {};
  let totalSize = 0;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      if (value) {
        // Only export metadata, not audio data
        if (!key.includes("track_audio_") && !key.startsWith("__meta_")) {
          data[key] = JSON.parse(value);
          totalSize += new Blob([value]).size;
        }
      }
    }
  }

  return {
    timestamp: new Date().toISOString(),
    data,
    size: totalSize,
  };
};

/**
 * Console debugging helpers
 */
export const debugStorageToConsole = (): void => {
  const debugInfo = getStorageDebugInfo();
  const health = validateStorageHealth();

  console.group("🎵 Motion Connect Storage Debug");

  console.log("📊 Storage Usage:", {
    used: formatFileSize(debugInfo.totalStorage.used),
    available: formatFileSize(debugInfo.totalStorage.available),
    percentage: `${debugInfo.totalStorage.usagePercentage.toFixed(1)}%`,
  });

  console.log("🎧 Audio Files:", {
    count: debugInfo.audioFiles.count,
    totalSize: formatFileSize(debugInfo.audioFiles.totalSize),
    largest: debugInfo.audioFiles.largestFile
      ? `${debugInfo.audioFiles.largestFile.key} (${formatFileSize(debugInfo.audioFiles.largestFile.size)})`
      : "None",
  });

  console.log("📋 Metadata:", debugInfo.metadata);

  if (health.issues.length > 0) {
    console.error("❌ Issues:", health.issues);
  }

  if (health.warnings.length > 0) {
    console.warn("⚠️ Warnings:", health.warnings);
  }

  if (debugInfo.recommendations.length > 0) {
    console.info("💡 Recommendations:", debugInfo.recommendations);
  }

  console.groupEnd();
};

// Make debug function available globally for easy access
if (typeof window !== "undefined") {
  (window as any).debugMotionConnectStorage = debugStorageToConsole;
}
