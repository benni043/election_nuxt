<script setup lang="ts">

import {useCandidateStore} from "~/stores/useCandidateStore";
import {useBallotPaperStore} from "~/stores/useBallotPaperStore";

let candidates = useCandidateStore();
let ballotPapers = useBallotPaperStore();

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

getStats();

</script>

<template>
  <div id="outer">
    <div id="endCandidate">
      <div v-for="endCandidate in candidates">
        <EndCadidateDisplay :candidate="endCandidate">
        </EndCadidateDisplay>
      </div>
    </div>

    <nuxt-link href="startPage">Beenden</nuxt-link>
  </div>
</template>

<style scoped>

</style>