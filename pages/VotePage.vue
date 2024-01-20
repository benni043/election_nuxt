<script setup lang="ts">
import { type BallotPaper, type Candidate, VoteType } from "~/utils/types";
import { useCandidateStore } from "~/stores/useCandidateStore";
import { useBallotPaperStore } from "~/stores/useBallotPaperStore";
import { useLocalStorage } from "~/stores/useLocalStorage";

let candidateStore = useCandidateStore();
let ballotPaperStore = useBallotPaperStore();

let canPrimaryVoteBeClicked = ref(true);
let canSecondaryVoteBeClicked = ref(true);

let canSave = ref(false);

let primaryVoteCandidate: Candidate | null = null;
let secondaryVoteCandidate: Candidate | null = null;

let activeBallotPaper: BallotPaper | null = null;

function set(voteType: VoteType, candidate: Candidate | null) {
  if (voteType === VoteType.FIRST_VOTE) {
    canPrimaryVoteBeClicked.value = !canPrimaryVoteBeClicked.value;
    primaryVoteCandidate = canPrimaryVoteBeClicked.value ? null : candidate;
  } else {
    canSecondaryVoteBeClicked.value = !canSecondaryVoteBeClicked.value;
    secondaryVoteCandidate = canSecondaryVoteBeClicked.value ? null : candidate;
  }

  canSave.value = !canPrimaryVoteBeClicked.value && !canSecondaryVoteBeClicked.value;
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
      : Math.max(
          ...ballotPaperStore.ballotPapers.map((obj) => obj.ballotPaperNumber),
          0,
        ) + 1,
    isActive: true,
    primaryVoteCandidate: primaryVoteCandidate,
    secondaryVoteCandidate: secondaryVoteCandidate,
  } as BallotPaper;

  ballotPaperStore.ballotPapers.push(newBallotPaper);

  if (activeBallotPaper) {
    activeBallotPaper.isActive = false;
  }

  reset();
}

function reset() {
  canPrimaryVoteBeClicked.value = true;
  canSecondaryVoteBeClicked.value = true;

  canSave.value = false;

  primaryVoteCandidate = null;
  secondaryVoteCandidate = null;

  activeBallotPaper = null;

  for (let candidate of candidateStore.candidates) {
    candidate.primaryVoteChecked = false;
    candidate.secondaryVoteChecked = false;
  }

  updateLocalStorage();
}

function updateLocalStorage() {
  useLocalStorage().updateLocalStorage();
}

function navigateToResultPage() {
  return navigateTo("/ResultPage");
}
</script>

<template>
  <div id="candidateShow">
    <div id="candidates">
      <div
        ref="refs"
        v-for="candidate in candidateStore.candidates"
        :key="candidate"
      >
        <CandidateDisplay
          :candidate="candidate"
          :can-primary-vote-be-clicked="canPrimaryVoteBeClicked"
          :can-secondary-vote-be-clicked="canSecondaryVoteBeClicked"
          :can-double-vote="candidate.lastName === 'Ungültig'"
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
      <button
        :disabled="activeBallotPaper !== null"
        @click="navigateToResultPage"
      >
        Wahl beenden
      </button>
    </div>

    <div id="ballotPapers">
      <div
        ref="refs"
        v-for="ballotPaper in ballotPaperStore.ballotPapers.slice().reverse()"
        :key="ballotPaper"
      >
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

#candidates,
#ballotPapers {
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
</style>
