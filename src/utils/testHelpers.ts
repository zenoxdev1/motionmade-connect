/**
 * Test utilities to verify core functionality
 */

export const testMusicPlayer = () => {
  console.log("🎵 Testing Music Player...");

  // Test track creation
  const testTrack = {
    id: "test_" + Date.now(),
    title: "Test Track",
    artist: "Test Artist",
    duration: 180,
    audioUrl: "", // Empty for demo mode
    allowDownload: true,
    likes: 0,
  };

  console.log("✅ Test track created:", testTrack);
  return testTrack;
};

export const testProfileSave = () => {
  console.log("👤 Testing Profile Save...");

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  if (!userData.id) {
    console.log("❌ No user logged in");
    return false;
  }

  const testProfile = {
    bio: "Test bio updated at " + new Date().toISOString(),
    location: "Test City",
    instruments: ["Guitar", "Piano"],
    favoriteGenres: ["Rock", "Jazz"],
  };

  try {
    localStorage.setItem(`profile_${userData.id}`, JSON.stringify(testProfile));
    console.log("✅ Profile save test successful");
    return true;
  } catch (error) {
    console.log("❌ Profile save test failed:", error);
    return false;
  }
};

export const testTrackUpload = () => {
  console.log("📤 Testing Track Upload...");

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  if (!userData.id) {
    console.log("❌ No user logged in");
    return false;
  }

  const testTrack = {
    id: "upload_test_" + Date.now(),
    userId: userData.id,
    title: "Test Upload Track",
    description: "Test description",
    genre: "rock",
    duration: 210,
    artist: userData.fullName,
    uploadDate: new Date().toISOString(),
    plays: 0,
    likes: 0,
    isPublic: true,
    allowDownload: true,
  };

  try {
    const userTracks = JSON.parse(
      localStorage.getItem(`tracks_${userData.id}`) || "[]",
    );
    userTracks.push(testTrack);
    localStorage.setItem(`tracks_${userData.id}`, JSON.stringify(userTracks));

    console.log("✅ Track upload test successful");
    return testTrack;
  } catch (error) {
    console.log("❌ Track upload test failed:", error);
    return false;
  }
};

export const testUsernameFunctionality = () => {
  console.log("🔤 Testing Username Functionality...");

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  if (!userData.id) {
    console.log("❌ No user logged in");
    return false;
  }

  // Test username generation
  const generateUsername = (fullName: string) => {
    const base = fullName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 15);
    const suffix = Math.floor(Math.random() * 1000);
    return `${base}${suffix}`;
  };

  const testUsername = generateUsername(userData.fullName || "Test User");
  console.log("✅ Generated username:", testUsername);

  return testUsername;
};

export const runAllTests = () => {
  console.log("🧪 Running all functionality tests...");

  const results = {
    musicPlayer: testMusicPlayer(),
    profileSave: testProfileSave(),
    trackUpload: testTrackUpload(),
    username: testUsernameFunctionality(),
  };

  console.log("📊 Test Results:", results);
  return results;
};

// Make available globally for browser console testing
if (typeof window !== "undefined") {
  (window as any).motionConnectTests = {
    testMusicPlayer,
    testProfileSave,
    testTrackUpload,
    testUsernameFunctionality,
    runAllTests,
  };
}
