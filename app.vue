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
let candidate3 = {
  id: crypto.randomUUID(),
  lastName: "Götz",
  firstName: "Fabian",
  schoolClass: "4AHIF",

  primaryVoteChecked: false,
  secondaryVoteChecked: false,

  electionStats: {
    points: 0,
    numberOfFirstVotes: 0,
  } as ElectionStats,
} as Candidate;

candidates.push(candidate1);
candidates.push(candidate2);
candidates.push(candidate3);

let ballotPaper1 = {
  id: crypto.randomUUID(),
  ballotPaperNumber: 1,
  isActive: true,
  primaryVoteCandidate: candidate1,
  secondaryVoteCandidate: candidate2,
} as BallotPaper;

// ballotPapers.push(ballotPaper1);

let isPrimaryVoteClicked = ref(true);
let isSecondaryVoteClicked = ref(true);

let canSave = ref(false);

let primaryVoteCandidate: Candidate | null;
let secondaryVoteCandidate: Candidate | null;

let activeBallotPaper: BallotPaper | null;

function set(voteType: VoteType, candidate: Candidate | null) {
  if (voteType === VoteType.FIRST_VOTE) {
    isPrimaryVoteClicked.value = !isPrimaryVoteClicked.value;
    primaryVoteCandidate = isPrimaryVoteClicked.value ? null : candidate;
  } else {
    isSecondaryVoteClicked.value = !isSecondaryVoteClicked.value;
    secondaryVoteCandidate = isSecondaryVoteClicked.value ? null : candidate;
  }

  canSave.value = !isPrimaryVoteClicked.value || !isSecondaryVoteClicked.value;
}

function save() {
  if (primaryVoteCandidate) {
    primaryVoteCandidate.electionStats.points += 2;
    primaryVoteCandidate.electionStats.numberOfFirstVotes += 1;
  }

  if (secondaryVoteCandidate) secondaryVoteCandidate.electionStats.points += 1;

  let newBallotPaper = {
    id: crypto.randomUUID(),
    ballotPaperNumber: activeBallotPaper
      ? activeBallotPaper.ballotPaperNumber
      : ballotPapers.filter((obj) => obj.isActive).length + 1,
    isActive: true,
    primaryVoteCandidate: primaryVoteCandidate,
    secondaryVoteCandidate: secondaryVoteCandidate,
  } as BallotPaper;

  ballotPapers.push(newBallotPaper);
  ballotPapers.toReversed();

  if (activeBallotPaper) {
    activeBallotPaper.isActive = false;
  }

  reset();
}

function reset() {
  isPrimaryVoteClicked.value = true;
  isSecondaryVoteClicked.value = true;

  canSave.value = false;

  primaryVoteCandidate = null;
  secondaryVoteCandidate = null;

  activeBallotPaper = null;

  for (let candidate of candidates) {
    candidate.primaryVoteChecked = false;
    candidate.secondaryVoteChecked = false;
  }
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
            (candidate: Candidate) => {
              set(VoteType.FIRST_VOTE, candidate);
            }
          "
          @secondary-vote="
            (candidate: Candidate) => {
              set(VoteType.SECONDARY_VOTE, candidate);
            }
          "
        ></CandidateDisplay>
      </div>

      <button :disabled="!canSave" @click="save">Speichern</button>
    </div>

    <div>
      <div ref="refs" v-for="ballotPaper in ballotPapers">
        <BallotPaperDisplay
          :ballot-paper="ballotPaper"
          :disabled="activeBallotPaper !== null"
          @primary-vote="
            (candidate: Candidate) => {
              set(VoteType.FIRST_VOTE, candidate);
            }
          "
          @secondary-vote="
            (candidate: Candidate) => {
              set(VoteType.SECONDARY_VOTE, candidate);
            }
          "
          @active-ballot-paper="
            (ballotPaper: BallotPaper) => {
              activeBallotPaper = ballotPaper;
            }
          "
        ></BallotPaperDisplay>
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
