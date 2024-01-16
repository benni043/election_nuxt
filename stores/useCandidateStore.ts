import {defineStore} from "pinia";
import type {Candidate, ElectionStats} from "~/utils/types";

export const useCandidateStore = defineStore("candidates", {
    state: () => ({candidates: [] as Candidate[]}),
    actions: {
        init() {
            let candidateUnknown = {
                id: crypto.randomUUID(),
                lastName: "Ungültig",
                firstName: "Ungültig",
                schoolClass: "Ungültig",

                primaryVoteChecked: false,
                secondaryVoteChecked: false,

                electionStats: {
                    points: 0,
                    numberOfFirstVotes: 0,
                } as ElectionStats,

                canDoubleVote: true
            } as Candidate;

            this.candidates.splice(0, 0, candidateUnknown);
        },

        addCandidate(candidate: Candidate) {
            this.candidates.push(candidate);
        }
    }
})