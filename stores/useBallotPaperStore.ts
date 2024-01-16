import {defineStore} from "pinia";
import type {BallotPaper} from "~/utils/types";

export const useBallotPaperStore = defineStore("ballotPapers", {
    state: () => [] as BallotPaper[],
})