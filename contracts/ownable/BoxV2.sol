// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Box.sol";

contract BoxV2 is Box {
    function version() public pure override returns (string memory) {
        return "2.0.0";
    }
}
