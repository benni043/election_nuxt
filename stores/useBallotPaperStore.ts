import {defineStore} from "pinia";
import type {BallotPaper, Candidate} from "~/utils/types";

export const useBallotPaperStore = defineStore("ballotPapers", {
    state: () =>  ({ballotPapers: [] as BallotPaper[]}),
    actions: {
        addBallotPaper(ballotPaper: BallotPaper) {
            this.ballotPapers.push(ballotPaper);
        },
        reset() {
            this.ballotPapers.splice(0, this.ballotPapers.length);
        }
    }
})