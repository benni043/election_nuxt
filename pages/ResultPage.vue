<script setup lang="ts">
import { useCandidateStore } from "~/stores/useCandidateStore";
import { useBallotPaperStore } from "~/stores/useBallotPaperStore";
import type { Candidate } from "~/utils/types";

let candidateStore = useCandidateStore();
let ballotPaperStore = useBallotPaperStore();

let validVoteCount: number = 0;
let invalidVoteCount: number = 0;

function getStats() {
  validVoteCount = ballotPaperStore.ballotPapers
    .filter((obj) => obj.isActive)
    .filter(
      (obj) =>
        obj.primaryVoteCandidate?.lastName !== "Ungültig" ||
        obj.secondaryVoteCandidate?.lastName !== "Ungültig",
    ).length;

  invalidVoteCount = ballotPaperStore.ballotPapers
    .filter((obj) => obj.isActive)
    .filter(
      (obj) =>
        obj.primaryVoteCandidate?.lastName === "Ungültig" &&
        obj.secondaryVoteCandidate?.lastName === "Ungültig",
    ).length;
}

function getSortedCandidates(): Candidate[] {
  const candidates = [...candidateStore.candidates];

  candidates.sort((a, b) =>
    b.electionStats.points - a.electionStats.points == 0
      ? b.electionStats.numberOfFirstVotes - a.electionStats.numberOfFirstVotes
      : b.electionStats.points - a.electionStats.points,
  );

  return candidates;
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

function reset() {
  candidateStore.$reset();
  ballotPaperStore.$reset();

  localStorage.removeItem("candidates");
  localStorage.removeItem("ballots");

  validVoteCount = 0;
  invalidVoteCount = 0;

  navigateToMainMenu();
}

function navigateToMainMenu() {
  return navigateTo("/");
}

getStats();
</script>

<template>
  <div id="endShow">
    <div id="center">
      <div id="data">
        <div>Gültige Stimmen: {{ validVoteCount }}</div>
        <div>Ungültige Stimmen: {{ invalidVoteCount }}</div>
      </div>

      <button id="end" @click="reset">Beenden</button>
      <button @click="exportCandidates">Kandidaten herunterladen</button>
      <button @click="exportBallotPapers">Wahlzettel herunterladen</button>
    </div>

    <div id="endCandidate">
      <div v-for="endCandidate in getSortedCandidates()" :key="endCandidate">
        <EndCadidateDisplay
          v-if="endCandidate.lastName !== 'Ungültig'"
          :candidate="endCandidate"
        ></EndCadidateDisplay>
      </div>
    </div>
  </div>
</template>

<style scoped>
#end {
  background-color: #ef1a1a;
  border: 2px solid black;
}

#endShow {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: space-evenly;
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
</style>
