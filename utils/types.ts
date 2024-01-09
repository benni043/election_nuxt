export interface Candidate {
    id: number
    firstName: string;
    lastName: string;
    schoolClass: string;

    firstVoteChecked: boolean;
    secondaryVoteChecked: boolean;

    electionStats: ElectionStats;
}

export interface ElectionStats {
    numberOfFirstVotes: number;
    points: number
}

export enum VoteType {
    FIRST_VOTE,
    SECONDARY_VOTE
}