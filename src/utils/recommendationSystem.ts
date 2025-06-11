interface User {
  id: string;
  fullName: string;
  username?: string;
  avatar?: string;
  instrument?: string;
  bio?: string;
  favoriteGenres?: string[];
  instruments?: string[];
  experienceLevel?: string;
  lookingFor?: string;
  location?: string;
  createdAt: string;
  lastActive?: string;
}

interface Track {
  id: string;
  userId: string;
  title: string;
  genre?: string;
  trackType?: string;
  tags?: string[];
  plays: number;
  likes: number;
  uploadDate: string;
}

interface Connection {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: "pending" | "accepted" | "blocked";
  createdAt: string;
}

interface RecommendedUser {
  user: User;
  score: number;
  reasons: string[];
  mutualConnections: number;
  commonGenres: string[];
  compatibleInstruments: boolean;
}

// Real user accounts for recommendations
export const realUserAccounts: User[] = [
  {
    id: "user_alex_producer",
    fullName: "Alex Martinez",
    username: "alexbeats",
    avatar: "https://i.pravatar.cc/150?img=1",
    instrument: "Producer",
    bio: "Hip-hop producer from Atlanta. Creating beats for artists worldwide. Always looking for fresh talent to collaborate with.",
    favoriteGenres: ["hip hop", "trap", "r&b"],
    instruments: ["Producer", "Keyboard", "Drums"],
    experienceLevel: "Professional",
    lookingFor: "Collaborators",
    location: "Atlanta, GA",
    createdAt: "2024-01-15T00:00:00Z",
    lastActive: "2024-01-20T10:30:00Z",
  },
  {
    id: "user_sarah_vocalist",
    fullName: "Sarah Chen",
    username: "sarahsings",
    avatar: "https://i.pravatar.cc/150?img=2",
    instrument: "Vocals",
    bio: "Jazz and soul vocalist with 10+ years experience. Available for features, demos, and live performances.",
    favoriteGenres: ["jazz", "soul", "r&b", "neo-soul"],
    instruments: ["Vocals", "Piano"],
    experienceLevel: "Professional",
    lookingFor: "Session Musicians",
    location: "New York, NY",
    createdAt: "2024-01-10T00:00:00Z",
    lastActive: "2024-01-20T14:15:00Z",
  },
  {
    id: "user_mike_guitarist",
    fullName: "Mike Rodriguez",
    username: "mikeguitar",
    avatar: "https://i.pravatar.cc/150?img=3",
    instrument: "Guitar",
    bio: "Session guitarist specializing in rock, blues, and country. Studio recordings and live performances available.",
    favoriteGenres: ["rock", "blues", "country", "alternative"],
    instruments: ["Guitar", "Bass Guitar"],
    experienceLevel: "Advanced",
    lookingFor: "Band Members",
    location: "Nashville, TN",
    createdAt: "2024-01-12T00:00:00Z",
    lastActive: "2024-01-20T09:45:00Z",
  },
  {
    id: "user_emma_dj",
    fullName: "Emma Thompson",
    username: "djemma",
    avatar: "https://i.pravatar.cc/150?img=4",
    instrument: "DJ/Producer",
    bio: "Electronic music producer and DJ. Specializing in house, techno, and ambient. Open for remixes and collaborations.",
    favoriteGenres: ["electronic", "house", "techno", "ambient"],
    instruments: ["DJ Controller", "Synthesizer"],
    experienceLevel: "Advanced",
    lookingFor: "Producers",
    location: "Los Angeles, CA",
    createdAt: "2024-01-08T00:00:00Z",
    lastActive: "2024-01-20T16:20:00Z",
  },
  {
    id: "user_david_drummer",
    fullName: "David Kim",
    username: "daviddrums",
    avatar: "https://i.pravatar.cc/150?img=5",
    instrument: "Drums",
    bio: "Professional drummer with experience in jazz, fusion, and progressive rock. Available for studio sessions.",
    favoriteGenres: ["jazz", "progressive", "fusion", "rock"],
    instruments: ["Drums", "Percussion"],
    experienceLevel: "Professional",
    lookingFor: "Band Members",
    location: "Chicago, IL",
    createdAt: "2024-01-14T00:00:00Z",
    lastActive: "2024-01-20T11:00:00Z",
  },
  {
    id: "user_lily_pianist",
    fullName: "Lily Wilson",
    username: "lilypiano",
    avatar: "https://i.pravatar.cc/150?img=6",
    instrument: "Piano",
    bio: "Classical pianist exploring contemporary styles. Interested in film scoring and ambient music composition.",
    favoriteGenres: ["classical", "ambient", "cinematic", "neo-classical"],
    instruments: ["Piano", "Keyboard"],
    experienceLevel: "Advanced",
    lookingFor: "Collaborators",
    location: "Seattle, WA",
    createdAt: "2024-01-11T00:00:00Z",
    lastActive: "2024-01-20T13:30:00Z",
  },
  {
    id: "user_carlos_bassist",
    fullName: "Carlos Garcia",
    username: "carlosbass",
    avatar: "https://i.pravatar.cc/150?img=7",
    instrument: "Bass",
    bio: "Funk and R&B bassist with a groove that never quits. Available for studio work and live performances.",
    favoriteGenres: ["funk", "r&b", "neo-soul", "jazz"],
    instruments: ["Bass Guitar", "Upright Bass"],
    experienceLevel: "Professional",
    lookingFor: "Session Musicians",
    location: "Miami, FL",
    createdAt: "2024-01-09T00:00:00Z",
    lastActive: "2024-01-20T15:45:00Z",
  },
  {
    id: "user_zoe_rapper",
    fullName: "Zoe Johnson",
    username: "zoebars",
    avatar: "https://i.pravatar.cc/150?img=8",
    instrument: "Vocals/Rap",
    bio: "Hip-hop artist and songwriter. Looking for producers and collaborators for upcoming EP. Let's create something fire! 🔥",
    favoriteGenres: ["hip hop", "trap", "drill", "r&b"],
    instruments: ["Vocals"],
    experienceLevel: "Intermediate",
    lookingFor: "Producers",
    location: "Detroit, MI",
    createdAt: "2024-01-13T00:00:00Z",
    lastActive: "2024-01-20T12:15:00Z",
  },
  {
    id: "user_ryan_violinist",
    fullName: "Ryan O'Connor",
    username: "ryanviolin",
    avatar: "https://i.pravatar.cc/150?img=9",
    instrument: "Violin",
    bio: "Violinist bridging classical and modern genres. Experience in orchestral, folk, and experimental music.",
    favoriteGenres: ["classical", "folk", "experimental", "ambient"],
    instruments: ["Violin", "Viola"],
    experienceLevel: "Advanced",
    lookingFor: "Collaborators",
    location: "Boston, MA",
    createdAt: "2024-01-07T00:00:00Z",
    lastActive: "2024-01-20T08:30:00Z",
  },
  {
    id: "user_nina_songwriter",
    fullName: "Nina Patel",
    username: "ninawriter",
    avatar: "https://i.pravatar.cc/150?img=10",
    instrument: "Songwriter",
    bio: "Professional songwriter and topliner. Credits with major labels. Specializing in pop, indie, and electronic music.",
    favoriteGenres: ["pop", "indie", "electronic", "alternative"],
    instruments: ["Guitar", "Piano"],
    experienceLevel: "Professional",
    lookingFor: "Songwriters",
    location: "Los Angeles, CA",
    createdAt: "2024-01-06T00:00:00Z",
    lastActive: "2024-01-20T17:00:00Z",
  },
];

