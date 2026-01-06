import { initializeApp, getApps, getApp } from "firebase/app"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"

const env = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

export const isFirebaseConfigured = Boolean(
    env.apiKey &&
    env.authDomain &&
    env.projectId &&
    env.storageBucket &&
    env.messagingSenderId &&
    env.appId &&
    env.apiKey !== "YOUR_API_KEY"
)

const firebaseConfig = {
    apiKey: env.apiKey || "YOUR_API_KEY",
    authDomain: env.authDomain || "your-project.firebaseapp.com",
    projectId: env.projectId || "your-project-id",
    storageBucket: env.storageBucket || "your-project.appspot.com",
    messagingSenderId: env.messagingSenderId || "your-sender-id",
    appId: env.appId || "your-app-id",
    measurementId: env.measurementId
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const storage = getStorage(app)

export { storage }

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param file The file to upload
 * @param path The path in storage (e.g., 'images/hero-bg.jpg')
 * @returns Promise resolving to the download URL
 */
export async function uploadImage(file: File, path: string): Promise<string> {
    if (!file) throw new Error("No file service provided");

    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
            },
            (error) => {
                // Handle unsuccessful uploads
                console.error("Upload failed", error);
                reject(error);
            },
            () => {
                // Handle successful uploads on complete
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
}
