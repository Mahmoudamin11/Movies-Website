import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export const saveReviewToFirebase = async (userId, movie, review) => {
    const reviewRef = doc(db, 'reviews', `${userId}_${movie.id}`);
    await setDoc(reviewRef, {
        userId,
        movie,
        review,
        timestamp: new Date().toISOString(),
    });
};

export const fetchReviewForMovie = async (userId, movieId) => {
    
    try {
        const docRef = doc(db, "reviews", `${userId}_${movieId}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error('Failed to fetch rating from Firebase:', error);
        throw error;
    }

};

export const deleteReviewForMovie = async (userId, movieId) => {
    try {
        const reviewRef = doc(db, 'reviews', `${userId}_${movieId}`);
        await deleteDoc(reviewRef);
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
};

export const fetchAllUserReviews = async (userId) => {
    try {
        const q = query(collection(db, "reviews"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const userReviews = [];
        querySnapshot.forEach((doc) => {
            userReviews.push(doc.data().movie);
        });

        return userReviews;
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        throw error;
    }
};
