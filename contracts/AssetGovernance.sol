// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./FractionalAssets.sol";

/**
 * @title AssetGovernance
 * @dev Governance contract for fractional asset management
 */
contract AssetGovernance is Ownable, ReentrancyGuard {
    
    FractionalAssets public fractionalAssets;
    
    enum ProposalType {
        UpdatePrice,
        UpdateMetadata,
        DistributeRevenue,
        UpdateAPY,
        Other
    }
    
    enum ProposalStatus {
        Pending,
        Active,
        Defeated,
        Succeeded,
        Executed,
        Cancelled
    }
    
    struct Proposal {
        uint256 id;
        uint256 assetId;
        address proposer;
        ProposalType proposalType;
        string title;
        string description;
        bytes callData;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        uint256 startBlock;
        uint256 endBlock;
        ProposalStatus status;
        mapping(address => bool) hasVoted;
        mapping(address => uint8) voteChoice; // 0: against, 1: for, 2: abstain
    }
    
    // State variables
    uint256 public proposalCount;
    uint256 public votingDelay = 1; // blocks
    uint256 public votingPeriod = 50400; // ~7 days with 12s blocks
    uint256 public proposalThreshold = 100; // minimum shares to create proposal
    uint256 public quorumPercentage = 400; // 4% in basis points
    
    mapping(uint256 => Proposal) public proposals;
    
    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        uint256 indexed assetId,
        address indexed proposer,
        string title
    );
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        uint8 choice,
        uint256 weight
    );
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCancelled(uint256 indexed proposalId);
    
    constructor(address payable _fractionalAssets) {
        fractionalAssets = FractionalAssets(_fractionalAssets);
    }
    
    /**
     * @dev Create a new proposal
     */
    function propose(
        uint256 _assetId,
        ProposalType _type,
        string memory _title,
        string memory _description,
        bytes memory _callData
    ) external returns (uint256) {
        // Check proposer has enough shares
        uint256 shares = fractionalAssets.balanceOf(msg.sender, _assetId);
        require(shares >= proposalThreshold, "Insufficient shares to propose");
        
        proposalCount++;
        uint256 proposalId = proposalCount;
        
        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.assetId = _assetId;
        proposal.proposer = msg.sender;
        proposal.proposalType = _type;
        proposal.title = _title;
        proposal.description = _description;
        proposal.callData = _callData;
        proposal.startBlock = block.number + votingDelay;
        proposal.endBlock = proposal.startBlock + votingPeriod;
        proposal.status = ProposalStatus.Pending;
        
        emit ProposalCreated(proposalId, _assetId, msg.sender, _title);
        
        return proposalId;
    }
    
    /**
     * @dev Cast a vote on a proposal
     */
    function castVote(uint256 _proposalId, uint8 _choice) external nonReentrant {
        Proposal storage proposal = proposals[_proposalId];
        
        require(block.number >= proposal.startBlock, "Voting not started");
        require(block.number <= proposal.endBlock, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(_choice <= 2, "Invalid vote choice");
        
        // Update status if needed
        if (proposal.status == ProposalStatus.Pending) {
            proposal.status = ProposalStatus.Active;
        }
        
        uint256 weight = fractionalAssets.balanceOf(msg.sender, proposal.assetId);
        require(weight > 0, "No voting power");
        
        proposal.hasVoted[msg.sender] = true;
        proposal.voteChoice[msg.sender] = _choice;
        
        if (_choice == 0) {
            proposal.againstVotes += weight;
        } else if (_choice == 1) {
            proposal.forVotes += weight;
        } else {
            proposal.abstainVotes += weight;
        }
        
        emit VoteCast(_proposalId, msg.sender, _choice, weight);
    }
    
    /**
     * @dev Execute a successful proposal
     */
    function execute(uint256 _proposalId) external nonReentrant {
        Proposal storage proposal = proposals[_proposalId];
        
        require(block.number > proposal.endBlock, "Voting not ended");
        require(proposal.status == ProposalStatus.Active, "Invalid status");
        
        // Check if proposal succeeded
        uint256 totalSupply = fractionalAssets.assetSupply(proposal.assetId);
        uint256 quorum = (totalSupply * quorumPercentage) / 10000;
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
        
        if (totalVotes >= quorum && proposal.forVotes > proposal.againstVotes) {
            proposal.status = ProposalStatus.Succeeded;
            
            // Execute based on proposal type
            if (proposal.proposalType == ProposalType.UpdatePrice) {
                _executeUpdatePrice(proposal.assetId, proposal.callData);
            } else if (proposal.proposalType == ProposalType.UpdateMetadata) {
                _executeUpdateMetadata(proposal.assetId, proposal.callData);
            } else if (proposal.proposalType == ProposalType.DistributeRevenue) {
                _executeDistributeRevenue(proposal.assetId, proposal.callData);
            }
            
            proposal.status = ProposalStatus.Executed;
            emit ProposalExecuted(_proposalId);
        } else {
            proposal.status = ProposalStatus.Defeated;
        }
    }
    
    /**
     * @dev Cancel a proposal (only proposer or owner)
     */
    function cancel(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        
        require(
            msg.sender == proposal.proposer || msg.sender == owner(),
            "Not authorized to cancel"
        );
        require(
            proposal.status == ProposalStatus.Pending || 
            proposal.status == ProposalStatus.Active,
            "Cannot cancel"
        );
        
        proposal.status = ProposalStatus.Cancelled;
        emit ProposalCancelled(_proposalId);
    }
    
    /**
     * @dev Internal function to execute price update
     */
    function _executeUpdatePrice(uint256 _assetId, bytes memory _data) internal {
        uint256 newPrice = abi.decode(_data, (uint256));
        fractionalAssets.updateAssetPrice(_assetId, newPrice);
    }
    
    /**
     * @dev Internal function to execute metadata update
     */
    function _executeUpdateMetadata(uint256 _assetId, bytes memory _data) internal {
        string memory newURI = abi.decode(_data, (string));
        fractionalAssets.updateAssetMetadata(_assetId, newURI);
    }
    
    /**
     * @dev Internal function to execute revenue distribution
     */
    function _executeDistributeRevenue(uint256 _assetId, bytes memory _data) internal {
        uint256 amount = abi.decode(_data, (uint256));
        require(address(this).balance >= amount, "Insufficient balance");
        fractionalAssets.distributeRevenue{value: amount}(_assetId);
    }
    
    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 _proposalId) external view returns (
        uint256 id,
        uint256 assetId,
        address proposer,
        string memory title,
        string memory description,
        uint256 forVotes,
        uint256 againstVotes,
        uint256 abstainVotes,
        uint256 startBlock,
        uint256 endBlock,
        ProposalStatus status
    ) {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.id,
            proposal.assetId,
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.abstainVotes,
            proposal.startBlock,
            proposal.endBlock,
            proposal.status
        );
    }
    
    /**
     * @dev Check if user has voted on a proposal
     */
    function hasVoted(uint256 _proposalId, address _voter) external view returns (bool) {
        return proposals[_proposalId].hasVoted[_voter];
    }
    
    /**
     * @dev Get user's vote choice
     */
    function getVoteChoice(uint256 _proposalId, address _voter) external view returns (uint8) {
        require(proposals[_proposalId].hasVoted[_voter], "Not voted");
        return proposals[_proposalId].voteChoice[_voter];
    }
    
    /**
     * @dev Update governance parameters (only owner)
     */
    function updateVotingDelay(uint256 _delay) external onlyOwner {
        votingDelay = _delay;
    }
    
    function updateVotingPeriod(uint256 _period) external onlyOwner {
        votingPeriod = _period;
    }
    
    function updateProposalThreshold(uint256 _threshold) external onlyOwner {
        proposalThreshold = _threshold;
    }
    
    function updateQuorumPercentage(uint256 _percentage) external onlyOwner {
        require(_percentage <= 10000, "Invalid percentage");
        quorumPercentage = _percentage;
    }
    
    /**
     * @dev Receive function to accept ETH for revenue distribution
     */
    receive() external payable {}
    
    /**
     * @dev Emergency withdraw (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}