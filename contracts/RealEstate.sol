// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract RealEstate is ERC721URIStorage{
  uint256 private _tokenIds;

  constructor() ERC721("RealEstate", "Real") {}

  function mint(string memory tokenURI) public returns (uint256) {
    uint256 tokenId = _tokenIds;
    _tokenIds++;
    _mint(msg.sender, tokenId);
    _setTokenURI(tokenId, tokenURI);

    return tokenId;
  }

  function totalSupply() public view returns (uint256) {
    return _tokenIds;
  }
}
