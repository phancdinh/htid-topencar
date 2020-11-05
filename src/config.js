const HOST = "https://htid.hungthinhcorp.com.vn";
const LOCAL_HOST = "https://localhost:9443";

export const CONFIG = {
    // endpoint to request authorization code
    AUTHORIZE_ENDPOINT: `${HOST}/oauth2/authorize`,

    // endpoint to request access token
    TOKEN_ENDPOINT: `${HOST}/oauth2/token`,

    LOGOUT_URL: `${HOST}/oidc/logout`,
    RESPONSE_TYPE: "code",
    SCOPE: "openid email",
    REDIRECT_URI: "https://localhost:9000/login",

    // id of 'Demo - SPA' Service Provider
    CLIENT_ID: "C7Uj0Civ7kH6S85tEzbKxttBj_oa",
    // secret of 'Demo - SPA' Service Provider
    CLIENT_SECRET: "vwUXB7scqHfbDXUH5f1WqlfwJcQa",

    GRANT_TYPE: "authorization_code",
    CLIENT_URL: `${HOST}:9000`,
    COOKIE_PATH: "/",

    // endpoint of User Profile service
    PROFILE_SERVICE_URL: "https://profile-demo-ht.herokuapp.com",

    APIM_URL: "https://htapi.hungthinhcorp.com.vn",
    // consumer key of API subscription on devportal
    APIM_ID: "RvY71oGbLJUGK9IPF5X25Vn93lwa",
    // consumer secret of API subscription on devportal
    APIM_SECRET: "TBuIw1I6D8wdTsJyoso3JVwORBca",
};
