export const redirectToTMDB = (requestToken) => {
    const baseURL = 'https://www.themoviedb.org/authenticate';
    const redirectTo = `${baseURL}/${requestToken}?redirect_to=http://localhost:5174/approved`; // Replace with your actual redirect URL
    window.location.href = redirectTo;
};
