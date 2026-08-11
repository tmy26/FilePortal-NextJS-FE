export const ACCESS_TOKEN_COOKIE = "fp_access";
export const REFRESH_TOKEN_COOKIE = "fp_refresh";
/** Unix seconds when the opaque access token expires (from BE `access_expires_at`). */
export const ACCESS_EXPIRES_AT_COOKIE = "fp_access_exp";

/** Set by proxy after token refresh so the layout can read it in the same request. */
export const REFRESHED_ACCESS_HEADER = "x-fp-access-token";

/**
 * Cookie retention for access + expiry metadata. Crypto lifetime is still BE’s
 * short access TTL; the proxy refreshes using ``fp_access_exp``.
 */
export const ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24;

/** Refresh tokens from the API expire after 1 day. */
export const REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24;
