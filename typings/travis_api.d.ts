declare type Slug = string

declare type DateTime = Date

declare type TravisState = 'started' | 'passed' | 'errored' | 'failed' | 'canceled'

type TravisBase = {
  id: number,
  '@href': string
}

declare type Repository = {
  name: string
  slug: Slug
  github_id?: number
  github_language?: string
  owner?: User
  active?: boolean
  s: string
  active_on_org?: boolean
} & TravisBase

declare type User = {
  login: string
} & TravisBase

declare type Branch = TravisBase

declare type Build = {
  number: string
  state?: TravisState
  duration?: number
  event_type?: string
  previous_state?: TravisState
  pull_request_title?: string
  pull_request_number?: string
  started_at?: DateTime
  finished_at?: DateTime
  private: boolean
  repository: Repository
  branch: Branch
  tag?: string
  commit: Commit
  created_by: User
  updated_at: DateTime
} & TravisBase

declare type Commit = {
  sha: string
  ref: string
  message?: string
  compare_url: string
  committed_at: DateTime
} & TravisBase
