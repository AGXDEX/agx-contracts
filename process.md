0.add .env file, update private key
1.yarn install
2.change conig admin address
2.deploy position utils (change hardhat config)
3.deploy staker v3(change deployment json)
2.yarn hardhat run deploy/deploy.ts
3.yarn hardhat run deploy/configToken.ts
4.yarn hardhat run deploy/staker/createIncentive.ts
5.git add . 
6.git commit -m "update" 
7.git push