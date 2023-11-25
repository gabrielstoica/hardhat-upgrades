// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

abstract contract BoxStorageV1 {
    uint256 public foo;
}

abstract contract BoxStorage is BoxStorageV1 {}
