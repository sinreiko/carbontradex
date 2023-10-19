// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CarbonCredit {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => uint256) public carbonCredits; // Store the number of carbon credits for each address

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event CarbonCreditIssued(address indexed account, uint256 amount);
    event CarbonCreditTransferred(address indexed from, address indexed to, uint256 value);

    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        uint8 tokenDecimals,
        uint256 initialSupply
    ) {
        name = tokenName;
        symbol = tokenSymbol;
        decimals = tokenDecimals;
        totalSupply = initialSupply * 10**uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function approve(address spender, uint256 value) public returns (bool success) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transfer(address to, uint256 value) public returns (bool success) {
        require(to != address(0), "Invalid address");
        require(balanceOf[msg.sender] >= value, "Insufficient balance");

        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);

        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool success) {
        require(to != address(0), "Invalid address");
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Allowance exceeded");

        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        emit Transfer(from, to, value);

        return true;
    }

    function issueCarbonCredits(address account, uint256 amount) public returns (bool success) {
        require(msg.sender == account, "Only the account holder can issue carbon credits");
        require(amount > 0, "Amount must be greater than 0");

        carbonCredits[account] += amount;
        emit CarbonCreditIssued(account, amount);

        return true;
    }

    function transferCarbonCredits(address to, uint256 value) public returns (bool success) {
        require(to != address(0), "Invalid address");
        require(carbonCredits[msg.sender] >= value, "Insufficient carbon credits");

        carbonCredits[msg.sender] -= value;
        carbonCredits[to] += value;
        emit CarbonCreditTransferred(msg.sender, to, value);

        return true;
    }
    
    // Get the carbon credits balance of an address
    function getCarbonCredits(address account) public view returns (uint256) {
        return carbonCredits[account];
    }
}
