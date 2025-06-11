/**
 * Upload debugging utilities
 */

export const debugUploadIssues = () => {
  console.log("🔍 Upload Debug Information:");

  // Check user authentication
  const userData = localStorage.getItem("userData");
  if (!userData) {
    console.log("❌ No user data found - user not logged in");
    return false;
  }

  const user = JSON.parse(userData);
  console.log("✅ User authenticated:", user.fullName, user.id);

  // Check localStorage availability and space
  try {
    const testKey = "upload_test";
    const testData = "test".repeat(1000); // 4KB test
    localStorage.setItem(testKey, testData);
    localStorage.removeItem(testKey);
    console.log("✅ localStorage working");
  } catch (e) {
    console.log("❌ localStorage issue:", e);
    return false;
  }

  // Check existing tracks
  const userTracks = localStorage.getItem(`tracks_${user.id}`);
  const trackCount = userTracks ? JSON.parse(userTracks).length : 0;
  console.log(`📁 User has ${trackCount} existing tracks`);

  // Check storage usage
  let totalSize = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      totalSize += localStorage[key].length;
    }
  }
  console.log(
    `💾 localStorage usage: ${(totalSize / 1024 / 1024).toFixed(2)} MB`,
  );

  // Estimate available space
  try {
    const estimate = navigator.storage?.estimate?.();
    if (estimate) {
      estimate.then((quota) => {
        console.log(`📊 Storage quota: ${(quota.quota || 0) / 1024 / 1024} MB`);
        console.log(`📊 Storage used: ${(quota.usage || 0) / 1024 / 1024} MB`);
      });
    }
  } catch (e) {
    console.log("ℹ️ Storage API not available");
  }

  return true;
};

export const testFileUpload = (file: File) => {
  console.log("📁 Testing file upload for:", file.name);
  console.log("📏 File size:", (file.size / 1024 / 1024).toFixed(2), "MB");
  console.log("🎵 File type:", file.type);

  // Check file type
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
    console.log("❌ Invalid file type");
    return false;
  }

  // Check file size
  const maxSize = 25 * 1024 * 1024; // 25MB
  if (file.size > maxSize) {
    console.log("❌ File too large");
    return false;
  }

  console.log("✅ File validation passed");
  return true;
};

export const simulateUpload = async () => {
  console.log("🧪 Simulating upload process...");

  const debugResult = debugUploadIssues();
  if (!debugResult) {
    return false;
  }

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  // Create test track
  const testTrack = {
    id: "debug_" + Date.now(),
    userId: userData.id,
    title: "Debug Test Track",
    description: "Test upload for debugging",
    genre: "test",
    duration: 120,
    artist: userData.fullName,
    uploadDate: new Date().toISOString(),
    plays: 0,
    likes: 0,
    isPublic: false,
    allowDownload: false,
  };

  try {
    // Test saving to user tracks
    const userTracks = JSON.parse(
      localStorage.getItem(`tracks_${userData.id}`) || "[]",
    );
    userTracks.push(testTrack);
    localStorage.setItem(`tracks_${userData.id}`, JSON.stringify(userTracks));

    console.log("✅ Test track saved successfully");

    // Clean up test track
    const updatedTracks = userTracks.filter((t: any) => t.id !== testTrack.id);
    localStorage.setItem(
      `tracks_${userData.id}`,
      JSON.stringify(updatedTracks),
    );

    console.log("✅ Upload simulation successful");
    return true;
  } catch (error) {
    console.log("❌ Upload simulation failed:", error);
    return false;
  }
};

// Make available in browser console
if (typeof window !== "undefined") {
  (window as any).uploadDebugger = {
    debugUploadIssues,
    testFileUpload,
    simulateUpload,
  };
  console.log("🛠️ Upload debugger available: window.uploadDebugger");
}
