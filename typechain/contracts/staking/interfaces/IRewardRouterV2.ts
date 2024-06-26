/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../../common";

export interface IRewardRouterV2Interface extends Interface {
  getFunction(
    nameOrSignature: "feeGlpTracker" | "stakedGlpTracker"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "feeGlpTracker",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "stakedGlpTracker",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "feeGlpTracker",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "stakedGlpTracker",
    data: BytesLike
  ): Result;
}

export interface IRewardRouterV2 extends BaseContract {
  connect(runner?: ContractRunner | null): IRewardRouterV2;
  waitForDeployment(): Promise<this>;

  interface: IRewardRouterV2Interface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  feeGlpTracker: TypedContractMethod<[], [string], "view">;

  stakedGlpTracker: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "feeGlpTracker"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "stakedGlpTracker"
  ): TypedContractMethod<[], [string], "view">;

  filters: {};
}
