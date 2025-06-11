/**
 * Audio Utilities for Motion Connect
 * Handles audio file processing, validation, and conversion
 */

export interface AudioInfo {
  duration: number;
  sampleRate: number;
  channels: number;
  bitRate?: number;
}

/**
 * Validates if a file is a supported audio format
 */
export const isValidAudioFile = (file: File): boolean => {
  const allowedTypes = [
    "audio/mp3",
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",
    "audio/aac",
    "audio/x-wav",
    "audio/wave",
    "audio/mp4",
    "audio/m4a",
  ];
  return allowedTypes.includes(file.type);
};

/**
 * Gets audio file metadata
 */
export const getAudioInfo = (file: File): Promise<AudioInfo> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const url = URL.createObjectURL(file);

    audio.addEventListener("loadedmetadata", () => {
      const info: AudioInfo = {
        duration: audio.duration,
        sampleRate: 44100, // Default, might not be accurate without Web Audio API
        channels: 2, // Default stereo
      };
      URL.revokeObjectURL(url);
      resolve(info);
    });

    audio.addEventListener("error", () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load audio metadata"));
    });

    audio.src = url;
  });
};

/**
 * Converts a file to base64 data URL
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (result.startsWith("data:audio/")) {
        resolve(result);
      } else {
        reject(new Error("Invalid audio data format"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

/**
 * Validates base64 audio data
 */
export const isValidBase64Audio = (dataUrl: string): boolean => {
  if (!dataUrl || typeof dataUrl !== "string") return false;
  if (!dataUrl.startsWith("data:audio/")) return false;

  const base64Part = dataUrl.split(",")[1];
  if (!base64Part) return false;

  try {
    // Try to decode base64
    atob(base64Part.substring(0, 100)); // Test first 100 chars
    return true;
  } catch {
    return false;
  }
};

/**
 * Gets the file extension from a MIME type
 */
export const getExtensionFromMimeType = (mimeType: string): string => {
  const mimeToExt: Record<string, string> = {
    "audio/mp3": "mp3",
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "audio/wave": "wav",
    "audio/x-wav": "wav",
    "audio/ogg": "ogg",
    "audio/aac": "aac",
    "audio/mp4": "m4a",
    "audio/m4a": "m4a",
  };
  return mimeToExt[mimeType] || "mp3";
};

/**
 * Formats file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Formats duration in MM:SS format
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

/**
 * Creates a safe filename from track title and artist
 */
export const createSafeFilename = (
  title: string,
  artist: string,
  extension: string = "mp3",
): string => {
  const safeName = `${title} - ${artist}`
    .replace(/[^a-zA-Z0-9\s\-_]/g, "") // Remove special characters
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim();

  return `${safeName}.${extension}`;
};

/**
 * Checks if audio can be played by creating a test audio element
 */
export const canPlayAudioUrl = (audioUrl: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!audioUrl || !audioUrl.startsWith("data:audio/")) {
      resolve(false);
      return;
    }

    const audio = new Audio();
    let resolved = false;

    const cleanup = () => {
      if (!resolved) {
        resolved = true;
        audio.remove();
      }
    };

    const handleCanPlay = () => {
      cleanup();
      resolve(true);
    };

    const handleError = () => {
      cleanup();
      resolve(false);
    };

    // Set timeout to avoid hanging
    setTimeout(() => {
      cleanup();
      resolve(false);
    }, 5000);

    audio.addEventListener("canplay", handleCanPlay, { once: true });
    audio.addEventListener("error", handleError, { once: true });

    try {
      audio.src = audioUrl;
      audio.load();
    } catch {
      cleanup();
      resolve(false);
    }
  });
};

/**
 * Converts data URL to blob for downloading
 */
export const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
  const response = await fetch(dataUrl);
  return response.blob();
};

/**
 * Estimates the compressed size of audio after base64 encoding
 */
export const estimateBase64Size = (originalSize: number): number => {
  // Base64 encoding increases size by ~33%
  return Math.ceil(originalSize * 1.33);
};

/**
 * Checks if browser storage has enough space for the file
 */
export const checkStorageSpace = (requiredSpace: number): boolean => {
  try {
    const testKey = "__storage_test__";
    const testData = "x".repeat(Math.min(requiredSpace, 1024 * 1024)); // Test up to 1MB

    localStorage.setItem(testKey, testData);
    localStorage.removeItem(testKey);

    return true;
  } catch {
    return false;
  }
};

/**
 * Gets audio format from data URL
 */
export const getAudioFormat = (dataUrl: string): string => {
  if (!dataUrl.startsWith("data:audio/")) return "unknown";

  const mimeType = dataUrl.substring(5, dataUrl.indexOf(";"));
  return getExtensionFromMimeType(`audio/${mimeType}`);
};

/**
 * Creates a download link for audio data
 */
export const createDownloadLink = async (
  audioUrl: string,
  filename: string,
): Promise<{ url: string; cleanup: () => void }> => {
  let downloadUrl: string;
  let needsCleanup = false;

  if (audioUrl.startsWith("data:")) {
    // Convert data URL to blob URL for better download support
    const blob = await dataUrlToBlob(audioUrl);
    downloadUrl = URL.createObjectURL(blob);
    needsCleanup = true;
  } else {
    downloadUrl = audioUrl;
  }

  const cleanup = () => {
    if (needsCleanup) {
      URL.revokeObjectURL(downloadUrl);
    }
  };

  return { url: downloadUrl, cleanup };
};
