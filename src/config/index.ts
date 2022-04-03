type Configuration = {
    BASE_URL?: string;
    API_URL?: string;
};

export const APP_CONFIG: Configuration = {
    BASE_URL: process.env.REACT_APP_URL,
    API_URL: process.env.REACT_APP_API,
};
