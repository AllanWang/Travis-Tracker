import {JsonConverter, JsonCustomConvert, JsonObject, JsonProperty} from "json2typescript";
import StringUnion from "./string-union";

export type Slug = string

export const TravisState = StringUnion('started', 'passed', 'errored', 'failed', 'canceled');
export type TravisState = typeof TravisState.type;

@JsonConverter
class TravisStateConverter implements JsonCustomConvert<TravisState> {
  deserialize(data: any): TravisState {
    if (typeof data === 'string' && TravisState.guard(data)) {
      return data
    }
    throw new Error(`Bad travis state ${data}`)
  }

  serialize(data: TravisState): any {
    return data;
  }

}

@JsonConverter
class DateConverter implements JsonCustomConvert<Date> {
  deserialize(data: any): Date {
    if (typeof data === 'string') {
      return new Date(Date.parse(data));
    }
    throw new Error(`Bad date ${data}`)
  }

  serialize(data: Date): any {
    return data.toISOString()
  }

}

class TravisBase {
  @JsonProperty('id', Number)
  id!: number;
  @JsonProperty('@href', String, true)
  href?: string;
}

/**
 * See https://developer.travis-ci.com/resource/user#User
 */
@JsonObject("User")
export class User extends TravisBase {
  @JsonProperty("login", String)
  login!: string;
}

@JsonObject("RepositoryMinimal")
export class RepositoryMinimal extends TravisBase {
  @JsonProperty("name", String)
  name!: string;
  @JsonProperty("slug", String)
  slug!: Slug;
}

/**
 * See https://developer.travis-ci.com/resource/repository#Repository
 */
@JsonObject("Repository")
export class Repository extends RepositoryMinimal {
  @JsonProperty("github_id", Number, true)
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
  repositories!: Repository[];

  static fromSingle(repo: Repository): Repositories {
    const r = new Repositories();
    r.repositories = [repo];
    return r;
  }
}

/**
 * See https://developer.travis-ci.com/resource/branch#Branch
 */
@JsonObject("Branch")
export class Branch {
  @JsonProperty("name", String)
  name!: string;
}

/**
 * See https://developer.travis-ci.com/resource/commit#Commit
 */
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
  @JsonProperty("committed_at", DateConverter)
  committedAt!: Date;
}

/**
 * See https://developer.travis-ci.com/resource/build#Build
 */
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
  @JsonProperty("started_at", DateConverter, true)
  startedAt?: Date;
  @JsonProperty("finished_at", DateConverter, true)
  finishedAt?: Date;
  @JsonProperty("private", Boolean)
  private!: boolean;
  @JsonProperty("repository", RepositoryMinimal)
  repository!: RepositoryMinimal;
  @JsonProperty("branch", Branch)
  branch!: Branch;
  @JsonProperty("tag", String, true)
  tag?: string;
  @JsonProperty("commit", Commit)
  commit!: Commit;
  @JsonProperty("created_by", User)
  createdBy!: User;
  @JsonProperty("updated_at", DateConverter)
  updatedAt!: Date
}

@JsonObject("BuildInfo")
export class BuildInfo {
  @JsonProperty("build", Build)
  build!: Build;
  @JsonProperty("fetch_time", Number)
  fetchTime!: number;
}

/**
 * See https://developer.travis-ci.com/resource/builds#Builds
 */
@JsonObject("Builds")
export class Builds {
  @JsonProperty("builds", [Build])
  builds!: Build[]
}

export type TravisError = {
  error_type?: string
  error_message?: string
  resource_type?: string
}
