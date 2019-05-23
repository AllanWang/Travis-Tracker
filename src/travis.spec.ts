import {travisBuilds, travisRepos} from "./travis";
import * as util from "util";

test('travis repos', async () => {
  const s = await travisRepos('AllanWang');
  console.log(util.inspect(s, {depth: null}))
});

test('travis builds', async () => {
  const s = await travisBuilds('AllanWang/KAU');
  console.log(util.inspect(s, {depth: null}))
});
