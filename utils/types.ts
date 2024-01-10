import type {UUID} from "node:crypto";

export interface Candidate {
    id: UUID
    firstName: string;
    lastName: string;
    schoolClass: string;

    primaryVoteChecked: boolean;
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