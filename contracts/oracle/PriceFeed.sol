// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./interfaces/IPriceFeed.sol";



contract PriceFeed is IPriceFeed,OwnableUpgradeable {
    int256 public answer;
    uint80 public roundId;
    string public override description;
    address public override aggregator;

    uint256 public decimals;
    uint256 public heartBeat;
    uint256 public lastSetAnswerTime;

    mapping (uint80 => int256) public answers;
    mapping (address => bool) public isAdmin;




    function initialize(uint256 _heartBeat) external initializer {
        __Ownable_init_unchained();
        isAdmin[msg.sender] = true;
        heartBeat = _heartBeat;
        lastSetAnswerTime = block.timestamp;
    }

    function setAdmin(address _account, bool _isAdmin) public onlyOwner {
        isAdmin[_account] = _isAdmin;
    }

    function latestAnswer() public override view returns (int256) {
        require(block.timestamp < lastSetAnswerTime + (heartBeat / 10), "exceed max update delay");
        return answer;
    }

    function latestRound() public override view returns (uint80) {

        return roundId;
    }

    function setLatestAnswer(int256 _answer) public {
        require(isAdmin[msg.sender], "PriceFeed: forbidden");
        roundId = roundId + 1;
        answer = _answer;
        answers[roundId] = _answer;
        lastSetAnswerTime = block.timestamp;
    }

    // returns roundId, answer, startedAt, updatedAt, answeredInRound
    function getRoundData(uint80 _roundId) public override view
        returns (uint80, int256, uint256, uint256, uint80)
    {
        return (_roundId, answers[_roundId], 0, 0, 0);
    }
}
