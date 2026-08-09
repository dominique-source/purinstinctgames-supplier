import { ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadDataUrl(path: string, dataUrl: string): Promise<string> {
  if (!storage) throw new Error("Firebase Storage is not configured");
  const fileRef = ref(storage, path);
  await uploadString(fileRef, dataUrl, "data_url");
  return getDownloadURL(fileRef);
}

export async function deleteIfExists(path: string): Promise<void> {
  if (!storage) return;
  try {
    await deleteObject(ref(storage, path));
  } catch {
    // Object may not exist — safe to ignore.
  }
}
