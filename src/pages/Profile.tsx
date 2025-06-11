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
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    bio: "",
    location: "",
    website: "",
    instrument: user?.instrument || "",
    genre: "",
    experienceLevel: "",
    lookingFor: "",
    socialLinks: {
      instagram: "",
      youtube: "",
      twitter: "",
    },
    settings: {
      profilePublic: true,
      showEmail: false,
      allowMessages: true,
      allowCollabRequests: true,
    },
  });

  useEffect(() => {
    // Load saved profile data from localStorage
    const savedProfile = localStorage.getItem(`profile_${user?.id}`);
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfileData({ ...profileData, ...parsedProfile });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: value,
      },
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem(`profile_${user?.id}`, JSON.stringify(profileData));

      // Update user context if name changed
      if (profileData.fullName !== user?.fullName) {
        const updatedUser = { ...user!, fullName: profileData.fullName };
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        // updateProfile would be implemented in AuthContext
      }

      toast({
        title: "Profile updated! ✨",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const instruments = [
    { value: "guitar", label: "Guitar", icon: Guitar },
    { value: "piano", label: "Piano/Keyboard", icon: Piano },
    { value: "drums", label: "Drums", icon: Drum },
    { value: "vocals", label: "Vocals", icon: Mic },
    { value: "bass", label: "Bass Guitar", icon: Guitar },
    { value: "violin", label: "Violin", icon: Music },
    { value: "saxophone", label: "Saxophone", icon: Music },
    { value: "other", label: "Other", icon: Music },
  ];

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
  ];

  const experienceLevels = [
    { value: "beginner", label: "Beginner (0-2 years)" },
    { value: "intermediate", label: "Intermediate (2-5 years)" },
    { value: "advanced", label: "Advanced (5-10 years)" },
    { value: "professional", label: "Professional (10+ years)" },
  ];

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
          <Button onClick={handleSaveProfile} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Profile & Settings</h1>
            <p className="text-muted-foreground">
              Customize your profile and privacy settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture & Basic Info */}
            <div className="space-y-6">
              <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Profile Picture
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <Avatar className="w-32 h-32 mx-auto">
                    <AvatarImage src={user?.avatar} alt={user?.fullName} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-4xl">
                      {user?.fullName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="w-full">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Max file size: 5MB. JPG, PNG supported.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Member since
                      </span>
                      <span className="text-sm">
                        {new Date(user?.createdAt || "").toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Profile views
                      </span>
                      <span className="text-sm">127</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Connections
                      </span>
                      <span className="text-sm">23</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Profile Form */}
            <div className="lg:col-span-2 space-y-6">
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
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="your@email.com"
                      />
                    </div>
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
                        placeholder="City, Country"
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
                        placeholder="https://your-website.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10">
                <CardHeader>
                  <CardTitle>Musical Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instrument">Primary Instrument</Label>
                      <Select
                        value={profileData.instrument}
                        onValueChange={(value) =>
                          handleInputChange("instrument", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select instrument" />
                        </SelectTrigger>
                        <SelectContent>
                          {instruments.map((instrument) => (
                            <SelectItem
                              key={instrument.value}
                              value={instrument.value}
                            >
                              <div className="flex items-center">
                                <instrument.icon className="w-4 h-4 mr-2" />
                                {instrument.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="genre">Favorite Genre</Label>
                      <Select
                        value={profileData.genre}
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience Level</Label>
                      <Select
                        value={profileData.experienceLevel}
                        onValueChange={(value) =>
                          handleInputChange("experienceLevel", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lookingFor">Looking For</Label>
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
                          <SelectItem value="band">Join a Band</SelectItem>
                          <SelectItem value="collaborators">
                            Find Collaborators
                          </SelectItem>
                          <SelectItem value="jam">Jam Sessions</SelectItem>
                          <SelectItem value="mentor">Find a Mentor</SelectItem>
                          <SelectItem value="students">
                            Teach Students
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Instagram className="w-5 h-5 text-pink-500" />
                      <Input
                        value={profileData.socialLinks.instagram}
                        onChange={(e) =>
                          handleSocialChange("instagram", e.target.value)
                        }
                        placeholder="Instagram username or URL"
                        className="flex-1"
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <Youtube className="w-5 h-5 text-red-500" />
                      <Input
                        value={profileData.socialLinks.youtube}
                        onChange={(e) =>
                          handleSocialChange("youtube", e.target.value)
                        }
                        placeholder="YouTube channel URL"
                        className="flex-1"
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <Twitter className="w-5 h-5 text-blue-400" />
                      <Input
                        value={profileData.socialLinks.twitter}
                        onChange={(e) =>
                          handleSocialChange("twitter", e.target.value)
                        }
                        placeholder="Twitter/X username"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10">
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Public Profile</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow others to find and view your profile
                      </p>
                    </div>
                    <Switch
                      checked={profileData.settings.profilePublic}
                      onCheckedChange={(value) =>
                        handleSettingChange("profilePublic", value)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Display email address on your public profile
                      </p>
                    </div>
                    <Switch
                      checked={profileData.settings.showEmail}
                      onCheckedChange={(value) =>
                        handleSettingChange("showEmail", value)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Messages</Label>
                      <p className="text-sm text-muted-foreground">
                        Let other musicians send you direct messages
                      </p>
                    </div>
                    <Switch
                      checked={profileData.settings.allowMessages}
                      onCheckedChange={(value) =>
                        handleSettingChange("allowMessages", value)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Collaboration Requests</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive invitations to collaborate on projects
                      </p>
                    </div>
                    <Switch
                      checked={profileData.settings.allowCollabRequests}
                      onCheckedChange={(value) =>
                        handleSettingChange("allowCollabRequests", value)
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

export default Profile;
