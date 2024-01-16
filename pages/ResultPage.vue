<script setup lang="ts">

import {useCandidateStore} from "~/stores/useCandidateStore";
import {useBallotPaperStore} from "~/stores/useBallotPaperStore";

let candidateStore = useCandidateStore();
let ballotPaperStore = useBallotPaperStore();

function getStats() {
  let validVoteCount = ballotPaperStore.ballotPapers.filter((obj) => (!obj.primaryVoteCandidate?.canDoubleVote || !obj.secondaryVoteCandidate?.canDoubleVote)).length;
  let invalidVoteCount = ballotPaperStore.ballotPapers.filter((obj) => (obj.primaryVoteCandidate?.canDoubleVote && obj.secondaryVoteCandidate?.canDoubleVote)).length;

  console.log("Gültige Stimmen: " + validVoteCount);
  console.log("Ungültige Stimmen: " + invalidVoteCount);
}

function exportData() {
  const jsonString = JSON.stringify(candidateStore, null, 2);

  const blob = new Blob([jsonString], {type: "application/json"});

  const downloadLink = document.createElement('a');
  downloadLink.href = window.URL.createObjectURL(blob);
  downloadLink.download = 'candidates.json';

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function end() {
  candidateStore.candidates.splice(0, candidateStore.candidates.length);
  ballotPaperStore.ballotPapers.splice(0, ballotPaperStore.ballotPapers.length);

  return navigateTo("/");
}

getStats();

</script>

<template>
  <div id="endShow">
    <button @click="end">Beenden</button>

    <div id="endCandidate">
      <div v-for="endCandidate in candidateStore.candidates" :key="endCandidate">
        <EndCadidateDisplay :candidate="endCandidate"></EndCadidateDisplay>
      </div>
    </div>
  </div>
</template>

<style scoped>

#endShow {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

#endCandidate {
  display: flex;
  flex-direction: column;
  height: 70vh;
  overflow: scroll;
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