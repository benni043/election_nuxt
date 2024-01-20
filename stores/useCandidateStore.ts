import { defineStore } from "pinia";
import type { Candidate, ElectionStats } from "~/utils/types";
import type { UUID } from "node:crypto";

export const useCandidateStore = defineStore("candidates", {
  state: () => ({ candidates: [] as Candidate[] }),
  actions: {
    init() {
      let candidate = {
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
      } as Candidate;

      this.candidates.splice(0, 0, candidate);
    },
    getByID(uuid: UUID): Candidate | null {
      return this.candidates.filter((obj) => obj.id === uuid)[0];
    },
  },
});
