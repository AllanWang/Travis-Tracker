import {Builds, Repositories, Slug} from "./travis-api";
import {JsonConvert} from "json2typescript";

const jsonConvert = new JsonConvert();

const travisCom = "https://api.travis-ci.com";

/**
 * For testing, see https://developer.travis-ci.com/explore/#explorer
 */
const travisFetch = (segment: string, init?: RequestInit, log?: boolean): Promise<any> => fetch(`${travisCom}/${segment}`, {
  ...init,
  headers: {
    'Travis-API-Version': '3'
  }
}).then(response => {
  const json = response.json();
  if (log) {
    console.log(json)
  }
  return json;
});

export const travisRepos = async (owner: string): Promise<Repositories | null> =>
  travisFetch(`owner/${owner}/repos?sort_by=default_branch.last_build:desc&limit=100`, {
    method: 'GET'
  }).then(data => data.repositories ? jsonConvert.deserializeObject(data, Repositories) : null);

export const travisBuilds = async (slug: Slug): Promise<Builds | null> =>
  travisFetch(`repo/${encodeURIComponent(slug)}/builds?limit=1`, {
    method: 'GET'
  }).then(data => data.builds ? jsonConvert.deserializeObject(data, Builds) : null);
