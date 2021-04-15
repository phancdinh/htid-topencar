import React, { useEffect, useState, useRef } from "react";
import { sendAuthorizationRequest, sendTokenRequest } from "../actions/sign-in";
import { dispatchLogout } from "../actions/sign-out";
import {
    isValidSession,
    getAllSessionParameters,
    decodeIdToken,
    getCodeVerifier,
    setCodeVerifier,
} from "../actions/session";
import getPKCE from "../actions/pkce";
import { FINTECH_CONFIG, CONFIG } from "../config";
import car1 from "../img/car1.jpg";
import car2 from "../img/car2.jpg";
import car3 from "../img/car3.jpg";
import fin1 from "../img/icon-flash-blue.png";
import fin2 from "../img/icon-flash-red.png";
import AuthenUser from "./AuthenUser";
import bg from "../img/car-detail.jpg";
import { fetchUserProfile as fetchUserProfileApi, generateToken } from "../actions/profile";

export const carList = [
    {
        id: 1,
        img: car1,
    },
    {
        id: 2,
        img: car2,
    },
    {
        id: 3,
        img: car3,
    },
];

export default function Car() {
    const pkcePair = useRef(getPKCE());

    const [profile, setProfile] = useState({});
    const [showDialog, setShowDialog] = useState(false);

    const [state, setState] = useState({
        idToken: {},
        tokenResponse: {},
        isLoggedIn: false,
        profile: {},
    });

    const isSessionValid = isValidSession();

    useEffect(updateCodeVerifier, []);

    useEffect(() => {
        if (isSessionValid) {
            const session = getAllSessionParameters();

            const _tokenResponse = {
                access_token: session.ACCESS_TOKEN,
                refresh_token: session.REFRESH_TOKEN,
                scope: session.SCOPE,
                id_token: session.ID_TOKEN,
                token_type: session.TOKEN_TYPE,
                expires_in: parseInt(session.EXPIRES_IN),
            };

            const idToken = decodeIdToken(session.ID_TOKEN);

            setState({
                idToken,
                tokenResponse: _tokenResponse,
                isLoggedIn: true,
            });

            fetchUserProfile(idToken.ht_id, session.ACCESS_TOKEN);
        } else {
            handleRequestToken();
        }
    }, [isSessionValid]);

    function handleRequestToken() {
        const code = new URL(window.location.href).searchParams.get("code");
        if (isSessionValid || !code) {
            return;
        }

        const codeVerifier = getCodeVerifier();
        sendTokenRequest(code, codeVerifier)
            .then((response) => {
                console.log("TOKEN REQUEST SUCCESS", response);
                setState({
                    tokenResponse: response[0],
                    idToken: response[1],
                    isLoggedIn: true,
                });
            })
            .catch((error) => {
                console.log("TOKEN REQUEST ERROR", error);
                setState({ isLoggedIn: false });
            });
    }

    // set Code Verifier to cookies
    function updateCodeVerifier() {
        const codeVerifier = getCodeVerifier();
        const code = new URL(window.location.href).searchParams.get("code");

        if (!code || !codeVerifier) {
            setCodeVerifier(pkcePair.current.codeVerifier);
        }
    }

    async function fetchUserProfile(ht_id, accessToken) {
        const apimAccessToken = await generateToken();
        const profile = await fetchUserProfileApi(ht_id, accessToken, apimAccessToken);
        if (profile) {
            setProfile(profile);
        }
    }

    function handleLoginBtnClick() {
        sendAuthorizationRequest(pkcePair.current.codeChallenge);
    }

    function handleSignUpBtnClick() {
        window.open("https://app-profile-dev.hungthinhcorp.com.vn/account/register", "_blank");
    }

    function handleLogoutBtnClick() {
        dispatchLogout();
    }

    function closeDialog() {
        setShowDialog(false);
    }
    function showDialogHandle() {
        setTimeout(() => {
            setShowDialog(true);
        }, 5000);
    }

    const fintechUrl = `${CONFIG.AUTHORIZE_ENDPOINT}?response_type=${CONFIG.RESPONSE_TYPE}&scope=${CONFIG.SCOPE}&redirect_uri=${FINTECH_CONFIG.REDIRECT_URI}&client_id=${FINTECH_CONFIG.CLIENT_ID}`;

    const authenUser = AuthenUser(profile, handleLogoutBtnClick);

    return (
        <div className="home-container car">
            {state.isLoggedIn || true ? (
                <>
                    <img src={bg} className="bg" alt="" />
                    {authenUser}
                    {profile && (
                        <div className="container">
                            <div className="click-to-show" onClick={showDialogHandle} />

                            <a
                                href={fintechUrl}
                                id="go-to-fintech-btn"
                                className={`${showDialog ? "show" : ""}`}
                                target="_blank"
                                title="fintech"
                            >
                                <img className="bottom" src={fin1} />
                                <img className="top" src={fin2} />
                            </a>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="btn-wrapper">
                        <button className="btn-common float-right login" onClick={handleLoginBtnClick} />
                        <button
                            className="btn-common float-right mr-4 sign-up"
                            onClick={handleSignUpBtnClick}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
