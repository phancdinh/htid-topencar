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
import { Link } from "react-router-dom";
import getPKCE from "../actions/pkce";
import { FINTECH_CONFIG, CONFIG } from "../config";
import car1 from "../img/car1.jpg";
import car2 from "../img/car2.jpg";
import car3 from "../img/car3.jpg";
import car4 from "../img/car4.jpg";
import car5 from "../img/car5.jpg";
import car6 from "../img/car6.jpg";
import AuthenUser from "./AuthenUser";

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
    {
        id: 4,
        img: car4,
    },
    {
        id: 5,
        img: car5,
    },
    {
        id: 6,
        img: car6,
    },
];

export default function Home() {
    const pkcePair = useRef(getPKCE());

    const [profile, setProfile] = useState({});

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

    const authenUser = AuthenUser(profile, handleLogoutBtnClick);
    const carContent = carList.map((car, index) => {
        return (
            <div className="col-4 item-ht">
                <div>
                    <div className="img-wrap">
                        <Link to="/car">
                            <img className="img-fluid" src={car.img} />
                        </Link>
                    </div>
                </div>
            </div>
        );
    });
    return (
        <div className="home-container">
            {state.isLoggedIn ? (
                <>
                    {authenUser}
                    {profile && (
                        <div className="container main-content">
                            <div className="row">{carContent}</div>
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
