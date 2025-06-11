/**
 * Helper functions for managing public profiles
 */

export const createPublicProfileUrl = (fullName: string): string => {
  return `/profile/${fullName.toLowerCase().replace(/\s+/g, "-")}`;
};

export const extractUsernameFromUrl = (username: string): string => {
  return username.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

export const getUserPublicTracks = (userId: string) => {
  const userTracks = JSON.parse(
    localStorage.getItem(`tracks_${userId}`) || "[]",
  );
  return userTracks.filter((track: any) => track.isPublic);
};

export const getUserProfileData = (userId: string) => {
  return JSON.parse(localStorage.getItem(`profile_${userId}`) || "{}");
};

export const getAllPublicUsers = () => {
  const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
  return allUsers.filter((user: any) => {
    const userTracks = getUserPublicTracks(user.id);
    return userTracks.length > 0; // Only show users with public tracks
  });
};
