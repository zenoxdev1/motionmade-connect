import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Music,
  Settings,
  Upload,
  Camera,
  Save,
  ArrowLeft,
  User,
  Mail,
  MapPin,
  Globe,
  Instagram,
  Youtube,
  Twitter,
  Guitar,
  Piano,
  Drum,
  Mic,
  AlertCircle,
  CheckCircle,
  AtSign,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null,
  );
  const [checkingUsername, setCheckingUsername] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    bio: "",
    location: "",
    website: "",
    favoriteGenres: [] as string[],
    instruments: [] as string[],
    experienceLevel: "",
    lookingFor: "",
    socialLinks: {
      instagram: "",
      youtube: "",
      twitter: "",
    },
    privacy: {
      showEmail: false,
      showLocation: true,
      allowMessages: true,
      showOnlineStatus: true,
    },
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);

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
  ];

  const instrumentOptions = [
    "Guitar",
    "Bass Guitar",
    "Piano",
    "Keyboard",
    "Drums",
    "Vocals",
    "Violin",
    "Saxophone",
    "Trumpet",
    "Flute",
    "Cello",
    "Clarinet",
  ];

  const experienceLevels = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Professional",
  ];

  const lookingForOptions = [
    "Band Members",
    "Collaborators",
    "Session Musicians",
    "Jam Partners",
    "Producers",
    "Songwriters",
    "Students",
    "Teachers",
  ];

  useEffect(() => {
    // Load existing profile data
    const loadProfileData = () => {
      if (user) {
        const storedProfile = JSON.parse(
          localStorage.getItem(`profile_${user.id}`) || "{}",
        );

        setProfileData((prev) => ({
          ...prev,
          fullName: user.fullName,
          username: user.username || "",
          email: user.email,
          avatar: user.avatar || "",
          ...storedProfile,
        }));
      }
    };

    loadProfileData();
  }, [user]);

  const generateUsername = (fullName: string) => {
    const base = fullName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 15);
    const suffix = Math.floor(Math.random() * 1000);
    return `${base}${suffix}`;
  };

  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);
    try {
      // Check against all users
      const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
      const isUsernameExists = allUsers.some(
        (u: any) =>
          u.username?.toLowerCase() === username.toLowerCase() &&
          u.id !== user?.id,
      );

      // Username validation
      const isValidFormat = /^[a-zA-Z0-9_-]{3,20}$/.test(username);

      if (!isValidFormat) {
        setUsernameAvailable(false);
        return;
      }

      setUsernameAvailable(!isUsernameExists);
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);

    // Check username availability
    if (field === "username") {
      checkUsernameAvailability(value);
    }
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
    setHasChanges(true);
  };

  const handlePrivacyChange = (setting: string, value: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [setting]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleGenreToggle = (genre: string) => {
    setProfileData((prev) => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter((g) => g !== genre)
        : [...prev.favoriteGenres, genre],
    }));
    setHasChanges(true);
  };

  const handleInstrumentToggle = (instrument: string) => {
    setProfileData((prev) => ({
      ...prev,
      instruments: prev.instruments.includes(instrument)
        ? prev.instruments.filter((i) => i !== instrument)
        : [...prev.instruments, instrument],
    }));
    setHasChanges(true);
  };

  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      setProfilePicture(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData((prev) => ({
          ...prev,
          avatar: e.target?.result as string,
        }));
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    // Validate username if changed
    if (profileData.username && profileData.username !== user.username) {
      if (usernameAvailable === false) {
        toast({
          title: "Username not available",
          description: "Please choose a different username.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      // Update user basic info
      await updateProfile({
        fullName: profileData.fullName,
        username: profileData.username,
        avatar: profileData.avatar,
      });

      // Save extended profile data
      const profileToSave = {
        bio: profileData.bio,
        location: profileData.location,
        website: profileData.website,
        favoriteGenres: profileData.favoriteGenres,
        instruments: profileData.instruments,
        experienceLevel: profileData.experienceLevel,
        lookingFor: profileData.lookingFor,
        socialLinks: profileData.socialLinks,
        privacy: profileData.privacy,
        profilePicture: profileData.avatar,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(`profile_${user.id}`, JSON.stringify(profileToSave));

      toast({
        title: "Profile saved! ✨",
        description: "Your profile has been updated successfully.",
      });

      setHasChanges(false);
    } catch (error) {
      console.error("Save profile error:", error);
      toast({
        title: "Save failed",
        description: "Could not save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const profileUrl = profileData.username
    ? `${window.location.origin}/profile/${profileData.username}`
    : null;

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

          {hasChanges && (
            <Button
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">
              Customize your musician profile and account settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture & Basic Info */}
            <div className="space-y-6">
              <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Profile Photo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-32 h-32 border-4 border-purple-500/20">
                      <AvatarImage src={profileData.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-2xl">
                        {profileData.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                        id="profile-picture"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("profile-picture")?.click()
                        }
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Change Photo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {profileUrl && (
                <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="w-5 h-5 mr-2" />
                      Public Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Your public profile URL:
                    </p>
                    <div className="flex items-center space-x-2">
                      <Input value={profileUrl} readOnly className="text-xs" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(profileUrl);
                          toast({
                            title: "URL copied!",
                            description: "Profile URL copied to clipboard.",
                          });
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Main Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profileData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="username"
                          value={profileData.username}
                          onChange={(e) =>
                            handleInputChange("username", e.target.value)
                          }
                          placeholder="Choose a username"
                          className="pl-10"
                        />
                        {checkingUsername && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                        {!checkingUsername && usernameAvailable === true && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                        )}
                        {!checkingUsername && usernameAvailable === false && (
                          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                        )}
                      </div>
                      {profileData.username &&
                        profileData.username.length > 0 && (
                          <div className="text-xs">
                            {usernameAvailable === false && (
                              <p className="text-red-500">
                                Username not available or invalid (3-20
                                characters, letters, numbers, _ and - only)
                              </p>
                            )}
                            {usernameAvailable === true && (
                              <p className="text-green-500">
                                Username is available!
                              </p>
                            )}
                            {(!profileData.username ||
                              profileData.username.length === 0) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const generated = generateUsername(
                                    profileData.fullName,
                                  );
                                  handleInputChange("username", generated);
                                }}
                                className="p-0 h-auto text-xs text-purple-400 hover:text-purple-300"
                              >
                                Generate username
                              </Button>
                            )}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Tell other musicians about yourself..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        placeholder="City, State/Country"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={profileData.website}
                        onChange={(e) =>
                          handleInputChange("website", e.target.value)
                        }
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Musical Information */}
              <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10">
                <CardHeader>
                  <CardTitle>Musical Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Experience Level</Label>
                      <Select
                        value={profileData.experienceLevel}
                        onValueChange={(value) =>
                          handleInputChange("experienceLevel", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Looking For</Label>
                      <Select
                        value={profileData.lookingFor}
                        onValueChange={(value) =>
                          handleInputChange("lookingFor", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="What are you looking for?" />
                        </SelectTrigger>
                        <SelectContent>
                          {lookingForOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Favorite Genres</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {genres.map((genre) => (
                        <Button
                          key={genre}
                          variant={
                            profileData.favoriteGenres.includes(genre)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handleGenreToggle(genre)}
                          className="justify-start"
                        >
                          {genre}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Instruments</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {instrumentOptions.map((instrument) => (
                        <Button
                          key={instrument}
                          variant={
                            profileData.instruments.includes(instrument)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handleInstrumentToggle(instrument)}
                          className="justify-start"
                        >
                          {instrument}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="instagram"
                        value={profileData.socialLinks.instagram}
                        onChange={(e) =>
                          handleSocialLinkChange("instagram", e.target.value)
                        }
                        placeholder="https://instagram.com/yourusername"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <div className="relative">
                      <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="youtube"
                        value={profileData.socialLinks.youtube}
                        onChange={(e) =>
                          handleSocialLinkChange("youtube", e.target.value)
                        }
                        placeholder="https://youtube.com/channel/yourchannel"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <div className="relative">
                      <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="twitter"
                        value={profileData.socialLinks.twitter}
                        onChange={(e) =>
                          handleSocialLinkChange("twitter", e.target.value)
                        }
                        placeholder="https://twitter.com/yourusername"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card className="border-green-500/20 bg-gradient-to-br from-card to-green-950/10">
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Email Publicly</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your email on your public profile
                      </p>
                    </div>
                    <Switch
                      checked={profileData.privacy.showEmail}
                      onCheckedChange={(value) =>
                        handlePrivacyChange("showEmail", value)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Location</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your location on your profile
                      </p>
                    </div>
                    <Switch
                      checked={profileData.privacy.showLocation}
                      onCheckedChange={(value) =>
                        handlePrivacyChange("showLocation", value)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Messages</Label>
                      <p className="text-sm text-muted-foreground">
                        Let other musicians message you directly
                      </p>
                    </div>
                    <Switch
                      checked={profileData.privacy.allowMessages}
                      onCheckedChange={(value) =>
                        handlePrivacyChange("allowMessages", value)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Online Status</Label>
                      <p className="text-sm text-muted-foreground">
                        Show when you're online or last active
                      </p>
                    </div>
                    <Switch
                      checked={profileData.privacy.showOnlineStatus}
                      onCheckedChange={(value) =>
                        handlePrivacyChange("showOnlineStatus", value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isLoading || !hasChanges}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isLoading ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
