import React, { useEffect, useState, useRef } from "react";
import ReactJson from "react-json-view";
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
import { fetchUserProfile as fetchUserProfileApi, generateToken } from "../actions/profile";

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

    return (
        <div className="home-container">
            <div className="logo"></div>
            {/*<h1 className="ht-id">Hồ Tràm Complex</h1>*/}
            <br />
            {state.isLoggedIn ? (
                <>
                    <br />
                    <h2 className={"welcome"}>Chúc mừng đăng nhập thành công</h2>
                    <br />
                    {profile && (
                        <>
                            <h2>Xin chào, {profile.full_name}</h2>
                            <h3>HungThinh Id của bạn là {profile.ht_id}</h3>
                            <br />
                        </>
                    )}
                    <button className="btn btn-danger" onClick={handleLogoutBtnClick}>
                        Đăng Xuất
                    </button>
                </>
            ) : (
                <>
                    <button className="btn btn-primary float-right" onClick={handleLoginBtnClick}>
                        Đăng Nhập
                    </button>
                    <button className="btn btn-primary float-right mr-2" onClick={handleSignUpBtnClick}>
                        Đăng Ký
                    </button>
                </>
            )}
        </div>
    );
}
