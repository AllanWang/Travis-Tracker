import {travisRepos} from "./travis";

test('test', async () => {
  const s = await travisRepos('AllanWang');
  console.log(s)
});
