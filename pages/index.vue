<script setup lang="ts">
import {useCandidateStore} from "~/stores/useCandidateStore";

let candidatesStore = useCandidateStore();
let ballotPaperStore = useBallotPaperStore();

let candidateFile = ref<File | null>(null);
let ballotPaperFile = ref<File | null>(null);

function handleCandidateFileChange(event: any) {
  candidateFile.value = event.target.files[0];
}

function handleBallotPaperFileChange(event: any) {
  ballotPaperFile.value = event.target.files[0];
}

function loadDataFromFiles() {
  if (candidateFile.value && ballotPaperFile.value) {
    const readerCandidate = new FileReader();
    const readerBallotPaper = new FileReader();

    // Reading candidateFile
    readerCandidate.onload = () => {
      if (typeof readerCandidate.result === "string") {
        let candidates = JSON.parse(readerCandidate.result);

        for (let candidate of candidates) {
          candidatesStore.candidates.push(candidate)
        }
      }
    };

    // Reading ballotPaperFile
    readerBallotPaper.onload = () => {
      if (typeof readerBallotPaper.result === "string") {
        let ballotPapers = JSON.parse(readerBallotPaper.result);

        for (let ballotPaper of ballotPapers) {
          ballotPaperStore.ballotPapers.push(ballotPaper);
        }
      }
    };

    readerCandidate.readAsText(candidateFile.value);
    readerBallotPaper.readAsText(ballotPaperFile.value);
  } else {
    console.error('No file selected');
  }

  redirectToVotePage();
}

function restore() {
  redirectToVotePage();
}

function addCandidates() {
  return navigateTo("/CandidateInput")
}

function redirectToVotePage() {
  return navigateTo("/VotePage")
}

</script>

<template>
  <div id="outer">
    <div id="loadLocalFiles">
      <div id="addCandidates">
        <button @click="addCandidates">Kandidaten eingeben</button>
      </div>

      <div id="restore">
        <button @click="restore">letzte Sitzung wiederherstellen</button>
      </div>

      <button :disabled="(candidateFile === null) || (ballotPaperFile === null)" @click="loadDataFromFiles">lade
        Daten aus Datei
      </button>

      <label for="candidates">Kandidaten-JSON</label>
      <input id="candidates" type="file" @change="handleCandidateFileChange($event)"/>

      <label for="ballotPapers">Wahlzettel-JSON</label>
      <input id="ballotPapers" type="file" @change="handleBallotPaperFileChange($event)"/>
    </div>
  </div>
</template>

<style scoped lang="scss">

#outer {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#loadLocalFiles {
  display: flex;
  flex-direction: column;
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