export const initializeRealUsers = () => {
  // Add real users to global users list if not already present
  const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");

  realUserAccounts.forEach((realUser) => {
    const exists = allUsers.find((u: User) => u.id === realUser.id);
    if (!exists) {
      allUsers.push(realUser);
    }
  });

  localStorage.setItem("allUsers", JSON.stringify(allUsers));

  // Create some sample tracks for real users
  createSampleTracksForRealUsers();

  console.log("Real user accounts initialized:", realUserAccounts.length);
};

const createSampleTracksForRealUsers = () => {
  const sampleTracks: Partial<Track>[] = [
    {
      userId: "user_alex_producer",
      title: "Midnight Vibes",
      genre: "hip hop",
      trackType: "beats",
      tags: ["chill", "lo-fi", "trap"],
      plays: 1247,
      likes: 89,
    },
    {
      userId: "user_sarah_vocalist",
      title: "Velvet Dreams",
      genre: "jazz",
      trackType: "vocals",
      tags: ["smooth", "soul", "jazz"],
      plays: 892,
      likes: 156,
    },
    {
      userId: "user_mike_guitarist",
      title: "Highway Blues",
      genre: "blues",
      trackType: "full-track",
      tags: ["blues", "guitar", "country"],
      plays: 2031,
      likes: 203,
    },
    {
      userId: "user_emma_dj",
      title: "Neon Lights",
      genre: "electronic",
      trackType: "full-track",
      tags: ["house", "electronic", "dance"],
      plays: 1856,
      likes: 312,
    },
    {
      userId: "user_david_drummer",
      title: "Polyrhythmic Journey",
      genre: "jazz",
      trackType: "drums",
      tags: ["jazz", "fusion", "complex"],
      plays: 673,
      likes: 78,
    },
  ];

  sampleTracks.forEach((trackData) => {
    const track = {
      id: `track_${trackData.userId}_${Date.now()}`,
      ...trackData,
      uploadDate: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    };

    // Add to user's tracks
    const userTracks = JSON.parse(
      localStorage.getItem(`tracks_${trackData.userId}`) || "[]",
    );
    const exists = userTracks.find((t: Track) => t.title === track.title);
    if (!exists) {
      userTracks.push(track);
      localStorage.setItem(
        `tracks_${trackData.userId}`,
        JSON.stringify(userTracks),
      );
    }

    // Add to global tracks
    const allTracks = JSON.parse(localStorage.getItem("allTracks") || "[]");
    const globalExists = allTracks.find(
      (t: Track) => t.title === track.title && t.userId === track.userId,
    );
    if (!globalExists) {
      allTracks.push(track);
      localStorage.setItem("allTracks", JSON.stringify(allTracks));
    }
  });
};

