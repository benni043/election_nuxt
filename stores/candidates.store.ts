import {defineStore} from "pinia";
import type {Candidate, ElectionStats} from "~/utils/types";

export const candidatesStore = defineStore("candidates", {
    state: () => [] as Candidate[],
    actions: {
        init() {
            let candidateUnknown = {
                id: crypto.randomUUID(),
                lastName: "Ungültig",
                firstName: "",
                schoolClass: "Ungültig",

                primaryVoteChecked: false,
                secondaryVoteChecked: false,

                electionStats: {
                    points: 0,
                    numberOfFirstVotes: 0,
                } as ElectionStats,

                canDoubleVote: true
            } as Candidate;

            this.splice(0, 0, candidateUnknown);
        }

    }
})