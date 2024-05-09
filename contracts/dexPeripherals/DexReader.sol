// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.6.12;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./interfaces/INonfungiblePositionManager.sol";

contract DexReader is OwnableUpgradeable{
    
    INonfungiblePositionManager public nonfungiblePositionManager;




    function initialize(uint256 _nonfungiblePositionManager) external initializer {
        __Ownable_init_unchained();
        nonfungiblePositionManager = INonfungiblePositionManager(_nonfungiblePositionManager);
    }

    function setNonfungiblePositionManager(address  _nonfungiblePositionManager) public {
        nonfungiblePositionManager = INonfungiblePositionManager(_nonfungiblePositionManager);
    }

    function getSpecificNftIds(uint256[] memory tokenIds, address token0, address token1) public view returns(uint256[] memory){
        uint256 totalToken = tokenIds.length;
        uint256[] memory eligibleIds = new uint256[](totalToken);
        uint256 eligibleLength = 0;
        for(uint256 i = 0; i < totalToken; i ++){
            (, , address pool_token0, address pool_token1, , , , , , , ,) =nonfungiblePositionManager.positions(tokenIds[i]);
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
}
