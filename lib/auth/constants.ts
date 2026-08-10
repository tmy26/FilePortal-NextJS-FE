export const ACCESS_TOKEN_COOKIE = "fp_access";
export const REFRESH_TOKEN_COOKIE = "fp_refresh";

/** Set by proxy after token refresh so the layout can read it in the same request. */
export const REFRESHED_ACCESS_HEADER = "x-fp-access-token";

/** Access JWT cookie retention (JWT `exp` still governs validity). */
export const ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24;

/** Refresh tokens from the API expire after 1 day. */
export const REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24;
