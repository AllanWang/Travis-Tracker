import {JsonConverter, JsonCustomConvert, JsonObject, JsonProperty} from "json2typescript";

declare type Slug = string

declare type DateTime = string

declare type TravisState = 'started' | 'passed' | 'errored' | 'failed' | 'canceled'

@JsonConverter
class TravisStateConverter implements JsonCustomConvert<TravisState> {
  deserialize(data: any): TravisState {
    switch (data) {
      case 'started':
      case 'passed':
      case 'errored':
      case 'failed':
      case 'canceled':
        return data;
    }
    throw new Error(`Bad travis state ${data}`)
  }

  serialize(data: TravisState): any {
    return data;
  }

}

class TravisBase {
  @JsonProperty('id', Number)
  id!: number;
  @JsonProperty('@href', String, true)
  href!: string;
}

/**
 * See https://developer.travis-ci.com/resource/user#User
 */
@JsonObject("User")
export class User extends TravisBase {
  @JsonProperty("name", String)
  name!: string;
  @JsonProperty("login", String)
  login!: string;
}

/**
 * See https://developer.travis-ci.com/resource/repository#Repository
 */
@JsonObject("Repository")
export class Repository extends TravisBase {
  @JsonProperty("name", String)
  name!: string;
  @JsonProperty("slug", String)
  slug!: Slug;
  @JsonProperty("github_id", Number)
  githubId?: number;
  @JsonProperty("github_language", String, true)
  githubLanguage?: string;
  @JsonProperty("owner", User)
  owner!: User;
  @JsonProperty("active", Boolean, true)
  active?: boolean;
  @JsonProperty("active_on_org", Boolean, true)
  activeOnOrg?: boolean;
}

/**
 * See https://developer.travis-ci.com/resource/repositories#Repositories
 */
@JsonObject("Repositories")
export class Repositories {
  @JsonProperty("repositories", [Repository])
  repositories!: Repository[]
}

/**
 * See https://developer.travis-ci.com/resource/branch#Branch
 */
@JsonObject("Branch")
export class Branch extends TravisBase {
  @JsonProperty("name", String)
  name!: string;
}

@JsonObject("Commit")
export class Commit extends TravisBase {
  @JsonProperty("sha", String)
  sha!: string;
  @JsonProperty("ref", String)
  ref!: string;
  @JsonProperty("message", String, true)
  message?: string;
  @JsonProperty("compare_url", String)
  compareUrl!: string;
  @JsonProperty("committed_at", String)
  committedAt!: DateTime;
}

@JsonObject("Build")
export class Build extends TravisBase {
  @JsonProperty("number", String)
  number!: string;
  @JsonProperty("state", TravisStateConverter, true)
  state?: TravisState;
  @JsonProperty("duration", Number, true)
  duration?: number;
  @JsonProperty("event_type", String, true)
  eventType?: string;
  @JsonProperty("previous_state", TravisStateConverter, true)
  previousState?: TravisState;
  @JsonProperty("pull_request_title", String, true)
  pullRequestTitle?: string;
  @JsonProperty("pull_request_number", String, true)
  pullRequestNumber?: string;
  @JsonProperty("started_at", String, true)
  startedAt?: DateTime;
  @JsonProperty("finished_at", String, true)
  finished_at?: DateTime;
  @JsonProperty("private", Boolean)
  private!: boolean;
  @JsonProperty("repository", Repository)
  repository!: Repository;
  @JsonProperty("branch", Branch)
  branch!: Branch;
  @JsonProperty("tag", String)
  tag?: string;
  @JsonProperty("commit", Commit)
  commit!: Commit;
  @JsonProperty("created_by", User)
  createdBy!: User;
  @JsonProperty("updated_at", String)
  updatedAt!: DateTime
}

