export const travisCom = "https://api.travis-ci.com";

export const travisRepos = async (owner: string): Promise<Repository> => fetch(`${travisCom}/owner/${owner}/repos`, {
  method: 'GET',
  headers: {
    'Travis-API-Version': '3'
  }
}).then(response => response.json() as Promise<Repository>);
