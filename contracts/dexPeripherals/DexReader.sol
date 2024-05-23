// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./interfaces/INonfungiblePositionManager.sol";
import "./interfaces/IV3Factory.sol";
import "./interfaces/IV3Staker.sol";
import "./TickMath.sol";

contract DexReader is OwnableUpgradeable{
    
    INonfungiblePositionManager public nonfungiblePositionManager;
    IV3Factory public v3Factory;
    IV3Staker public v3Staker;


    function initialize(address _nonfungiblePositionManager, address _v3Factory, address _v3Staker) external initializer {
        __Ownable_init_unchained();
        nonfungiblePositionManager = INonfungiblePositionManager(_nonfungiblePositionManager);
        v3Factory = IV3Factory(_v3Factory);
        v3Staker = IV3Staker(_v3Staker);
    }

    function setNonfungiblePositionManager(address  _nonfungiblePositionManager) public onlyOwner{
        nonfungiblePositionManager = INonfungiblePositionManager(_nonfungiblePositionManager);
    }

    function setV3Factory(address  _v3Factory) public onlyOwner{
        v3Factory = IV3Factory(_v3Factory);
    }

    function setV3Staker(address  _v3Staker) public onlyOwner {
        v3Staker = IV3Staker(_v3Staker);
    }

    function getRewardInfos(IV3Staker.IncentiveKey memory key, uint256[] memory tokenIds) public view returns(uint256[] memory ){
        uint256 totalToken = tokenIds.length;
        uint256[] memory rewards = new uint256[](totalToken);
        for(uint256 i = 0; i < totalToken; i ++){
            (uint256 reward, ) = v3Staker.getRewardInfo(key, tokenIds[i]);
            rewards[i] = reward;
        }
        return rewards;
    }



    function getSpecificNftIds(uint256[] memory tokenIds, address token0, address token1) public view returns(uint256[] memory){
        uint256 totalToken = tokenIds.length;
        uint256[] memory eligibleIds = new uint256[](totalToken);
        uint256 eligibleLength = 0;
        for(uint256 i = 0; i < totalToken; i ++){
            (, , address pool_token0, address pool_token1, uint24 fee, int24 tickLower, int24 tickUpper, , , , ,) =nonfungiblePositionManager.positions(tokenIds[i]);
            if(fee != 10000){
                continue;
            }

            int24 tickSpacing = v3Factory.feeAmountTickSpacing(fee);

            int24 maxTick = TickMath.MAX_TICK - (TickMath.MAX_TICK % tickSpacing);
            if (tickUpper < maxTick || tickLower > -maxTick){
                continue;
            }
            if((token0 == pool_token0 && token1 == pool_token1 )|| (token1 == pool_token0 && token0 == pool_token1)){
                eligibleIds[eligibleLength] = tokenIds[i];
                eligibleLength++;
            }
        }
        if (eligibleLength < totalToken) {
            assembly {
                mstore(eligibleIds, eligibleLength)
            }
        }
        return eligibleIds;
    }

    function getTokenURIs(uint256[] memory _tokenIds) public view returns(string[] memory, uint256[] memory){
        uint256 totalToken = _tokenIds.length;
        string[] memory tokenURIs =  new string[](totalToken);
        for(uint256 i = 0; i < totalToken; i ++){
            tokenURIs[i] = nonfungiblePositionManager.tokenURI(_tokenIds[i]);
        }
        return (tokenURIs, _tokenIds);
    }

    function getTokenStaked(uint256[] memory _tokenIds, address _token0) public view  returns(uint256){
        uint256 totalStakedAmount = 0;
        for(uint256 i = 0; i < _tokenIds.length; i++){
            (, , address pool_token0, address pool_token1, , , , , , , uint256 token0Owed, uint256 token1Owed) =nonfungiblePositionManager.positions(_tokenIds[i]);
           if(_token0 == pool_token0){
               totalStakedAmount += token0Owed;
           } else if(_token0 == pool_token1){
               totalStakedAmount += token1Owed;
           }
        }
        return totalStakedAmount;
    }
}
