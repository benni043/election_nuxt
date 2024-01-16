<script setup lang="ts">
import {type BallotPaper, type Candidate, type ElectionStats, VoteType} from "~/utils/types";
import {useCandidateStore} from "~/stores/useCandidateStore";
import {useBallotPaperStore} from "~/stores/useBallotPaperStore";

let candidateStore = useCandidateStore();
let ballotPaperStore = useBallotPaperStore();

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

  canSave.value = !isPrimaryVoteClicked.value && !isSecondaryVoteClicked.value;
}

function save() {
  if (primaryVoteCandidate) {
    primaryVoteCandidate.electionStats.points += 2;
    primaryVoteCandidate.electionStats.numberOfFirstVotes += 1;
  }

  if (secondaryVoteCandidate) {
    secondaryVoteCandidate.electionStats.points += 1;
  }

  let newBallotPaper = {
    id: crypto.randomUUID(),
    ballotPaperNumber: activeBallotPaper
        ? activeBallotPaper.ballotPaperNumber
        : ballotPaperStore.ballotPapers.filter((obj) => obj.isActive).length + 1,
    isActive: true,
    primaryVoteCandidate: primaryVoteCandidate,
    secondaryVoteCandidate: secondaryVoteCandidate,
  } as BallotPaper;

  ballotPaperStore.addBallotPaper(newBallotPaper);

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

  for (let candidate of candidateStore.candidates) {
    candidate.primaryVoteChecked = false;
    candidate.secondaryVoteChecked = false;
  }
}

function init() {
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

  candidateStore.candidates.splice(0, 0, candidateUnknown);
}

init();

</script>

<template>
  <div id="outer">
    <div id="candidates">
      <div ref="refs" v-for="candidateInner in candidateStore.candidates" :key="candidateInner">
        <CandidateDisplay
            :candidate="candidateInner"
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
    </div>

    <div id="buttons">
      <button :disabled="!canSave" @click="save">Speichern</button>
      <nuxt-link :disabled="activeBallotPaper !== null" href="/resultPage">Wahl beenden</nuxt-link>
    </div>

    <div id="ballotPapers">
      <div ref="refs" v-for="ballotPaper in ballotPaperStore.ballotPapers.slice().reverse()">
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
#candidates, #ballotPapers {
  display: flex;
  flex-direction: column;

  height: 70vh;
  overflow: scroll;
}

#outer {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>