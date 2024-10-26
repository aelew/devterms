import type { InferSelectModel } from 'drizzle-orm';

import type { definitions } from './server/db/schema';

declare global {
  interface Window {
    Canny: (action: string, options?: Record<string, any>) => void;
  }
}

export type Timestamp = Date | number | string;

export type Definition = InferSelectModel<typeof definitions>;

export type ShareMedium =
  | 'X'
  | 'Reddit'
  | 'LinkedIn'
  | 'Facebook'
  | 'Email'
  | 'QR Code'
  | 'Direct';

export type User = {
  name: string;
  role: 'user' | 'bot' | 'moderator' | 'owner';
  email: string;
  avatar: string;
  githubId: number;
  createdAt: Date;
};

export type Events = {
  Login: never;
  Search: never;
  Share: { Medium: ShareMedium };
  Report: { 'Definition ID': string };
  'Submit definition': never;
  "I'm feeling lucky": never;
};

export type GitHubUserResponse = {
  id: number;
  login: string;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  name: string;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
};

export type GitHubEmailListResponse = {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: 'public' | 'private' | null;
}[];

export type DefinitionHit = {
  id: string;
  term: string;
  definition: string;
  example: string;
};