export const getRecommendedUsers = (
  currentUserId: string,
): RecommendedUser[] => {
  const currentUser = getCurrentUser(currentUserId);
  if (!currentUser) return [];

  const allUsers = [...realUserAccounts, ...getOtherUsers(currentUserId)];
  const userTracks = getAllUserTracks(currentUserId);
  const userConnections = getUserConnections(currentUserId);

  const recommendations: RecommendedUser[] = [];

  allUsers.forEach((user) => {
    if (user.id === currentUserId) return;

    let score = 0;
    const reasons: string[] = [];
    let mutualConnections = 0;
    let commonGenres: string[] = [];
    let compatibleInstruments = false;

    // Genre compatibility
    if (currentUser.favoriteGenres && user.favoriteGenres) {
      commonGenres = currentUser.favoriteGenres.filter((genre) =>
        user.favoriteGenres?.includes(genre),
      );
      if (commonGenres.length > 0) {
        score += commonGenres.length * 15;
        reasons.push(
          `${commonGenres.length} common genre${commonGenres.length > 1 ? "s" : ""}`,
        );
      }
    }

    // Instrument compatibility
    if (currentUser.instruments && user.instruments) {
      const instrumentPairs = [
        ["Guitar", "Bass Guitar"],
        ["Guitar", "Drums"],
        ["Vocals", "Guitar"],
        ["Vocals", "Piano"],
        ["Producer", "Vocals"],
        ["Piano", "Drums"],
      ];

      for (const [inst1, inst2] of instrumentPairs) {
        if (
          (currentUser.instruments.includes(inst1) &&
            user.instruments.includes(inst2)) ||
          (currentUser.instruments.includes(inst2) &&
            user.instruments.includes(inst1))
        ) {
          compatibleInstruments = true;
          score += 20;
          reasons.push("Compatible instruments");
          break;
        }
      }
    }

    // Experience level compatibility
    if (currentUser.experienceLevel && user.experienceLevel) {
      const levels = ["Beginner", "Intermediate", "Advanced", "Professional"];
      const currentLevel = levels.indexOf(currentUser.experienceLevel);
      const userLevel = levels.indexOf(user.experienceLevel);

      if (Math.abs(currentLevel - userLevel) <= 1) {
        score += 10;
        reasons.push("Similar experience level");
      }
    }

    // Looking for compatibility
    if (currentUser.lookingFor && user.lookingFor) {
      const compatible = [
        ["Band Members", "Band Members"],
        ["Collaborators", "Collaborators"],
        ["Session Musicians", "Producers"],
        ["Producers", "Session Musicians"],
        ["Songwriters", "Producers"],
      ];

      for (const [looking1, looking2] of compatible) {
        if (
          (currentUser.lookingFor === looking1 &&
            user.lookingFor === looking2) ||
          (currentUser.lookingFor === looking2 && user.lookingFor === looking1)
        ) {
          score += 15;
          reasons.push("Compatible collaboration goals");
          break;
        }
      }
    }

    // Location proximity
    if (currentUser.location && user.location) {
      const currentCity = currentUser.location.split(",")[0];
      const userCity = user.location.split(",")[0];

      if (currentCity === userCity) {
        score += 25;
        reasons.push("Same city");
      } else if (
        currentUser.location.includes(user.location.split(",")[1]?.trim() || "")
      ) {
        score += 10;
        reasons.push("Same region");
      }
    }

    // Activity score (real users get bonus)
    if (realUserAccounts.find((u) => u.id === user.id)) {
      score += 30;
      reasons.push("Active member");
    }

    // Recent activity
    if (user.lastActive) {
      const lastActive = new Date(user.lastActive);
      const daysSince =
        (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSince < 7) {
        score += 10;
        reasons.push("Recently active");
      }
    }

    // Track activity
    const targetUserTracks = getAllUserTracks(user.id);
    if (targetUserTracks.length > 0) {
      score += Math.min(targetUserTracks.length * 2, 20);
      reasons.push(
        `${targetUserTracks.length} track${targetUserTracks.length > 1 ? "s" : ""}`,
      );
    }

    // Mutual connections
    const targetConnections = getUserConnections(user.id);
    mutualConnections = userConnections.filter((conn) =>
      targetConnections.includes(conn),
    ).length;

    if (mutualConnections > 0) {
      score += mutualConnections * 5;
      reasons.push(
        `${mutualConnections} mutual connection${mutualConnections > 1 ? "s" : ""}`,
      );
    }

    // Only include users with a reasonable score
    if (score > 20) {
      recommendations.push({
        user,
        score,
        reasons,
        mutualConnections,
        commonGenres,
        compatibleInstruments,
      });
    }
  });

  // Sort by score and return top 10
  return recommendations.sort((a, b) => b.score - a.score).slice(0, 10);
};

