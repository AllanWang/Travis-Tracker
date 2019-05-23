import {Repositories} from "./travis_api";
import {JsonConvert} from "json2typescript";

const jsonConvert = new JsonConvert();

const travisCom = "https://api.travis-ci.com";

export const travisRepos = async (owner: string): Promise<Repositories> => fetch(`${travisCom}/owner/${owner}/repos`, {
  method: 'GET',
  headers: {
    'Travis-API-Version': '3'
  }
}).then(response => response.json())
  .then(data => jsonConvert.deserializeObject(data, Repositories));
