export interface Candidate {
    firstName: string;
    lastName: string;
    schoolClass: string;

    electionStats: ElectionStats;
}

export interface ElectionStats {
    numberOfFirstVotes: number;
    points: number
}