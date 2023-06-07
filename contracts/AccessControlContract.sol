// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract AccessControlContract is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    uint maxMint;
    uint maxBurn;

    event Minted (address to, uint256 amount);
    event Burned (address from, uint256 amount);

    constructor(address minter, address burner) ERC20("TestToken", "TT") {
        _setupRole(MINTER_ROLE, minter);
        _setupRole(BURNER_ROLE, burner);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function getMaxMint() external view returns(uint) {
        return maxMint;
    }

    function getMaxBurn() external view returns(uint) {
        return maxBurn;
    }

    function mint(address to, uint256 amount) external {
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        require(amount <= maxBurn, "Attempt to mint an invalid amount");
        _mint(to, amount);
        emit Minted(to, amount);
    }

    function burn (address from, uint256 amount) external {
        require(hasRole(BURNER_ROLE, msg.sender), "Caller is not a burner");
        require(amount <= maxBurn, "Attempt to burn an invalid amount");
        _burn(from, amount);
        emit Burned(from, amount);
    }

    function setupMaxMint (uint value) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not a admin");
        maxMint = value; 
    }

    function setupMaxBurn (uint value) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not a admin");
        maxBurn = value; 
    }
}
