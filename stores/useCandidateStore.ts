import {defineStore} from "pinia";
import type {Candidate, ElectionStats} from "~/utils/types";

export const useCandidateStore = defineStore("candidates", {
    state: () => ({candidates: [] as Candidate[]}),
    actions: {
        addCandidate(candidate: Candidate) {
            this.candidates.push(candidate);
        }
    }
})