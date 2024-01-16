<script setup lang="ts">
import {type BallotPaper, type Candidate, type ElectionStats, VoteType} from "~/utils/types";
import {useCandidateStore} from "~/stores/useCandidateStore";
import {useBallotPaperStore} from "~/stores/useBallotPaperStore";
import CandidateDisplay from "~/components/CandidateDisplay.vue";

let candidateStore = useCandidateStore();
let ballotPaperStore = useBallotPaperStore();

let isPrimaryVoteClicked = ref(true);
let isSecondaryVoteClicked = ref(true);

let canSave = ref(false);

let primaryVoteCandidate: Candidate | null = null;
let secondaryVoteCandidate: Candidate | null = null;

let activeBallotPaper: BallotPaper | null = null;

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

function result() {
  return navigateTo("/ResultPage")
}

callOnce(() => candidateStore.init());

</script>

<template>
  <div id="candidateShow">
    <div id="candidates">
      <div ref="refs" v-for="candidate in candidateStore.candidates" :key="candidate">
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
    </div>

    <div id="buttons">
      <button :disabled="!canSave" @click="save">Speichern</button>
      <button :disabled="activeBallotPaper !== null" @click="result">Wahl beenden</button>
    </div>

    <div id="ballotPapers">
      <div ref="refs" v-for="ballotPaper in ballotPaperStore.ballotPapers.slice().reverse()" :key="ballotPaper">
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

<style scoped lang="scss">

#candidateShow {
  height: 100vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

#candidates, #ballotPapers {
  display: flex;
  flex-direction: column;

  height: 70vh;
  overflow: scroll;
}

#candidateShow {
  #buttons {
    display: flex;
    flex-direction: column;
  }
}

button {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin: 20px;
  width: 150px;
  background-color: #fff;
  color: black;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  text-decoration: none;
}

button:hover {
  background-color: #ddd;
}

button:disabled {
  background-color: #cccccc;
  color: #888888;
  cursor: default;
}
</style>