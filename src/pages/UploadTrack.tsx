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
import { Badge } from "@/components/ui/badge";
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
  Clock,
  FileAudio,
  Activity,
  Mic,
  Drum,
  RotateCcw,
  Zap,
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
  trackType:
    | "loops"
    | "starters"
    | "beats"
    | "one-shots"
    | "drums"
    | "vocals"
    | "full-track";
}

const trackTypes = [
  {
    value: "full-track",
    label: "Full Track",
    description: "Complete song or composition",
    icon: Music,
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  {
    value: "loops",
    label: "Loops",
    description: "Repeatable musical phrases",
    icon: RotateCcw,
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    value: "starters",
    label: "Starters",
    description: "Song beginnings or musical ideas",
    icon: Zap,
    color: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  {
    value: "beats",
    label: "Beats",
    description: "Rhythmic patterns and instrumentals",
    icon: Activity,
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
  {
    value: "one-shots",
    label: "One-Shots",
    description: "Single hits, samples, or sounds",
    icon: Zap,
    color: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  },
  {
    value: "drums",
    label: "Drums",
    description: "Drum patterns and percussion",
    icon: Drum,
    color: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  {
    value: "vocals",
    label: "Vocals",
    description: "Vocal recordings and harmonies",
    icon: Mic,
    color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  },
];

const UploadTrack = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

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
    trackType: "full-track",
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
    "Trap",
    "Drill",
    "Lo-Fi",
    "Synthwave",
    "Phonk",
    "Afrobeat",
    "Latin",
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

  // Audio setup and playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handleError = (e: any) => {
      console.error("Audio playback error:", e);
      setIsPlaying(false);
      toast({
        title: "Playback error",
        description: "Could not play audio file.",
        variant: "destructive",
      });
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("error", handleError);
    };
  }, [toast]);

  const handleInputChange = useCallback(
    (field: keyof TrackData, value: string | boolean | number) => {
      setTrackData((prev) => ({
        ...prev,
        [field]: value,
      }));
      setUploadError(null);
    },
    [],
  );

  const convertFileToBase64 = (file: File): Promise<string> => {
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

  const validateAudioFile = async (file: File): Promise<boolean> => {
    // Validate file type
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

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Please select a valid audio file (MP3, WAV, OGG, AAC, M4A)",
      );
    }

    // Validate file size (max 25MB)
    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("File size must be less than 25MB");
    }

    // Try to create audio element to validate
    return new Promise((resolve) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);

      const cleanup = () => URL.revokeObjectURL(url);

      audio.addEventListener("canplay", () => {
        cleanup();
        resolve(true);
      });

      audio.addEventListener("error", () => {
        cleanup();
        resolve(false);
      });

      audio.src = url;
    });
  };

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploadError(null);

      try {
        // Validate the audio file
        const isValid = await validateAudioFile(file);
        if (!isValid) {
          throw new Error(
            "The selected file is not a valid audio file or is corrupted",
          );
        }

        setTrackData((prev) => ({
          ...prev,
          file,
          title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
        }));

        // Set up audio preview
        const audio = audioRef.current;
        if (audio) {
          const audioUrl = URL.createObjectURL(file);
          audio.src = audioUrl;
          audio.load();

          audio.addEventListener("loadedmetadata", () => {
            setTrackData((prev) => ({
              ...prev,
              duration: Math.round(audio.duration),
            }));
          });
        }

        toast({
          title: "Audio file loaded! 🎵",
          description: "File validated and ready for upload.",
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Invalid audio file";
        setUploadError(errorMessage);
        toast({
          title: "File validation failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  const handlePlayPause = useCallback(() => {
    if (!trackData.file || !audioRef.current) return;

    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
    } else {
      if (!audio.src) {
        const audioUrl = URL.createObjectURL(trackData.file);
        audio.src = audioUrl;
      }
      audio.play().catch((error) => {
        console.error("Playback failed:", error);
        toast({
          title: "Playback error",
          description: "Could not play audio file.",
          variant: "destructive",
        });
      });
    }
  }, [trackData.file, isPlaying, toast]);

  const formatDuration = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const checkStorageSpace = () => {
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

    if (!checkStorageSpace()) {
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
      // Progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 200);

      // Convert file to base64 for reliable storage
      let audioUrl = "";
      try {
        toast({
          title: "Processing audio...",
          description:
            "Converting audio file for optimal storage and playback.",
        });

        audioUrl = await convertFileToBase64(trackData.file);

        // Verify the base64 data is valid
        if (!audioUrl || !audioUrl.startsWith("data:audio/")) {
          throw new Error("Invalid audio data");
        }

        setUploadProgress(70);
      } catch (fileError) {
        console.error("File conversion error:", fileError);
        throw new Error("Failed to process audio file");
      }

      clearInterval(progressInterval);
      setUploadProgress(95);

      // Create track object
      const track = {
        id: Date.now().toString(),
        userId: user.id,
        title: trackData.title.trim(),
        description: trackData.description.trim(),
        genre: trackData.genre,
        bpm: trackData.bpm,
        musicalKey: trackData.musicalKey,
        trackType: trackData.trackType,
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
        audioUrl: audioUrl, // Base64 encoded audio
        uploadDate: new Date().toISOString(),
        plays: 0,
        likes: 0,
        artist: user.fullName || "Unknown Artist",
      };

      // Store in user's tracks
      const userTracks = JSON.parse(
        localStorage.getItem(`tracks_${user.id}`) || "[]",
      );
      userTracks.push(track);
      localStorage.setItem(`tracks_${user.id}`, JSON.stringify(userTracks));

      // If public, add to global tracks
      if (trackData.isPublic) {
        const allTracks = JSON.parse(localStorage.getItem("allTracks") || "[]");
        allTracks.push(track);
        localStorage.setItem("allTracks", JSON.stringify(allTracks));
      }

      // Broadcast real-time update
      const event = new CustomEvent("tracksUpdated", {
        detail: { action: "upload", track, userId: user.id },
      });
      window.dispatchEvent(event);

      setUploadProgress(100);

      toast({
        title: "Track uploaded successfully! 🎵",
        description: `"${track.title}" is now available and ready to play.`,
      });

      // Reset form
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
        trackType: "full-track",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Clear audio preview
      if (audioRef.current) {
        audioRef.current.src = "";
        audioRef.current.load();
      }
      setCurrentTime(0);
      setIsPlaying(false);
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

  const selectedTrackType = trackTypes.find(
    (type) => type.value === trackData.trackType,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      <audio ref={audioRef} preload="metadata" />

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
        <div className="max-w-5xl mx-auto">
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
              {/* Track Type Selection */}
              <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileAudio className="w-5 h-5 mr-2" />
                    Track Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {trackTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = trackData.trackType === type.value;
                      return (
                        <Button
                          key={type.value}
                          variant={isSelected ? "default" : "outline"}
                          className={`h-auto p-4 flex flex-col items-center text-center ${
                            isSelected ? type.color : "hover:bg-muted"
                          }`}
                          onClick={() =>
                            handleInputChange("trackType", type.value)
                          }
                        >
                          <Icon className="w-6 h-6 mb-2" />
                          <span className="font-medium">{type.label}</span>
                          <span className="text-xs text-muted-foreground mt-1">
                            {type.description}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                  {selectedTrackType && (
                    <div className="mt-4 p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center space-x-2">
                        <selectedTrackType.icon className="w-4 h-4 text-purple-400" />
                        <span className="font-medium">
                          Selected: {selectedTrackType.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedTrackType.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Audio File Upload */}
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
                        Upload your{" "}
                        {selectedTrackType?.label.toLowerCase() || "track"}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Drag and drop your audio file or click to browse
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supported: MP3, WAV, OGG, AAC, M4A (max 25MB)
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
                            {isPlaying ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setTrackData((prev) => ({
                                ...prev,
                                file: null,
                                duration: 0,
                              }));
                              if (fileInputRef.current)
                                fileInputRef.current.value = "";
                              if (audioRef.current) {
                                audioRef.current.pause();
                                audioRef.current.src = "";
                              }
                              setIsPlaying(false);
                              setCurrentTime(0);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Audio progress bar */}
                      {trackData.file && (
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

              {/* Track Information */}
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
                    <span>
                      Choose the correct track type for better discovery
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Audio is stored securely for reliable playback</span>
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
                    Upload {selectedTrackType?.label || "Track"}
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
