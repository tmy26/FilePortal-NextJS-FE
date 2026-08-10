export type UserCreate = {
  username: string;
  email: string;
  password: string;
  retype_password: string;
  first_name: string | null;
  last_name: string | null;
  telephone_number: string | null;
  country: string | null;
};

/** Raw register form values (phone is national digits, not E.164). */
export type CreateUserFormValues = {
  username: string;
  email: string;
  password: string;
  retype_password: string;
  first_name: string;
  last_name: string;
  country: string;
  phone: string;
  phoneCountry: string;
  acceptTerms: boolean;
};

export type UserRead = {
  uuid: string;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  telephone_number: string | null;
  country: string | null;
  is_active: boolean;
  tuning_points: number;
  created: string;
  modified: string | null;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthTokens = {
  access: string;
  refresh: string;
};

export type LoginResponse = {
  token: AuthTokens;
  user: UserRead;
};
