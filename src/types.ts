import type { InferSelectModel } from 'drizzle-orm';

import type { definitions } from './server/db/schema';

export type Definition = InferSelectModel<typeof definitions>;

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

export type GitHubEmailsResponse = {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: 'public' | 'private' | null;
}[];
