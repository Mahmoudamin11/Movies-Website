import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export const storeRatingInFirebase = async (userId, movieId, rating) => {
    try {
        await setDoc(doc(db, "ratings", `${userId}_${movieId}`), {
            userId,
            movieId,
            rating,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Failed to store rating in Firebase:', error);
        throw error;
    }
};

export const getRatingFromFirebase = async (userId, movieId) => {
    try {
        const docRef = doc(db, "ratings", `${userId}_${movieId}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data().rating;
        } else {
            console.log("No such rating found!");
            return null;
        }
    } catch (error) {
        console.error('Failed to fetch rating from Firebase:', error);
        throw error;
    }
};

export const deleteRatingFromFirebase = async (userId, movieId) => {
    try {
        const docRef = doc(db, 'ratings', `${userId}_${movieId}`);
        await deleteDoc(docRef);
        console.log('Rating deleted successfully');
    } catch (error) {
        console.error('Failed to delete rating from Firebase:', error);
        throw error;
    }
};
