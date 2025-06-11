import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Music,
  Upload,
  ArrowLeft,
  File,
  CheckCircle,
  X,
  Play,
  Pause,
  Volume2,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useCallback, useEffect } from "react";

interface TrackData {
  title: string;
  description: string;
  genre: string;
  bpm: number;
  musicalKey: string;
  tags: string;
  collaborators: string;
  isPublic: boolean;
  allowDownload: boolean;
  trackImage: string;
  file: File | null;
  duration: number;
}

// Global audio player state for persistent playback
let globalAudioElement: HTMLAudioElement | null = null;
let globalAudioFile: File | null = null;

// Initialize global audio element
const initializeGlobalAudio = () => {
  if (!globalAudioElement) {
    globalAudioElement = new Audio();
    globalAudioElement.preload = "metadata";

    // Add error handling
    globalAudioElement.addEventListener("error", (e) => {
      console.error("Global audio error:", e);
    });
  }
  return globalAudioElement;
};

const UploadTrack = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [trackData, setTrackData] = useState<TrackData>({
    title: "",
    description: "",
    genre: "",
    bpm: 120,
    musicalKey: "C",
    tags: "",
    collaborators: "",
    isPublic: true,
    allowDownload: false,
    trackImage: "",
    file: null,
    duration: 0,
  });

  const genres = [
    "Rock",
    "Pop",
    "Jazz",
    "Classical",
    "Hip Hop",
    "Electronic",
    "Country",
    "R&B",
    "Blues",
    "Folk",
    "Reggae",
    "Metal",
    "Punk",
    "Alternative",
    "Indie",
    "House",
    "Techno",
    "Dubstep",
    "Ambient",
    "Funk",
    "Soul",
    "Gospel",
  ];

  const musicalKeys = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
    "Cm",
    "C#m",
    "Dm",
    "D#m",
    "Em",
    "Fm",
    "F#m",
    "Gm",
    "G#m",
    "Am",
    "A#m",
    "Bm",
  ];

  // Initialize or maintain global audio element
  useEffect(() => {
    const audio = initializeGlobalAudio();

    const handleTimeUpdate = () => {
      if (audio) {
        setCurrentTime(audio.currentTime || 0);
      }
    };

    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handleError = (e: any) => {
      console.error("Audio playback error:", e);
      setIsPlaying(false);
    };

    // Add event listeners
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("error", handleError);

    // Sync playing state with global audio
    setIsPlaying(!audio.paused && audio.src !== "");

    return () => {
      // Clean up event listeners but don't destroy audio for persistence
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  // Sync current time periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (globalAudioElement && !globalAudioElement.paused) {
        setCurrentTime(globalAudioElement.currentTime);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = useCallback(
    (field: keyof TrackData, value: string | boolean | number) => {
      setTrackData((prev) => ({
        ...prev,
        [field]: value,
      }));
      setUploadError(null); // Clear any previous errors
    },
    [],
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploadError(null);

      // Validate file type
      const allowedTypes = [
        "audio/mp3",
        "audio/mpeg",
        "audio/wav",
        "audio/ogg",
        "audio/aac",
        "audio/x-wav",
        "audio/wave",
      ];
      if (!allowedTypes.includes(file.type)) {
        const error = "Please select an MP3, WAV, OGG, or AAC file.";
        setUploadError(error);
        toast({
          title: "Invalid file type",
          description: error,
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 25MB to avoid localStorage issues)
      const maxSize = 25 * 1024 * 1024;
      if (file.size > maxSize) {
        const error = "Please select a file smaller than 25MB.";
        setUploadError(error);
        toast({
          title: "File too large",
          description: error,
          variant: "destructive",
        });
        return;
      }

      // Stop current audio if playing different file
      if (globalAudioElement && globalAudioFile && globalAudioFile !== file) {
        globalAudioElement.pause();
        setIsPlaying(false);
      }

      setTrackData((prev) => ({
        ...prev,
        file,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ""), // Set title from filename if empty
      }));

      // Set global audio file for persistent playback
      globalAudioFile = file;

      // Get audio duration
      const audio = new Audio();
      audio.addEventListener("loadedmetadata", () => {
        setTrackData((prev) => ({
          ...prev,
          duration: Math.round(audio.duration),
        }));
        URL.revokeObjectURL(audio.src); // Clean up
      });
      audio.addEventListener("error", () => {
        console.warn("Could not load audio metadata");
        // Use default duration if metadata loading fails
        setTrackData((prev) => ({
          ...prev,
          duration: 180, // Default 3 minutes
        }));
      });
      audio.src = URL.createObjectURL(file);
    },
    [toast],
  );

  const handlePlayPause = useCallback(() => {
    if (!trackData.file || !globalAudioElement) return;

    try {
      if (isPlaying) {
        globalAudioElement.pause();
      } else {
        // Only set new source if it's different file
        if (globalAudioFile !== trackData.file) {
          const audioUrl = URL.createObjectURL(trackData.file);
          globalAudioElement.src = audioUrl;
          globalAudioFile = trackData.file;

          // Clean up previous URL
          if (
            globalAudioElement.src &&
            globalAudioElement.src.startsWith("blob:")
          ) {
            const oldUrl = globalAudioElement.src;
            setTimeout(() => URL.revokeObjectURL(oldUrl), 1000);
          }
        }
        globalAudioElement.play();
      }
    } catch (error) {
      console.error("Audio playback error:", error);
      toast({
        title: "Playback error",
        description: "Could not play audio file.",
        variant: "destructive",
      });
    }
  }, [trackData.file, isPlaying, toast]);

  const formatDuration = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const checkLocalStorageSpace = () => {
    try {
      const testKey = "storage_test";
      const testData = "a".repeat(1024 * 1024); // 1MB test
      localStorage.setItem(testKey, testData);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleUpload = async () => {
    if (!trackData.file || !trackData.title.trim()) {
      const error = "Please add a title and select an audio file.";
      setUploadError(error);
      toast({
        title: "Missing information",
        description: error,
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      const error = "You must be logged in to upload tracks.";
      setUploadError(error);
      toast({
        title: "Authentication required",
        description: error,
        variant: "destructive",
      });
      return;
    }

    // Check if we have enough storage space
    if (!checkLocalStorageSpace()) {
      const error =
        "Not enough storage space. Try clearing browser data or use a smaller file.";
      setUploadError(error);
      toast({
        title: "Storage full",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            return prev; // Stop at 90% until actual upload completes
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      // Create audio URL for storage
      let audioUrl = "";
      try {
        // For smaller files, store as base64
        if (trackData.file.size < 10 * 1024 * 1024) {
          // 10MB
          audioUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsDataURL(trackData.file!);
          });
        } else {
          // For larger files, create a blob URL (will work until page refresh)
          audioUrl = URL.createObjectURL(trackData.file);
        }
      } catch (fileError) {
        console.error("File processing error:", fileError);
        audioUrl = ""; // Continue without audio URL
      }

      // Complete the progress
      clearInterval(progressInterval);
      setUploadProgress(95);

      // Save track data to localStorage
      const track = {
        id: Date.now().toString(),
        userId: user.id,
        title: trackData.title.trim(),
        description: trackData.description.trim(),
        genre: trackData.genre,
        bpm: trackData.bpm,
        musicalKey: trackData.musicalKey,
        tags: trackData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        collaborators: trackData.collaborators
          .split(",")
          .map((collab) => collab.trim())
          .filter(Boolean),
        isPublic: trackData.isPublic,
        allowDownload: trackData.allowDownload,
        trackImage: trackData.trackImage,
        duration: trackData.duration || 180,
        fileSize: trackData.file.size,
        fileName: trackData.file.name,
        audioUrl: audioUrl,
        uploadDate: new Date().toISOString(),
        plays: 0,
        likes: 0,
        artist: user.fullName || "Unknown Artist",
      };

      // Store in user's tracks
      try {
        const userTracks = JSON.parse(
          localStorage.getItem(`tracks_${user.id}`) || "[]",
        );
        userTracks.push(track);
        localStorage.setItem(`tracks_${user.id}`, JSON.stringify(userTracks));
      } catch (storageError) {
        console.error("User tracks storage error:", storageError);
        throw new Error("Failed to save to your track library");
      }

      // If public, add to global tracks
      if (trackData.isPublic) {
        try {
          const allTracks = JSON.parse(
            localStorage.getItem("allTracks") || "[]",
          );
          allTracks.push(track);
          localStorage.setItem("allTracks", JSON.stringify(allTracks));
        } catch (globalStorageError) {
          console.error("Global tracks storage error:", globalStorageError);
          // Don't fail the upload if global storage fails
        }
      }

      setUploadProgress(100);

      toast({
        title: "Track uploaded successfully! 🎵",
        description: "Your track is now available on your profile.",
      });

      // Reset form but don't stop current playback
      setTrackData({
        title: "",
        description: "",
        genre: "",
        bpm: 120,
        musicalKey: "C",
        tags: "",
        collaborators: "",
        isPublic: true,
        allowDownload: false,
        trackImage: "",
        file: null,
        duration: 0,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Upload failed. Please try again.";
      setUploadError(errorMessage);
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const progressPercentage =
    trackData.duration > 0 ? (currentTime / trackData.duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Motion Connect
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Upload Your Track</h1>
            <p className="text-muted-foreground">
              Share your music with the Motion Connect community
            </p>
          </div>

          {/* Error Display */}
          {uploadError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-500">{uploadError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* File Upload */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Audio File
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!trackData.file ? (
                    <div
                      className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">
                        Upload your track
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Drag and drop your audio file or click to browse
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supported formats: MP3, WAV, OGG, AAC (max 25MB)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="border border-purple-500/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <File className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="font-medium">{trackData.file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(trackData.file.size / (1024 * 1024)).toFixed(2)}{" "}
                              MB
                              {trackData.duration > 0 &&
                                ` • ${formatDuration(trackData.duration)}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePlayPause}
                          >
                            {isPlaying && globalAudioFile === trackData.file ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Stop current playback if this file is playing
                              if (
                                globalAudioElement &&
                                globalAudioFile === trackData.file
                              ) {
                                globalAudioElement.pause();
                                globalAudioElement.src = "";
                                globalAudioFile = null;
                              }

                              setTrackData((prev) => ({
                                ...prev,
                                file: null,
                                duration: 0,
                              }));
                              if (fileInputRef.current)
                                fileInputRef.current.value = "";
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Persistent audio progress bar */}
                      {trackData.file && globalAudioFile === trackData.file && (
                        <div className="space-y-2">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{formatDuration(currentTime)}</span>
                            <span>{formatDuration(trackData.duration)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{Math.round(uploadProgress)}%</span>
                      </div>
                      <Progress value={uploadProgress} className="w-full" />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10">
                <CardHeader>
                  <CardTitle>Track Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Track Title *</Label>
                    <Input
                      id="title"
                      value={trackData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Enter track title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={trackData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Tell listeners about your track..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="genre">Genre</Label>
                      <Select
                        value={trackData.genre}
                        onValueChange={(value) =>
                          handleInputChange("genre", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          {genres.map((genre) => (
                            <SelectItem key={genre} value={genre.toLowerCase()}>
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bpm">BPM (Beats Per Minute)</Label>
                      <Input
                        id="bpm"
                        type="number"
                        min="60"
                        max="200"
                        value={trackData.bpm.toString()}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value >= 60 && value <= 200) {
                            handleInputChange("bpm", value);
                          }
                        }}
                        placeholder="120"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="musicalKey">Musical Key</Label>
                      <Select
                        value={trackData.musicalKey}
                        onValueChange={(value) =>
                          handleInputChange("musicalKey", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select key" />
                        </SelectTrigger>
                        <SelectContent>
                          {musicalKeys.map((key) => (
                            <SelectItem key={key} value={key}>
                              {key}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        value={trackData.tags}
                        onChange={(e) =>
                          handleInputChange("tags", e.target.value)
                        }
                        placeholder="indie, acoustic, chill (comma separated)"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="collaborators">Collaborators</Label>
                    <Input
                      id="collaborators"
                      value={trackData.collaborators}
                      onChange={(e) =>
                        handleInputChange("collaborators", e.target.value)
                      }
                      placeholder="Collaborator names (comma separated)"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Settings & Preview */}
            <div className="space-y-6">
              <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
                <CardHeader>
                  <CardTitle>Visibility & Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center">
                        {trackData.isPublic ? (
                          <Eye className="w-4 h-4 mr-2" />
                        ) : (
                          <EyeOff className="w-4 h-4 mr-2" />
                        )}
                        Public Track
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Anyone can discover and play this track
                      </p>
                    </div>
                    <Switch
                      checked={trackData.isPublic}
                      onCheckedChange={(value) =>
                        handleInputChange("isPublic", value)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Downloads</Label>
                      <p className="text-sm text-muted-foreground">
                        Let listeners download your track
                      </p>
                    </div>
                    <Switch
                      checked={trackData.allowDownload}
                      onCheckedChange={(value) =>
                        handleInputChange("allowDownload", value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10">
                <CardHeader>
                  <CardTitle>Upload Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>
                      Only upload original music or music you have rights to
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>High-quality audio files get better engagement</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Add detailed descriptions and relevant tags</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Respect community guidelines and copyright laws</span>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleUpload}
                disabled={
                  !trackData.file || !trackData.title.trim() || isUploading
                }
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <Upload className="w-5 h-5 mr-2 animate-pulse" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Track
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadTrack;
