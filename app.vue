<script setup lang="ts">
import {
  type BallotPaper,
  type Candidate,
  type ElectionStats,
  VoteType,
} from "~/utils/types";
import type {UUID} from "node:crypto";
import CandidateDisplay from "~/components/CandidateDisplay.vue";

let candidates = reactive<Candidate[]>([]);
let ballotPapers = reactive<BallotPaper[]>([]);

// let candidate1 = {
//   id: crypto.randomUUID(),
//   lastName: "Huff",
//   firstName: "Benedikt",
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
// let candidate2 = {
//   id: crypto.randomUUID(),
//   lastName: "Frischmann",
//   firstName: "Tobias",
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

// candidates.push(candidate1);
// candidates.push(candidate2);
// candidates.push(candidate3);


let isPrimaryVoteClicked = ref(true);
let isSecondaryVoteClicked = ref(true);

let canSave = ref(false);

let voteStarted = ref(false);

let primaryVoteCandidate: Candidate | null;
let secondaryVoteCandidate: Candidate | null;

let activeBallotPaper: BallotPaper | null;

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
  } as Candidate;

  candidates.push(candidateUnknown);
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
  reset();

  candidates = [];
  ballotPapers = [];

  voteStarted.value = false;

  getStats();
}

function voteStart() {
  init();
  voteStarted.value = true;
}

function getStats() {
  let allVoteCount = ballotPapers.filter((obj) => obj.isActive).length;
  let invalidPrimaryVoteCount = ballotPapers.filter((obj) => obj.primaryVoteCandidate?.lastName === "Ungültig").length;
  let invalidSecondaryVoteCount = ballotPapers.filter((obj) => obj.secondaryVoteCandidate?.lastName === "Ungültig").length;

  console.log(allVoteCount);
  console.log(invalidPrimaryVoteCount);
  console.log(invalidSecondaryVoteCount);
}
</script>

<template>
  <div id="outer">
    <div id="candidateInput" v-if="!voteStarted">
      <div id="input">
        <h1>
          Fügen Sie hier bitte die Wahlkandidaten hinzu!
        </h1>

        <CandidateInputDisplay
            @candidate="
        (candidate: Candidate) => {
          candidates.push(candidate);
        }
      "
        ></CandidateInputDisplay>

        <button @click="voteStart">Wahl starten</button>
      </div>

      <div>
        <div v-for="addedCandidate in candidates">
          <AddedCandidateDisplay :added-candidate="addedCandidate" @delete="(candidate: Candidate) => {
            candidates.splice(candidates.indexOf(candidate), 1);
          }"></AddedCandidateDisplay>
        </div>
      </div>

    </div>

    <div v-if="voteStarted" id="inner">
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
  </div>
</template>

<style scoped>

#outer {
  display: flex;
  justify-content: space-around;
}

#inner {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: space-around;
  align-items: center;

  #candidates, #ballotPapers {
    display: flex;
    flex-direction: column;

    //padding: 10px;
    //border: 2px solid black;
    //border-radius: 10px;

    height: 70vh;
    overflow: scroll;
  }

  #buttons {
    display: flex;
    flex-direction: column;
  }
}

#candidateInput {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-around;

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
