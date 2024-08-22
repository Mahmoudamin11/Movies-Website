import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";

const uploadImageToFirebase = async (file) => {
    if (!file) return;

    const storage = getStorage();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.error("No user is logged in.");
        return;
    }

    // Create a reference in Firebase Storage
    const storageRef = ref(storage, `profilePictures/${user.uid}/${file.name}`);

    try {
        // Upload the file to Firebase Storage
        const snapshot = await uploadBytes(storageRef, file);
        
        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Update the user's photoURL in Firebase Authentication
        await updateProfile(user, {
            photoURL: downloadURL,
        });

        console.log("User photoURL updated successfully!");

        // Optionally, return the download URL for further use
        return downloadURL;
    } catch (error) {
        console.error("Error uploading image and updating photoURL:", error);
    }
};
export default uploadImageToFirebase ;
