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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Music,
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Camera,
  Users,
  Clock,
  Key,
  Volume2,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useRef } from "react";

interface TrackData {
  id: string;
  title: string;
  description: string;
  genre: string;
  bpm: number;
  musicalKey: string;
  tags: string[];
  collaborators: string[];
  isPublic: boolean;
  allowDownload: boolean;
  trackImage: string;
  file: File | null;
  duration: number;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  plays: number;
  likes: number;
  artist: string;
}

const EditTrack = () => {
  const { trackId } = useParams<{ trackId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [trackData, setTrackData] = useState<TrackData | null>(null);
  const [newTag, setNewTag] = useState("");
  const [newCollaborator, setNewCollaborator] = useState("");

  useEffect(() => {
    if (trackId && user) {
      // Load track data from localStorage
      const userTracks = JSON.parse(
        localStorage.getItem(`tracks_${user.id}`) || "[]",
      );
      const track = userTracks.find((t: any) => t.id === trackId);

      if (track) {
        setTrackData({
          ...track,
          tags: track.tags || [],
          collaborators: track.collaborators || [],
          bpm: track.bpm || 120,
          musicalKey: track.musicalKey || "C",
          trackImage: track.trackImage || "",
        });
      } else {
        toast({
          title: "Track not found",
          description: "The track you're trying to edit doesn't exist.",
          variant: "destructive",
        });
        navigate("/my-tracks");
      }
    }
  }, [trackId, user, navigate, toast]);

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

  const handleInputChange = (field: keyof TrackData, value: any) => {
    if (trackData) {
      setTrackData((prev) => (prev ? { ...prev, [field]: value } : null));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && trackData && !trackData.tags.includes(newTag.trim())) {
      setTrackData((prev) =>
        prev
          ? {
              ...prev,
              tags: [...prev.tags, newTag.trim()],
            }
          : null,
      );
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (trackData) {
      setTrackData((prev) =>
        prev
          ? {
              ...prev,
              tags: prev.tags.filter((tag) => tag !== tagToRemove),
            }
          : null,
      );
    }
  };

  const handleAddCollaborator = () => {
    if (
      newCollaborator.trim() &&
      trackData &&
      !trackData.collaborators.includes(newCollaborator.trim())
    ) {
      setTrackData((prev) =>
        prev
          ? {
              ...prev,
              collaborators: [...prev.collaborators, newCollaborator.trim()],
            }
          : null,
      );
      setNewCollaborator("");
    }
  };

  const handleRemoveCollaborator = (collaboratorToRemove: string) => {
    if (trackData) {
      setTrackData((prev) =>
        prev
          ? {
              ...prev,
              collaborators: prev.collaborators.filter(
                (collab) => collab !== collaboratorToRemove,
              ),
            }
          : null,
      );
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && trackData) {
      // In a real app, you'd upload to a server
      const imageUrl = URL.createObjectURL(file);
      setTrackData((prev) => (prev ? { ...prev, trackImage: imageUrl } : null));
    }
  };

  const handleSaveTrack = async () => {
    if (!trackData || !user) return;

    setIsLoading(true);
    try {
      // Update track in user's tracks
      const userTracks = JSON.parse(
        localStorage.getItem(`tracks_${user.id}`) || "[]",
      );
      const trackIndex = userTracks.findIndex(
        (t: any) => t.id === trackData.id,
      );

      if (trackIndex !== -1) {
        userTracks[trackIndex] = trackData;
        localStorage.setItem(`tracks_${user.id}`, JSON.stringify(userTracks));

        // Update global tracks if public
        if (trackData.isPublic) {
          const allTracks = JSON.parse(
            localStorage.getItem("allTracks") || "[]",
          );
          const globalTrackIndex = allTracks.findIndex(
            (t: any) => t.id === trackData.id,
          );
          if (globalTrackIndex !== -1) {
            allTracks[globalTrackIndex] = trackData;
          } else {
            allTracks.push(trackData);
          }
          localStorage.setItem("allTracks", JSON.stringify(allTracks));
        }

        toast({
          title: "Track updated! 🎵",
          description: "Your track has been saved successfully.",
        });

        navigate("/my-tracks");
      }
    } catch (error) {
      toast({
        title: "Error saving track",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!trackData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading track...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/my-tracks">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to My Tracks
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
          <Button
            onClick={handleSaveTrack}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Edit Track</h1>
            <p className="text-muted-foreground">
              Update your track details and metadata
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Track Image & Basic Info */}
            <div className="space-y-6">
              <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="w-5 h-5 mr-2" />
                    Track Artwork
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="w-48 h-48 mx-auto rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-dashed border-purple-500/30 flex items-center justify-center overflow-hidden">
                    {trackData.trackImage ? (
                      <img
                        src={trackData.trackImage}
                        alt="Track artwork"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <Music className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          No artwork
                        </p>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {trackData.trackImage ? "Change Artwork" : "Add Artwork"}
                  </Button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 1000x1000px, JPG or PNG
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10">
                <CardHeader>
                  <CardTitle>Track Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Plays
                      </span>
                      <span className="text-sm font-medium">
                        {trackData.plays}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Likes
                      </span>
                      <span className="text-sm font-medium">
                        {trackData.likes}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Duration
                      </span>
                      <span className="text-sm font-medium">
                        {Math.floor(trackData.duration / 60)}:
                        {(trackData.duration % 60).toString().padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        File Size
                      </span>
                      <span className="text-sm font-medium">
                        {(trackData.fileSize / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Edit Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Track Title</Label>
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
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="musicalKey">Musical Key</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Select
                        value={trackData.musicalKey}
                        onValueChange={(value) =>
                          handleInputChange("musicalKey", value)
                        }
                      >
                        <SelectTrigger className="pl-10">
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
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10">
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    />
                    <Button onClick={handleAddTag} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {trackData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {trackData.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center space-x-1"
                        >
                          <span>{tag}</span>
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Collaborators
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newCollaborator}
                      onChange={(e) => setNewCollaborator(e.target.value)}
                      placeholder="Add collaborator name..."
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddCollaborator()
                      }
                    />
                    <Button onClick={handleAddCollaborator} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {trackData.collaborators.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {trackData.collaborators.map((collaborator, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="flex items-center space-x-1"
                        >
                          <span>{collaborator}</span>
                          <button
                            onClick={() =>
                              handleRemoveCollaborator(collaborator)
                            }
                            className="ml-1 hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10">
                <CardHeader>
                  <CardTitle>Privacy & Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Public Track</Label>
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

                  <Separator />

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTrack;
