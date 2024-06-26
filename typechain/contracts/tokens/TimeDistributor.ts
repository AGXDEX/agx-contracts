/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export interface TimeDistributorInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "DISTRIBUTION_INTERVAL"
      | "admin"
      | "distribute"
      | "getDistributionAmount"
      | "getIntervals"
      | "getRewardToken"
      | "gov"
      | "lastDistributionTime"
      | "rewardTokens"
      | "setDistribution"
      | "setGov"
      | "setTokensPerInterval"
      | "tokensPerInterval"
      | "updateLastDistributionTime"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "Distribute"
      | "DistributionChange"
      | "TokensPerIntervalChange"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "DISTRIBUTION_INTERVAL",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "admin", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "distribute",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getDistributionAmount",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getIntervals",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getRewardToken",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "gov", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "lastDistributionTime",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "rewardTokens",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setDistribution",
    values: [AddressLike[], BigNumberish[], AddressLike[]]
  ): string;
  encodeFunctionData(functionFragment: "setGov", values: [AddressLike]): string;
  encodeFunctionData(
    functionFragment: "setTokensPerInterval",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tokensPerInterval",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateLastDistributionTime",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "DISTRIBUTION_INTERVAL",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "distribute", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getDistributionAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getIntervals",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRewardToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "gov", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "lastDistributionTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDistribution",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setGov", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setTokensPerInterval",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokensPerInterval",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateLastDistributionTime",
    data: BytesLike
  ): Result;
}

export namespace DistributeEvent {
  export type InputTuple = [receiver: AddressLike, amount: BigNumberish];
  export type OutputTuple = [receiver: string, amount: bigint];
  export interface OutputObject {
    receiver: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DistributionChangeEvent {
  export type InputTuple = [
    receiver: AddressLike,
    amount: BigNumberish,
    rewardToken: AddressLike
  ];
  export type OutputTuple = [
    receiver: string,
    amount: bigint,
    rewardToken: string
  ];
  export interface OutputObject {
    receiver: string;
    amount: bigint;
    rewardToken: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TokensPerIntervalChangeEvent {
  export type InputTuple = [receiver: AddressLike, amount: BigNumberish];
  export type OutputTuple = [receiver: string, amount: bigint];
  export interface OutputObject {
    receiver: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface TimeDistributor extends BaseContract {
  connect(runner?: ContractRunner | null): TimeDistributor;
  waitForDeployment(): Promise<this>;

  interface: TimeDistributorInterface;

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

  DISTRIBUTION_INTERVAL: TypedContractMethod<[], [bigint], "view">;

  admin: TypedContractMethod<[], [string], "view">;

  distribute: TypedContractMethod<[], [bigint], "nonpayable">;

  getDistributionAmount: TypedContractMethod<
    [_receiver: AddressLike],
    [bigint],
    "view"
  >;

  getIntervals: TypedContractMethod<[_receiver: AddressLike], [bigint], "view">;

  getRewardToken: TypedContractMethod<
    [_receiver: AddressLike],
    [string],
    "view"
  >;

  gov: TypedContractMethod<[], [string], "view">;

  lastDistributionTime: TypedContractMethod<
    [arg0: AddressLike],
    [bigint],
    "view"
  >;

  rewardTokens: TypedContractMethod<[arg0: AddressLike], [string], "view">;

  setDistribution: TypedContractMethod<
    [
      _receivers: AddressLike[],
      _amounts: BigNumberish[],
      _rewardTokens: AddressLike[]
    ],
    [void],
    "nonpayable"
  >;

  setGov: TypedContractMethod<[_gov: AddressLike], [void], "nonpayable">;

  setTokensPerInterval: TypedContractMethod<
    [_receiver: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  tokensPerInterval: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  updateLastDistributionTime: TypedContractMethod<
    [_receiver: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "DISTRIBUTION_INTERVAL"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "admin"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "distribute"
  ): TypedContractMethod<[], [bigint], "nonpayable">;
  getFunction(
    nameOrSignature: "getDistributionAmount"
  ): TypedContractMethod<[_receiver: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "getIntervals"
  ): TypedContractMethod<[_receiver: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "getRewardToken"
  ): TypedContractMethod<[_receiver: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "gov"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "lastDistributionTime"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "rewardTokens"
  ): TypedContractMethod<[arg0: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "setDistribution"
  ): TypedContractMethod<
    [
      _receivers: AddressLike[],
      _amounts: BigNumberish[],
      _rewardTokens: AddressLike[]
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setGov"
  ): TypedContractMethod<[_gov: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setTokensPerInterval"
  ): TypedContractMethod<
    [_receiver: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "tokensPerInterval"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "updateLastDistributionTime"
  ): TypedContractMethod<[_receiver: AddressLike], [void], "nonpayable">;

  getEvent(
    key: "Distribute"
  ): TypedContractEvent<
    DistributeEvent.InputTuple,
    DistributeEvent.OutputTuple,
    DistributeEvent.OutputObject
  >;
  getEvent(
    key: "DistributionChange"
  ): TypedContractEvent<
    DistributionChangeEvent.InputTuple,
    DistributionChangeEvent.OutputTuple,
    DistributionChangeEvent.OutputObject
  >;
  getEvent(
    key: "TokensPerIntervalChange"
  ): TypedContractEvent<
    TokensPerIntervalChangeEvent.InputTuple,
    TokensPerIntervalChangeEvent.OutputTuple,
    TokensPerIntervalChangeEvent.OutputObject
  >;

  filters: {
    "Distribute(address,uint256)": TypedContractEvent<
      DistributeEvent.InputTuple,
      DistributeEvent.OutputTuple,
      DistributeEvent.OutputObject
    >;
    Distribute: TypedContractEvent<
      DistributeEvent.InputTuple,
      DistributeEvent.OutputTuple,
      DistributeEvent.OutputObject
    >;

    "DistributionChange(address,uint256,address)": TypedContractEvent<
      DistributionChangeEvent.InputTuple,
      DistributionChangeEvent.OutputTuple,
      DistributionChangeEvent.OutputObject
    >;
    DistributionChange: TypedContractEvent<
      DistributionChangeEvent.InputTuple,
      DistributionChangeEvent.OutputTuple,
      DistributionChangeEvent.OutputObject
    >;

    "TokensPerIntervalChange(address,uint256)": TypedContractEvent<
      TokensPerIntervalChangeEvent.InputTuple,
      TokensPerIntervalChangeEvent.OutputTuple,
      TokensPerIntervalChangeEvent.OutputObject
    >;
    TokensPerIntervalChange: TypedContractEvent<
      TokensPerIntervalChangeEvent.InputTuple,
      TokensPerIntervalChangeEvent.OutputTuple,
      TokensPerIntervalChangeEvent.OutputObject
    >;
  };
}
