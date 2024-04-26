import { deployContract } from "./utils";
// An example of a basic deploy script
// It will deploy a Greeter contract to selected network
// as well as verify it on Block Explorer if possible for the network
async function main() {
const gmx =  await deployContract("GMX");
await gmx.waitForDeployment();
console.log(await gmx.getAddress());


}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

