import {} from "firebase/firestore";
import app from ".";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const storage = getStorage(app);

export async function uploadFile(userId: string, file: any) {
  if (file) {
    if (file.size < 1048576) {
      const newName = "profile." + file.name.split(".")[1];
      console.log(newName);
      const storageRef = ref(storage, `images/users/${userId}/${newName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        () => {
          console.log("error");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: any) => {
            console.log(downloadURL);
          });
        }
      );
    } else {
      return false;
    }
  }
  return true;
}
