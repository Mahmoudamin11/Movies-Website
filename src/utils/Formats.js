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

export const formatAge = (dateString) => {
    const date = new Date(dateString);

    if (isNaN(date)) {
        return 'Invalid date';
    }

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    let age = new Date().getFullYear() - year;
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();

    // Adjust age if the birthday hasn't occurred yet this year
    if (currentMonth < date.getMonth() || (currentMonth === date.getMonth() && currentDay < day)) {
        age--;
    }

    return `${month} ${day}, ${year} (${age} years old)`;
};


const languageMap = {
    en: 'English',
    fr: 'French',
    es: 'Spanish',
    ar: 'Arabic'
};

export const formatLanguage = (languageCode) => {
    return languageMap[languageCode] || 'Unknown';
};

export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) {
        return 'N/A';
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

