// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Ballot {
    // 创建投票人结构体
    struct Voter {
        uint256 weight; // 权重
        bool voted; // 是否投票
        address delegate; //委托人地址
        uint256 vote; // 主题id
    }
    // 创建主题结构体
    struct Proposal {
        string name; // 主题名称
        uint256 voteCount; // 票数
    }

    //  主持人地址 也就是投票发起人地址
    address public chairperson;

    // 创建投票人集合
    mapping(address => Voter) public voters;
    // 主题集合
    Proposal[] public proposals;

    // 构造函数中保持主持人地址
    constructor(string[] memory proposalNames) {
        chairperson = msg.sender;
        // 其余的结构数据会给与默认值
        voters[chairperson].weight = 1;
        for (uint256 i = 0; i < proposalNames.length; i++) {
            Proposal memory proposalItem = Proposal(proposalNames[i], 0);
            proposals.push(proposalItem);
        }
    }

    // 返回主题集合
    function proposalList() public view returns (Proposal[] memory) {
        return proposals;
    }

    // 给某些地址赋予选票
    function giveRightToVote(address[] memory voteAddressList) public {
        // 只有算有着可以调用方法
        require(msg.sender == chairperson, "only ower can give right");
        for (uint256 i = 0; i < voteAddressList.length; i++) {
            // 如果该地址已经投过票 不处理，未投过票 赋予权
            if (!voters[voteAddressList[i]].voted) {
                voters[voteAddressList[i]].weight = 1;
            }
        }
    }

    // 将投票权委托给别人
    function delegate(address to) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "you already voted");
        require(msg.sender != to, "self delegate is not allowed");

        // 检查委托链，防止循环委托
        address delegate_ = to;
        while (voters[delegate_].delegate != address(0)) {
            delegate_ = voters[delegate_].delegate;
            require(delegate_ != msg.sender, "Found loop in delegation");
        }

        sender.voted = true;
        sender.delegate = to;
        Voter storage delegate_v = voters[to];
        if (delegate_v.voted) {
            proposals[delegate_v.vote].voteCount += sender.weight;
        } else {
            delegate_v.weight += sender.weight;
        }
    }

    // 投票
    function vote(uint256 idx) public {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "Has no right to vote");
        require(!sender.voted, "Already voted.");
        require(idx < proposals.length, "Invalid proposal index");

        sender.voted = true;
        sender.vote = idx;
        proposals[idx].voteCount += sender.weight;
    }

    // 计算获胜提案
    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        require(proposals.length > 0, "No proposals exist");

        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }
}
