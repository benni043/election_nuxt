<script setup lang="ts">
import { useCandidateStore } from "~/stores/useCandidateStore";
import { useBallotPaperStore } from "~/stores/useBallotPaperStore";

let candidateStore = useCandidateStore();
let ballotPaperStore = useBallotPaperStore();

let validVoteCount: number = 0;
let invalidVoteCount: number = 0;

function getStats() {
  validVoteCount = ballotPaperStore.ballotPapers
    .filter((obj) => obj.isActive)
    .filter(
      (obj) =>
        !obj.primaryVoteCandidate?.canDoubleVote ||
        !obj.secondaryVoteCandidate?.canDoubleVote,
    ).length;
  invalidVoteCount = ballotPaperStore.ballotPapers
    .filter((obj) => obj.isActive)
    .filter(
      (obj) =>
        obj.primaryVoteCandidate?.canDoubleVote &&
        obj.secondaryVoteCandidate?.canDoubleVote,
    ).length;
}

function exportCandidates() {
  const jsonStringCandidate = JSON.stringify(
    candidateStore.candidates,
    null,
    2,
  );
  const blobCandidate = new Blob([jsonStringCandidate], {
    type: "application/json",
  });

  download(blobCandidate, "candidates");
}

function exportBallotPapers() {
  const jsonStringBallotPaper = JSON.stringify(
    ballotPaperStore.ballotPapers,
    null,
    2,
  );
  const blobBallotPaper = new Blob([jsonStringBallotPaper], {
    type: "application/json",
  });

  download(blobBallotPaper, "ballots");
}

function download(blob: Blob, fileName: string) {
  const downloadLink = document.createElement("a");
  downloadLink.href = window.URL.createObjectURL(blob);
  downloadLink.download = fileName + ".json";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function end() {
  candidateStore.candidates.splice(0, candidateStore.candidates.length);
  ballotPaperStore.ballotPapers.splice(0, ballotPaperStore.ballotPapers.length);

  //todo init in votePage
  candidateStore.init();

  return navigateTo("/");
}

getStats();
</script>

<template>
  <div id="endShow">
    <div id="center">
      <button @click="end">Beenden</button>
      <button @click="exportCandidates">download candidates</button>
      <button @click="exportBallotPapers">download ballots</button>

      <div id="data">
        <div>Gültige Stimmen: {{ validVoteCount }}</div>
        <div>Ungültige Stimmen: {{ invalidVoteCount }}</div>
      </div>
    </div>

    <div id="endCandidate">
      <div
        v-for="endCandidate in candidateStore.candidates"
        :key="endCandidate"
      >
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

#center {
  display: flex;
  flex-direction: column;
  align-items: center;

  #data {
    margin: 10px;

    div {
      text-align: center;
      font-size: 20px;
    }
  }
}

button {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin: 10px;
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
