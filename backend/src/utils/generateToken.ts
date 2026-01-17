import jwt from "jsonwebtoken";

// Ensure secrets are configured - throw error if not set
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === "secret") {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET must be set in production environment");
    }
    console.warn("⚠️ WARNING: Using default JWT_SECRET. Set JWT_SECRET in .env for production.");
    return "dev_secret_key_change_in_production";
  }
  return secret;
};

const getJwtRefreshSecret = (): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret || secret === "refresh_secret") {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_REFRESH_SECRET must be set in production environment");
    }
    console.warn("⚠️ WARNING: Using default JWT_REFRESH_SECRET. Set JWT_REFRESH_SECRET in .env for production.");
    return "dev_refresh_secret_change_in_production";
  }
  return secret;
};

interface TokenPayload {
  id: string;
  role?: string;
  tokenVersion?: number;
}

export const generateAccessToken = (
  id: string,
  role?: string,
  tokenVersion?: number
): string => {
  const payload: TokenPayload = { id };
  if (role) payload.role = role;
  if (tokenVersion !== undefined) payload.tokenVersion = tokenVersion;

  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: (process.env.JWT_ACCESS_EXPIRE || "15m") as string,
  } as jwt.SignOptions);
};

export const generateRefreshToken = (
  id: string,
  tokenVersion?: number
): string => {
  const payload: TokenPayload = { id };
  if (tokenVersion !== undefined) payload.tokenVersion = tokenVersion;

  return jwt.sign(payload, getJwtRefreshSecret(), {
    expiresIn: (process.env.JWT_REFRESH_EXPIRE || "7d") as string,
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, getJwtSecret()) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, getJwtRefreshSecret()) as TokenPayload;
};

const generateToken = (id: string) => {
  return generateAccessToken(id);
};

export default generateToken;
