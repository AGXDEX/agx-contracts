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
  AddressLike,
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
} from "../../common";

export interface EsGmxBatchSenderInterface extends Interface {
  getFunction(nameOrSignature: "admin" | "esGmx" | "send"): FunctionFragment;

  encodeFunctionData(functionFragment: "admin", values?: undefined): string;
  encodeFunctionData(functionFragment: "esGmx", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "send",
    values: [AddressLike, BigNumberish, AddressLike[], BigNumberish[]]
  ): string;

  decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "esGmx", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "send", data: BytesLike): Result;
}

export interface EsGmxBatchSender extends BaseContract {
  connect(runner?: ContractRunner | null): EsGmxBatchSender;
  waitForDeployment(): Promise<this>;

  interface: EsGmxBatchSenderInterface;

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

  admin: TypedContractMethod<[], [string], "view">;

  esGmx: TypedContractMethod<[], [string], "view">;

  send: TypedContractMethod<
    [
      _vester: AddressLike,
      _minRatio: BigNumberish,
      _accounts: AddressLike[],
      _amounts: BigNumberish[]
    ],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "admin"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "esGmx"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "send"
  ): TypedContractMethod<
    [
      _vester: AddressLike,
      _minRatio: BigNumberish,
      _accounts: AddressLike[],
      _amounts: BigNumberish[]
    ],
    [void],
    "nonpayable"
  >;

  filters: {};
}
