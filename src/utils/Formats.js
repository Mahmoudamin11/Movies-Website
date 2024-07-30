export const getCertification = (release_dates) => {
    if (!release_dates || !release_dates.results) return 'Not Rated';
    const usRelease = release_dates.results.find((country) => country.iso_3166_1 === 'US');
    if (!usRelease || !usRelease.release_dates || usRelease.release_dates.length === 0) return 'Not Rated';
    const certification = usRelease.release_dates[0].certification;
    return certification || 'Not Rated';
};

export const formatGenres = (genres) => {
    if (!genres || genres.length === 0) return 'Unknown';
    return genres.map((genre) => genre.name).join(', ');
};

export const formatRuntime = (runtime) => {
    if (!runtime) return 'Unknown';
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
};

export const formatDate = (date) => {
    if (!date) return 'Unknown';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options);
};
