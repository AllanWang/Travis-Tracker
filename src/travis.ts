import {Repositories} from "./travis-api";
import {JsonConvert} from "json2typescript";

const jsonConvert = new JsonConvert();

const travisCom = "https://api.travis-ci.com";

export const travisRepos = async (owner: string): Promise<Repositories | null> => fetch(`${travisCom}/owner/${owner}/repos`, {
  method: 'GET',
  headers: {
    'Travis-API-Version': '3'
  }
}).then(response => response.json())
  .then(data => data.repositories ? jsonConvert.deserializeObject(data, Repositories) : null);
