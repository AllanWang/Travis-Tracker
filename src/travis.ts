import {Builds, Repositories, Repository, Slug} from "./travis-api";
import {JsonConvert} from "json2typescript";

const jsonConvert = new JsonConvert();

/**
 * For testing, see https://developer.travis-ci.com/explore/#explorer
 */
async function travisFetch<T>(segment: string,
                              init: RequestInit | string,
                              handler: (d: any) => T | null | Promise<T | null>,
                              log?: boolean): Promise<T | null> {
  const initPart = typeof init === 'string' ? {method: init} : init;
  const response = await fetch(`https://api.travis-ci.com/${segment}`, {
    ...initPart,
    headers: {
      'Travis-API-Version': '3'
    }
  });
  const json = await response.json();
  if (log) {
    console.log(json)
  }
  if (!response.ok) {
    return Promise.reject({err: json, status: response.status})
  }
  return handler(json);
}

export const travisRepo = async (slug: Slug): Promise<Repository | null> =>
  travisFetch(`repo/${encodeURIComponent(slug)}`, 'GET',
    d => jsonConvert.deserializeObject(d, Repository));

export const travisRepos = async (owner: string): Promise<Repositories | null> =>
  travisFetch(`owner/${owner}/repos?sort_by=default_branch.last_build:desc&limit=100`, 'GET',
    d => jsonConvert.deserializeObject(d, Repositories));

export const travisBuilds = async (slug: Slug): Promise<Builds | null> =>
  travisFetch(`repo/${encodeURIComponent(slug)}/builds?limit=1`, 'GET',
    d => jsonConvert.deserializeObject(d, Builds));
