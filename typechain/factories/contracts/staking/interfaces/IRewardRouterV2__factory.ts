/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IRewardRouterV2,
  IRewardRouterV2Interface,
} from "../../../../contracts/staking/interfaces/IRewardRouterV2";

const _abi = [
  {
    inputs: [],
    name: "feeGlpTracker",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "stakedGlpTracker",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IRewardRouterV2__factory {
  static readonly abi = _abi;
  static createInterface(): IRewardRouterV2Interface {
    return new Interface(_abi) as IRewardRouterV2Interface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IRewardRouterV2 {
    return new Contract(address, _abi, runner) as unknown as IRewardRouterV2;
  }
}
