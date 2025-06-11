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
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef } from "react";

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

const UploadTrack = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
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

  const handleInputChange = (
    field: keyof TrackData,
    value: string | boolean,
  ) => {
    setTrackData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "audio/mp3",
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "audio/aac",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select an MP3, WAV, OGG, or AAC file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 50MB.",
        variant: "destructive",
      });
      return;
    }

    setTrackData((prev) => ({
      ...prev,
      file,
      title: prev.title || file.name.replace(/\.[^/.]+$/, ""), // Set title from filename if empty
    }));

    // Get audio duration
    const audio = new Audio();
    audio.addEventListener("loadedmetadata", () => {
      setTrackData((prev) => ({
        ...prev,
        duration: Math.round(audio.duration),
      }));
    });
    audio.src = URL.createObjectURL(file);
  };

  const handlePlayPause = () => {
    if (!trackData.file || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleUpload = async () => {
    if (!trackData.file || !trackData.title.trim()) {
      toast({
        title: "Missing information",
        description: "Please add a title and select an audio file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // Wait for upload to complete
      await new Promise((resolve) => {
        setTimeout(() => {
          setUploadProgress(100);
          resolve(true);
        }, 2000); // Complete upload after 2 seconds
      });

      // Save track data to localStorage
      const track = {
        id: Date.now().toString(),
        userId: user?.id,
        title: trackData.title,
        description: trackData.description,
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
        duration: trackData.duration,
        fileSize: trackData.file.size,
        fileName: trackData.file.name,
        uploadDate: new Date().toISOString(),
        plays: 0,
        likes: 0,
        artist: user?.fullName,
      };

      // Store in user's tracks
      const userTracks = JSON.parse(
        localStorage.getItem(`tracks_${user?.id}`) || "[]",
      );
      userTracks.push(track);
      localStorage.setItem(`tracks_${user?.id}`, JSON.stringify(userTracks));

      // If public, add to global tracks
      if (trackData.isPublic) {
        const allTracks = JSON.parse(localStorage.getItem("allTracks") || "[]");
        allTracks.push(track);
        localStorage.setItem("allTracks", JSON.stringify(allTracks));
      }

      toast({
        title: "Track uploaded successfully! 🎵",
        description: "Your track is now available on your profile.",
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
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

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
                        Supported formats: MP3, WAV, OGG, AAC (max 50MB)
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
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {trackData.file && (
                        <audio
                          ref={audioRef}
                          src={URL.createObjectURL(trackData.file)}
                          onEnded={() => setIsPlaying(false)}
                          className="w-full"
                          controls
                        />
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
                        value={trackData.bpm}
                        onChange={(e) =>
                          handleInputChange(
                            "bpm",
                            parseInt(e.target.value) || 120,
                          )
                        }
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
