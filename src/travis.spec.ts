import {travisRepos} from "./travis";
import * as util from "util";

test('travis repos', async () => {
  const s = await travisRepos('AllanWang');
  console.log(util.inspect(s, {depth: null}))
});
