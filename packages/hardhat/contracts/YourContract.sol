/// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract YourContract {
    struct Voter {
        uint weight;
        bool voted;
        address delegate;
        uint vote;
    }

    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    address public chairperson;
    mapping(address => Voter) public voters;
    bool public votingEnded;

    Proposal[] public proposals;

    constructor(bytes32[] memory proposalNames) {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    function endVoting() external {
        require(
            msg.sender == chairperson,
            "Only chairperson can end the voting."
        );
        require(!votingEnded, "Voting has already ended.");
        votingEnded = true;
    }

    function revokeDelegation() external {
        Voter storage sender = voters[msg.sender];
        require(!votingEnded, "Voting is ended");
        require(sender.delegate != address(0), "No delegation to revoke.");
        Voter storage delegate_ = voters[sender.delegate];
        require(
            !delegate_.voted,
            "Delegate already voted; cannot revoke delegation."
        );

        delegate_.weight -= sender.weight;
        sender.delegate = address(0);
        sender.voted = false;
    }

   /* function giveRightToVote(address voter) external {
        require(!votingEnded, "Voting is ended");
        require(
            msg.sender == chairperson,
            "Only chairperson can give right to vote."
        );
        require(!voters[voter].voted, "The voter already voted.");
        require(voters[voter].weight == 0);
        voters[voter].weight = 1;
   */ }

    function takeRightToVote(address voter) external {
        require(!votingEnded, "Voting is ended");
        require(
            msg.sender == chairperson,
            "Only chairperson can take right to vote."
        );
        require(voters[voter].weight == 1, "This person already cant vote");
        voters[voter].weight = 0;
    }

    function bytes32ToString(
        bytes32 _bytes32
    ) public pure returns (string memory) {
        uint8 i = 0;
        while (i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (uint8 j = 0; j < i; j++) {
            bytesArray[j] = _bytes32[j];
        }
        return string(bytesArray);
    }

    function delegate(address to) external {
        Voter storage sender = voters[msg.sender];
        require(!votingEnded, "Voting is ended");
        require(sender.weight != 0, "You have no right to vote");
        require(!sender.voted, "You already voted.");
        require(to != msg.sender, "Self-delegation is disallowed.");
        while (voters[to].delegate != address(0)) {
            to = voters[to].delegate;
            require(to != msg.sender, "Found loop in delegation.");
        }

        Voter storage delegate_ = voters[to];
        require(delegate_.weight >= 1);
        sender.voted = true;
        sender.delegate = to;

        if (delegate_.voted) {
            proposals[delegate_.vote].voteCount += sender.weight;
        } else {
            delegate_.weight += sender.weight;
        }
    }

    function vote(uint proposal) external {
        Voter storage sender = voters[msg.sender];
        require(!votingEnded, "Voting is ended");
        require(!sender.voted, "Already voted.");
        if (sender.weight == 0)
            sender.weight = 1;
        sender.voted = true;
        sender.vote = proposal;
        proposals[proposal].voteCount += sender.weight;
    }

    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view returns (string memory winnerName_) {
        winnerName_ = bytes32ToString(proposals[winningProposal()].name);
    }
}