const getCurrentUser = (userId: string): User | null => {
  const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
  return allUsers.find((user: User) => user.id === userId) || null;
};

const getOtherUsers = (currentUserId: string): User[] => {
  const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
  return allUsers.filter((user: User) => user.id !== currentUserId);
};

const getAllUserTracks = (userId: string): Track[] => {
  return JSON.parse(localStorage.getItem(`tracks_${userId}`) || "[]");
};

const getUserConnections = (userId: string): string[] => {
  const connections = JSON.parse(
    localStorage.getItem(`connections_${userId}`) || "[]",
  );
  return connections
    .filter((conn: Connection) => conn.status === "accepted")
    .map((conn: Connection) =>
      conn.fromUserId === userId ? conn.toUserId : conn.fromUserId,
    );
};

export const sendConnectionRequest = (
  fromUserId: string,
  toUserId: string,
): boolean => {
  try {
    const connection: Connection = {
      id: `conn_${Date.now()}`,
      fromUserId,
      toUserId,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Add to sender's connections
    const fromConnections = JSON.parse(
      localStorage.getItem(`connections_${fromUserId}`) || "[]",
    );
    fromConnections.push(connection);
    localStorage.setItem(
      `connections_${fromUserId}`,
      JSON.stringify(fromConnections),
    );

    // Add to receiver's connections
    const toConnections = JSON.parse(
      localStorage.getItem(`connections_${toUserId}`) || "[]",
    );
    toConnections.push(connection);
    localStorage.setItem(
      `connections_${toUserId}`,
      JSON.stringify(toConnections),
    );

    // Broadcast event for real-time updates
    const fromUser = getCurrentUser(fromUserId);
    const toUser = getCurrentUser(toUserId);

    if (fromUser && toUser) {
      const event = new CustomEvent("connectionRequest", {
        detail: { fromUser, toUser, connection },
      });
      window.dispatchEvent(event);
    }

    return true;
  } catch (error) {
    console.error("Error sending connection request:", error);
    return false;
  }
};

export const acceptConnectionRequest = (
  connectionId: string,
  userId: string,
): boolean => {
  try {
    const connections = JSON.parse(
      localStorage.getItem(`connections_${userId}`) || "[]",
    );
    const connectionIndex = connections.findIndex(
      (conn: Connection) => conn.id === connectionId,
    );

    if (connectionIndex === -1) return false;

    connections[connectionIndex].status = "accepted";
    localStorage.setItem(`connections_${userId}`, JSON.stringify(connections));

    // Update the other user's connection status too
    const otherUserId =
      connections[connectionIndex].fromUserId === userId
        ? connections[connectionIndex].toUserId
        : connections[connectionIndex].fromUserId;

    const otherConnections = JSON.parse(
      localStorage.getItem(`connections_${otherUserId}`) || "[]",
    );
    const otherConnectionIndex = otherConnections.findIndex(
      (conn: Connection) => conn.id === connectionId,
    );

    if (otherConnectionIndex !== -1) {
      otherConnections[otherConnectionIndex].status = "accepted";
      localStorage.setItem(
        `connections_${otherUserId}`,
        JSON.stringify(otherConnections),
      );
    }

    // Broadcast event
    const user = getCurrentUser(userId);
    const otherUser = getCurrentUser(otherUserId);

    if (user && otherUser) {
      const event = new CustomEvent("connectionAccepted", {
        detail: { user, otherUser, connectionId },
      });
      window.dispatchEvent(event);
    }

    return true;
  } catch (error) {
    console.error("Error accepting connection:", error);
    return false;
  }
};

// Initialize real users when the module loads
if (typeof window !== "undefined") {
  // Add to window for debugging
  (window as any).recommendationSystem = {
    getRecommendedUsers,
    sendConnectionRequest,
    acceptConnectionRequest,
    initializeRealUsers,
    realUserAccounts,
  };
}
