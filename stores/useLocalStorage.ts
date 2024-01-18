import { useBallotPaperStore, useCandidateStore } from "#imports";

export const useLocalStorage = defineStore("localStorage", {
  actions: {
    updateLocalStorage() {
      this.updateCandidates();
      this.updateBallots();
    },
    updateCandidates() {
      const candidatesAsString = JSON.stringify(useCandidateStore().candidates);
      localStorage.setItem("candidates", candidatesAsString);
    },
    updateBallots() {
      const ballotsPapersAsString = JSON.stringify(
        useBallotPaperStore().ballotPapers,
      );
      localStorage.setItem("ballots", ballotsPapersAsString);
    },
  },
});
