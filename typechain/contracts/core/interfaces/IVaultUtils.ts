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
} from "../../../common";

export interface IVaultUtilsInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "getBuyUsdgFeeBasisPoints"
      | "getEntryFundingRate"
      | "getFeeBasisPoints"
      | "getFundingFee"
      | "getPositionFee"
      | "getSellUsdgFeeBasisPoints"
      | "getSwapFeeBasisPoints"
      | "updateCumulativeFundingRate"
      | "validateDecreasePosition"
      | "validateIncreasePosition"
      | "validateLiquidation"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getBuyUsdgFeeBasisPoints",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getEntryFundingRate",
    values: [AddressLike, AddressLike, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "getFeeBasisPoints",
    values: [AddressLike, BigNumberish, BigNumberish, BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "getFundingFee",
    values: [
      AddressLike,
      AddressLike,
      AddressLike,
      boolean,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getPositionFee",
    values: [AddressLike, AddressLike, AddressLike, boolean, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getSellUsdgFeeBasisPoints",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getSwapFeeBasisPoints",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "updateCumulativeFundingRate",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "validateDecreasePosition",
    values: [
      AddressLike,
      AddressLike,
      AddressLike,
      BigNumberish,
      BigNumberish,
      boolean,
      AddressLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "validateIncreasePosition",
    values: [AddressLike, AddressLike, AddressLike, BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "validateLiquidation",
    values: [AddressLike, AddressLike, AddressLike, boolean, boolean]
  ): string;

  decodeFunctionResult(
    functionFragment: "getBuyUsdgFeeBasisPoints",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getEntryFundingRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFeeBasisPoints",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFundingFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPositionFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSellUsdgFeeBasisPoints",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSwapFeeBasisPoints",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateCumulativeFundingRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validateDecreasePosition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validateIncreasePosition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validateLiquidation",
    data: BytesLike
  ): Result;
}

export interface IVaultUtils extends BaseContract {
  connect(runner?: ContractRunner | null): IVaultUtils;
  waitForDeployment(): Promise<this>;

  interface: IVaultUtilsInterface;

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

  getBuyUsdgFeeBasisPoints: TypedContractMethod<
    [_token: AddressLike, _usdgAmount: BigNumberish],
    [bigint],
    "view"
  >;

  getEntryFundingRate: TypedContractMethod<
    [_collateralToken: AddressLike, _indexToken: AddressLike, _isLong: boolean],
    [bigint],
    "view"
  >;

  getFeeBasisPoints: TypedContractMethod<
    [
      _token: AddressLike,
      _usdgDelta: BigNumberish,
      _feeBasisPoints: BigNumberish,
      _taxBasisPoints: BigNumberish,
      _increment: boolean
    ],
    [bigint],
    "view"
  >;

  getFundingFee: TypedContractMethod<
    [
      _account: AddressLike,
      _collateralToken: AddressLike,
      _indexToken: AddressLike,
      _isLong: boolean,
      _size: BigNumberish,
      _entryFundingRate: BigNumberish
    ],
    [bigint],
    "view"
  >;

  getPositionFee: TypedContractMethod<
    [
      _account: AddressLike,
      _collateralToken: AddressLike,
      _indexToken: AddressLike,
      _isLong: boolean,
      _sizeDelta: BigNumberish
    ],
    [bigint],
    "view"
  >;

  getSellUsdgFeeBasisPoints: TypedContractMethod<
    [_token: AddressLike, _usdgAmount: BigNumberish],
    [bigint],
    "view"
  >;

  getSwapFeeBasisPoints: TypedContractMethod<
    [_tokenIn: AddressLike, _tokenOut: AddressLike, _usdgAmount: BigNumberish],
    [bigint],
    "view"
  >;

  updateCumulativeFundingRate: TypedContractMethod<
    [_collateralToken: AddressLike, _indexToken: AddressLike],
    [boolean],
    "nonpayable"
  >;

  validateDecreasePosition: TypedContractMethod<
    [
      _account: AddressLike,
      _collateralToken: AddressLike,
      _indexToken: AddressLike,
      _collateralDelta: BigNumberish,
      _sizeDelta: BigNumberish,
      _isLong: boolean,
      _receiver: AddressLike
    ],
    [void],
    "view"
  >;

  validateIncreasePosition: TypedContractMethod<
    [
      _account: AddressLike,
      _collateralToken: AddressLike,
      _indexToken: AddressLike,
      _sizeDelta: BigNumberish,
      _isLong: boolean
    ],
    [void],
    "view"
  >;

  validateLiquidation: TypedContractMethod<
    [
      _account: AddressLike,
      _collateralToken: AddressLike,
      _indexToken: AddressLike,
      _isLong: boolean,
      _raise: boolean
    ],
    [[bigint, bigint]],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getBuyUsdgFeeBasisPoints"
  ): TypedContractMethod<
    [_token: AddressLike, _usdgAmount: BigNumberish],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "getEntryFundingRate"
  ): TypedContractMethod<
    [_collateralToken: AddressLike, _indexToken: AddressLike, _isLong: boolean],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "getFeeBasisPoints"
  ): TypedContractMethod<
    [
      _token: AddressLike,
      _usdgDelta: BigNumberish,
      _feeBasisPoints: BigNumberish,
      _taxBasisPoints: BigNumberish,
      _increment: boolean
    ],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "getFundingFee"
  ): TypedContractMethod<
    [
      _account: AddressLike,
      _collateralToken: AddressLike,
      _indexToken: AddressLike,
      _isLong: boolean,
      _size: BigNumberish,
      _entryFundingRate: BigNumberish
    ],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "getPositionFee"
  ): TypedContractMethod<
    [
      _account: AddressLike,
      _collateralToken: AddressLike,
      _indexToken: AddressLike,
      _isLong: boolean,
      _sizeDelta: BigNumberish
    ],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "getSellUsdgFeeBasisPoints"
  ): TypedContractMethod<
    [_token: AddressLike, _usdgAmount: BigNumberish],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "getSwapFeeBasisPoints"
  ): TypedContractMethod<
    [_tokenIn: AddressLike, _tokenOut: AddressLike, _usdgAmount: BigNumberish],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "updateCumulativeFundingRate"
  ): TypedContractMethod<
    [_collateralToken: AddressLike, _indexToken: AddressLike],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "validateDecreasePosition"
  ): TypedContractMethod<
    [
      _account: AddressLike,
      _collateralToken: AddressLike,
      _indexToken: AddressLike,
      _collateralDelta: BigNumberish,
      _sizeDelta: BigNumberish,
      _isLong: boolean,
      _receiver: AddressLike
    ],
    [void],
    "view"
  >;
  getFunction(
    nameOrSignature: "validateIncreasePosition"
  ): TypedContractMethod<
    [
      _account: AddressLike,
      _collateralToken: AddressLike,
      _indexToken: AddressLike,
      _sizeDelta: BigNumberish,
      _isLong: boolean
    ],
    [void],
    "view"
  >;
  getFunction(
    nameOrSignature: "validateLiquidation"
  ): TypedContractMethod<
    [
      _account: AddressLike,
      _collateralToken: AddressLike,
      _indexToken: AddressLike,
      _isLong: boolean,
      _raise: boolean
    ],
    [[bigint, bigint]],
    "view"
  >;

  filters: {};
}
