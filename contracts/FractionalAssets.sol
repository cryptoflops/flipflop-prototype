// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title FractionalAssets
 * @dev ERC1155 contract for fractional ownership of NFTs and Real World Assets
 * Deployed on Base Mainnet
 */
contract FractionalAssets is ERC1155, Ownable, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;
    
    // Asset categories
    enum AssetCategory {
        RealEstate,
        Art,
        Music,
        Collectible,
        Other
    }
    
    // Asset information
    struct Asset {
        uint256 id;
        string name;
        string description;
        uint256 totalShares;
        uint256 pricePerShare; // in wei
        AssetCategory category;
        uint256 apy; // Annual percentage yield (basis points, e.g., 520 = 5.2%)
        bool active;
        address creator;
        uint256 totalRevenue;
        string metadataURI;
    }
    
    // Revenue distribution info
    struct RevenueShare {
        uint256 amount;
        uint256 claimedAmount;
        uint256 timestamp;
    }
    
    // State variables
    Counters.Counter private _assetIdCounter;
    mapping(uint256 => Asset) public assets;
    mapping(uint256 => uint256) public assetSupply;
    mapping(uint256 => mapping(address => RevenueShare)) public revenueShares;
    mapping(uint256 => uint256) public totalRevenueDistributed;
    
    // Trading fee (basis points)
    uint256 public tradingFee = 250; // 2.5%
    uint256 public constant MAX_FEE = 1000; // 10% max
    address public feeRecipient;
    
    // Events
    event AssetCreated(uint256 indexed assetId, string name, uint256 totalShares, uint256 pricePerShare);
    event SharesPurchased(uint256 indexed assetId, address indexed buyer, uint256 shares, uint256 totalCost);
    event SharesSold(uint256 indexed assetId, address indexed seller, uint256 shares, uint256 totalProceeds);
    event RevenueDistributed(uint256 indexed assetId, uint256 amount);
    event RevenueClaimed(uint256 indexed assetId, address indexed holder, uint256 amount);
    event AssetMetadataUpdated(uint256 indexed assetId, string newURI);
    
    constructor(string memory _uri) ERC1155(_uri) {
        feeRecipient = msg.sender;
    }
    
    /**
     * @dev Create a new fractional asset
     */
    function createAsset(
        string memory _name,
        string memory _description,
        uint256 _totalShares,
        uint256 _pricePerShare,
        AssetCategory _category,
        uint256 _apy,
        string memory _metadataURI
    ) external onlyOwner returns (uint256) {
        require(_totalShares > 0, "Total shares must be greater than 0");
        require(_pricePerShare > 0, "Price per share must be greater than 0");
        
        _assetIdCounter.increment();
        uint256 newAssetId = _assetIdCounter.current();
        
        assets[newAssetId] = Asset({
            id: newAssetId,
            name: _name,
            description: _description,
            totalShares: _totalShares,
            pricePerShare: _pricePerShare,
            category: _category,
            apy: _apy,
            active: true,
            creator: msg.sender,
            totalRevenue: 0,
            metadataURI: _metadataURI
        });
        
        // Mint initial supply to contract owner
        _mint(msg.sender, newAssetId, _totalShares, "");
        assetSupply[newAssetId] = _totalShares;
        
        emit AssetCreated(newAssetId, _name, _totalShares, _pricePerShare);
        
        return newAssetId;
    }
    
    /**
     * @dev Purchase shares of an asset
     */
    function purchaseShares(uint256 _assetId, uint256 _shares) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        Asset memory asset = assets[_assetId];
        require(asset.active, "Asset is not active");
        require(_shares > 0, "Must purchase at least 1 share");
        
        uint256 totalCost = asset.pricePerShare * _shares;
        uint256 fee = (totalCost * tradingFee) / 10000;
        uint256 totalRequired = totalCost + fee;
        
        require(msg.value >= totalRequired, "Insufficient payment");
        
        // Check available shares
        uint256 availableShares = balanceOf(owner(), _assetId);
        require(availableShares >= _shares, "Insufficient shares available");
        
        // Transfer shares from owner to buyer
        _safeTransferFrom(owner(), msg.sender, _assetId, _shares, "");
        
        // Handle payments
        if (fee > 0) {
            payable(feeRecipient).transfer(fee);
        }
        payable(owner()).transfer(totalCost);
        
        // Refund excess payment
        if (msg.value > totalRequired) {
            payable(msg.sender).transfer(msg.value - totalRequired);
        }
        
        emit SharesPurchased(_assetId, msg.sender, _shares, totalCost);
    }
    
    /**
     * @dev Sell shares back to the contract
     */
    function sellShares(uint256 _assetId, uint256 _shares) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        Asset memory asset = assets[_assetId];
        require(asset.active, "Asset is not active");
        require(_shares > 0, "Must sell at least 1 share");
        require(balanceOf(msg.sender, _assetId) >= _shares, "Insufficient shares owned");
        
        uint256 totalProceeds = asset.pricePerShare * _shares;
        uint256 fee = (totalProceeds * tradingFee) / 10000;
        uint256 netProceeds = totalProceeds - fee;
        
        // Transfer shares from seller to owner
        _safeTransferFrom(msg.sender, owner(), _assetId, _shares, "");
        
        // Check contract has enough balance
        require(address(this).balance >= netProceeds, "Insufficient contract balance");
        
        // Send proceeds to seller
        payable(msg.sender).transfer(netProceeds);
        
        // Send fee to recipient
        if (fee > 0) {
            payable(feeRecipient).transfer(fee);
        }
        
        emit SharesSold(_assetId, msg.sender, _shares, netProceeds);
    }
    
    /**
     * @dev Distribute revenue to all holders of an asset
     */
    function distributeRevenue(uint256 _assetId) 
        external 
        payable 
        onlyOwner 
    {
        require(msg.value > 0, "No revenue to distribute");
        Asset memory asset = assets[_assetId];
        require(asset.active, "Asset is not active");
        
        assets[_assetId].totalRevenue += msg.value;
        totalRevenueDistributed[_assetId] += msg.value;
        
        emit RevenueDistributed(_assetId, msg.value);
    }
    
    /**
     * @dev Calculate claimable revenue for a holder
     */
    function calculateClaimableRevenue(uint256 _assetId, address _holder) 
        public 
        view 
        returns (uint256) 
    {
        uint256 shares = balanceOf(_holder, _assetId);
        if (shares == 0) return 0;
        
        uint256 totalDistributed = totalRevenueDistributed[_assetId];
        uint256 shareOfRevenue = (totalDistributed * shares) / assetSupply[_assetId];
        uint256 alreadyClaimed = revenueShares[_assetId][_holder].claimedAmount;
        
        if (shareOfRevenue > alreadyClaimed) {
            return shareOfRevenue - alreadyClaimed;
        }
        return 0;
    }
    
    /**
     * @dev Claim revenue share
     */
    function claimRevenue(uint256 _assetId) 
        external 
        nonReentrant 
    {
        uint256 claimable = calculateClaimableRevenue(_assetId, msg.sender);
        require(claimable > 0, "No revenue to claim");
        
        revenueShares[_assetId][msg.sender].claimedAmount += claimable;
        revenueShares[_assetId][msg.sender].timestamp = block.timestamp;
        
        payable(msg.sender).transfer(claimable);
        
        emit RevenueClaimed(_assetId, msg.sender, claimable);
    }
    
    /**
     * @dev Update asset metadata URI
     */
    function updateAssetMetadata(uint256 _assetId, string memory _newURI) 
        external 
        onlyOwner 
    {
        require(assets[_assetId].active, "Asset does not exist");
        assets[_assetId].metadataURI = _newURI;
        emit AssetMetadataUpdated(_assetId, _newURI);
    }
    
    /**
     * @dev Update asset price
     */
    function updateAssetPrice(uint256 _assetId, uint256 _newPrice) 
        external 
        onlyOwner 
    {
        require(assets[_assetId].active, "Asset does not exist");
        require(_newPrice > 0, "Price must be greater than 0");
        assets[_assetId].pricePerShare = _newPrice;
    }
    
    /**
     * @dev Set trading fee
     */
    function setTradingFee(uint256 _fee) 
        external 
        onlyOwner 
    {
        require(_fee <= MAX_FEE, "Fee too high");
        tradingFee = _fee;
    }
    
    /**
     * @dev Set fee recipient
     */
    function setFeeRecipient(address _recipient) 
        external 
        onlyOwner 
    {
        require(_recipient != address(0), "Invalid recipient");
        feeRecipient = _recipient;
    }
    
    /**
     * @dev Pause/unpause contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get asset details
     */
    function getAsset(uint256 _assetId) 
        external 
        view 
        returns (Asset memory) 
    {
        return assets[_assetId];
    }
    
    /**
     * @dev Get total number of assets
     */
    function getTotalAssets() 
        external 
        view 
        returns (uint256) 
    {
        return _assetIdCounter.current();
    }
    
    /**
     * @dev Override URI function
     */
    function uri(uint256 _assetId) 
        public 
        view 
        override 
        returns (string memory) 
    {
        return assets[_assetId].metadataURI;
    }
    
    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {}
    
    /**
     * @dev Emergency withdraw (only owner)
     */
    function emergencyWithdraw() 
        external 
        onlyOwner 
    {
        payable(owner()).transfer(address(this).balance);
    }
}