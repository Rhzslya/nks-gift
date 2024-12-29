import {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from ".";

const storage = getStorage(app);

export async function uploadFile(
  userId: string,
  file: File,
  progressCallback: (progress: number) => void
): Promise<string | false> {
  if (!file) return false;

  if (file.size >= 1048576) {
    // File lebih dari 1MB
    return false;
  }

  const newName = `profile.${file.name.split(".").pop()}`;
  const userFolderRef = ref(storage, `images/users/${userId}/`);

  // List all files in the user's folder and delete the old profile picture
  const files = await listAll(userFolderRef);
  for (const item of files.items) {
    await deleteObject(item);
  }

  const storageRef = ref(storage, `images/users/${userId}/${newName}`);
  try {
    const uploadTask = uploadBytesResumable(storageRef, file);

    return await new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressCallback(progress);
        },
        (error) => {
          reject(`Upload failed: ${error.message}`);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error("Error uploading file", error);
    return false;
  }
}

export async function uploadProductImage(
  productId: string,
  file: File,
  progressCallback: (progress: number) => void
): Promise<string | false> {
  if (!file) return false;

  if (file.size >= 1048576) {
    return false;
  }

  const newName = `product.${file.name.split(".").pop()}`;
  const productFolderRef = ref(storage, `images/products/${productId}/`);

  const files = await listAll(productFolderRef);
  console.log(file);
  for (const item of files.items) {
    await deleteObject(item);
  }

  const storageRef = ref(storage, `images/products/${productId}/${newName}`);
  try {
    const uploadTask = uploadBytesResumable(storageRef, file);

    return await new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressCallback(progress);
        },
        (error) => {
          reject(`Upload failed: ${error.message}`);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error("Error uploading product image", error);
    return false;
  }
}

export async function deleteFile(id: string, type: string): Promise<void> {
  try {
    const userFolderRef = ref(storage, `images/${type}s/${id}/`);

    // List all files in the user's folder
    const files = await listAll(userFolderRef);

    // Delete each file in the folder
    for (const fileRef of files.items) {
      await deleteObject(fileRef);
    }
  } catch (error) {
    console.error("Error deleting file(s): ", error);
  }
}
