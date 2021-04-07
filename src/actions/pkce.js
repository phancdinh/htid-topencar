import crypto from "crypto";

function base64URLEncode(str) {
    return str.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function getVerifier() {
    return base64URLEncode(crypto.randomBytes(32));
}

function sha256(buffer) {
    return crypto.createHash("sha256").update(buffer).digest();
}

function getChallenge(verifier) {
    return base64URLEncode(sha256(verifier));
}

export default function getPKCE() {
    const codeVerifier = getVerifier();
    const codeChallenge = getChallenge(codeVerifier);

    return {
        codeVerifier,
        codeChallenge,
    };
}
