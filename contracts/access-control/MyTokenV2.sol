// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MyToken.sol";

contract MyTokenV2 is MyToken {
  function version() public pure override returns (string memory) {
    return "2.0.0";
  }
}
