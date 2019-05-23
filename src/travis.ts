import {Builds, Repositories, Slug} from "./travis-api";
import {JsonConvert} from "json2typescript";

const jsonConvert = new JsonConvert();

const travisCom = "https://api.travis-ci.com";

const travisFetch = (segment: string, init?: RequestInit): Promise<any> => fetch(`${travisCom}/${segment}`, {
  ...init,
  headers: {
    'Travis-API-Version': '3',
    'Authorization': 'token JULutz8831jwTbJgfzRifQ'
  }
}).then(response => response.json())
  .then(s => {
    console.log(s);
    return s
  });


export const travisRepos = async (owner: string): Promise<Repositories | null> =>
  travisFetch(`owner/${owner}/repos?sort_by=active:desc,name&limit=100`, {
    method: 'GET'
  }).then(data => data.repositories ? jsonConvert.deserializeObject(data, Repositories) : null);

export const travisBuilds = async (slug: Slug): Promise<Builds | null> =>
  travisFetch(`repo/${encodeURIComponent(slug)}/builds?limit=1`, {
    method: 'GET'
  }).then(data => data.builds ? jsonConvert.deserializeObject(data, Builds) : null);
