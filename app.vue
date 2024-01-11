<script setup lang="ts">
import {
  type BallotPaper,
  type Candidate,
  type ElectionStats,
  VoteType,
} from "~/utils/types";
import type { UUID } from "node:crypto";
import CandidateDisplay from "~/components/CandidateDisplay.vue";

let candidates = reactive<Candidate[]>([]);
let ballotPapers = reactive<BallotPaper[]>([]);

let candidate1 = {
  id: crypto.randomUUID(),
  lastName: "Huff",
  firstName: "Benedikt",
  schoolClass: "4AHIF",

  primaryVoteChecked: false,
  secondaryVoteChecked: false,

  electionStats: {
    points: 2,
    numberOfFirstVotes: 1,
  } as ElectionStats,
} as Candidate;
let candidate2 = {
  id: crypto.randomUUID(),
  lastName: "Frischmann",
  firstName: "Tobias",
  schoolClass: "4AHIF",

  primaryVoteChecked: false,
  secondaryVoteChecked: false,

  electionStats: {
    points: 1,
    numberOfFirstVotes: 0,
  } as ElectionStats,
} as Candidate;
// let candidate3 = {
//   id: crypto.randomUUID(),
//   lastName: "Götz",
//   firstName: "Fabian",
//   schoolClass: "4AHIF",
//
//   primaryVoteChecked: false,
//   secondaryVoteChecked: false,
//
//   electionStats: {
//     points: 0,
//     numberOfFirstVotes: 0,
//   } as ElectionStats,
// } as Candidate;

candidates.push(candidate1);
candidates.push(candidate2);
// candidates.push(candidate3);

let ballotPaper1 = {
  id: crypto.randomUUID(),
  firstVoteCandidate: candidate1,
  secondaryVoteCandidate: candidate2,
} as BallotPaper;

ballotPapers.push(ballotPaper1);

let isPrimaryVoteClicked = ref(true);
let isSecondaryVoteClicked = ref(true);

let canSave = ref(false);

let primaryVoteCandidateID: UUID | null;
let secondaryVoteCandidateID: UUID | null;

function set(voteType: VoteType, id: UUID | null) {
  if (voteType === VoteType.FIRST_VOTE) {
    isPrimaryVoteClicked.value = !isPrimaryVoteClicked.value;
    primaryVoteCandidateID = isPrimaryVoteClicked.value ? null : id;
  } else {
    isSecondaryVoteClicked.value = !isSecondaryVoteClicked.value;
    secondaryVoteCandidateID = isSecondaryVoteClicked.value ? null : id;
  }

  canSave.value = !isPrimaryVoteClicked.value || !isSecondaryVoteClicked.value;
}

function save() {
  const primaryVoteIndex = getCandidateIndexByID(primaryVoteCandidateID!);
  if (primaryVoteIndex !== null) {
    candidates[primaryVoteIndex].electionStats.points += 2;
    candidates[primaryVoteIndex].electionStats.numberOfFirstVotes += 1;
  }

  const secondaryVoteIndex = getCandidateIndexByID(secondaryVoteCandidateID!);
  if (secondaryVoteIndex !== null)
    candidates[secondaryVoteIndex].electionStats.points += 1;

  reset();
}

function reset() {
  isPrimaryVoteClicked.value = true;
  isSecondaryVoteClicked.value = true;

  canSave.value = false;

  primaryVoteCandidateID = null;
  secondaryVoteCandidateID = null;

  for (let candidate of candidates) {
    candidate.primaryVoteChecked = false;
    candidate.secondaryVoteChecked = false;
  }
}

function getCandidateIndexByID(id: UUID): number | null {
  for (let i = 0; i < candidates.length; i++) {
    if (candidates[i].id === id) return i;
  }

  return null;
}
</script>

<template>
  <div id="outer">
    <CandidateInputDisplay
      @candidate="
        (candidate: Candidate) => {
          candidates.push(candidate);
        }
      "
    ></CandidateInputDisplay>

    <div id="inner">
      <div ref="refs" v-for="candidate in candidates">
        <CandidateDisplay
          :candidate="candidate"
          :is-primary-vote-clicked="isPrimaryVoteClicked"
          :is-secondary-vote-clicked="isSecondaryVoteClicked"
          @primary-vote="
            (id: UUID) => {
              set(VoteType.FIRST_VOTE, id);
            }
          "
          @secondary-vote="
            (id: UUID) => {
              set(VoteType.SECONDARY_VOTE, id);
            }
          "
        ></CandidateDisplay>
      </div>

      <button :disabled="!canSave" @click="save">Speichern</button>
    </div>

    <div>
      <div ref="refs" v-for="ballotPaper in ballotPapers">
        <BallotPaperDisplay :ballot-paper="ballotPaper"></BallotPaperDisplay>
      </div>
    </div>
  </div>
</template>

<style scoped>
#outer {
  display: flex;
  justify-content: space-around;
}

#inner {
  display: flex;
  flex-direction: column;
}
</style>
