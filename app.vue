<script setup lang="ts">
import {type BallotPaper, type Candidate, DisplayState, type ElectionStats, VoteType,} from "~/utils/types";
import CandidateDisplay from "~/components/CandidateDisplay.vue";

let candidates = reactive<Candidate[]>([]);
let ballotPapers = reactive<BallotPaper[]>([]);

function add() {
  let candidate1 = {
    id: crypto.randomUUID(),
    lastName: "Huff",
    firstName: "Benedikt",
    schoolClass: "4AHIF",

    primaryVoteChecked: false,
    secondaryVoteChecked: false,

    electionStats: {
      points: 0,
      numberOfFirstVotes: 0,
    } as ElectionStats,

    canDoubleVote: false
  } as Candidate;
  let candidate2 = {
    id: crypto.randomUUID(),
    lastName: "Frischmann",
    firstName: "Tobias",
    schoolClass: "4AHIF",

    primaryVoteChecked: false,
    secondaryVoteChecked: false,

    electionStats: {
      points: 0,
      numberOfFirstVotes: 0,
    } as ElectionStats,

    canDoubleVote: false
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

    canDoubleVote: false
  } as Candidate;
  candidates.push(candidate1);
  candidates.push(candidate2);
  candidates.push(candidate3);
}

let isPrimaryVoteClicked = ref(true);
let isSecondaryVoteClicked = ref(true);

let canSave = ref(false);

let displayState = ref(DisplayState.VOTE_BEFORE);

let primaryVoteCandidate: Candidate | null;
let secondaryVoteCandidate: Candidate | null;

let activeBallotPaper: BallotPaper | null;

// init();

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

  candidates.splice(0, 0, candidateUnknown);

  // add();
}

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

function voteEnd() {
  displayState.value = DisplayState.VOTE_AFTER;

  getStats();
}

function voteStart() {
  init();
  displayState.value = DisplayState.VOTE;
}

function showEnd() {
  candidates = reactive<Candidate[]>([]);
  ballotPapers = reactive<BallotPaper[]>([]);

  displayState.value = DisplayState.VOTE_BEFORE;
}

function getStats() {
  let validVoteCount = ballotPapers.filter((obj) => (!obj.primaryVoteCandidate?.canDoubleVote || !obj.secondaryVoteCandidate?.canDoubleVote)).length;
  let invalidVoteCount = ballotPapers.filter((obj) => (obj.primaryVoteCandidate?.canDoubleVote && obj.secondaryVoteCandidate?.canDoubleVote)).length;

  console.log("Gültige Stimmen: " + validVoteCount);
  console.log("Ungültige Stimmen: " + invalidVoteCount);
}

function exportData() {
  const jsonString = JSON.stringify(candidates, null, 2);

  const blob = new Blob([jsonString], {type: "application/json"});

  const downloadLink = document.createElement('a');
  downloadLink.href = window.URL.createObjectURL(blob);
  downloadLink.download = 'candidates.json';

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
</script>

<template>
  <div id="outer">
    <button @click="exportData">export</button>

    <div id="candidateInput" v-if="displayState === DisplayState.VOTE_BEFORE">
      <div id="input">
        <h1>
          Fügen Sie hier bitte die Wahlkandidaten hinzu!
        </h1>

        <CandidateInputDisplay
            @candidate="
        (candidate: Candidate) => {
          candidates.push(candidate);
        }">
        </CandidateInputDisplay>

        <button @click="voteStart">Wahl starten</button>
      </div>

      <div id="addedCandidates">
        <div v-for="addedCandidate in candidates">
          <AddedCandidateDisplay
              :added-candidate="addedCandidate"
              @delete="(candidate: Candidate) => {
            candidates.splice(candidates.indexOf(candidate), 1);
          }">
          </AddedCandidateDisplay>
        </div>
      </div>
    </div>

    <div id="candidateShow" v-if="displayState === DisplayState.VOTE">
      <div id="candidates">
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
      </div>

      <div id="buttons">
        <button :disabled="!canSave" @click="save">Speichern</button>
        <button :disabled="activeBallotPaper !== null" @click="voteEnd">Wahl beenden</button>
      </div>

      <div id="ballotPapers">
        <div ref="refs" v-for="ballotPaper in ballotPapers.slice().reverse()">
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

    <div id="endShow" v-if="displayState === DisplayState.VOTE_AFTER">
      <div id="endCandidate">
        <div v-for="endCandidate in candidates">
          <EndCadidateDisplay :candidate="endCandidate">
          </EndCadidateDisplay>
        </div>
      </div>

      <button @click="showEnd">Beenden</button>
    </div>

  </div>
</template>

<style scoped>

#outer {
  display: flex;
  justify-content: space-around;
}

#candidateShow, #candidateInput, #endShow {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

#endShow {
  flex-direction: column;
}

#candidates, #ballotPapers, #addedCandidates, #endCandidate {
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

#candidateInput {
  #input {
    display: flex;
    flex-direction: column;
    align-items: center;
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
  transition: background-color 0.3s,
  color 0.3s;
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
