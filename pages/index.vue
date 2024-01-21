<script setup lang="ts">
import { useCandidateStore } from "~/stores/useCandidateStore";
import { useLocalStorage } from "#imports";

let candidateStore = useCandidateStore();
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
        candidateStore.candidates = JSON.parse(readerCandidate.result);
        useLocalStorage().updateCandidates();
      }
    };

    // Reading ballotPaperFile
    readerBallotPaper.onload = () => {
      if (typeof readerBallotPaper.result === "string") {
        ballotPaperStore.ballotPapers = JSON.parse(readerBallotPaper.result);
        useLocalStorage().updateBallots();
      }
    };

    readerCandidate.readAsText(candidateFile.value);
    readerBallotPaper.readAsText(ballotPaperFile.value);
  } else {
    console.error("No file selected");
  }

  redirectToVotePage();
}

function restore() {
  const storedCandidates = localStorage.getItem("candidates");
  const storedBallots = localStorage.getItem("ballots");

  if (storedCandidates) {
    candidateStore.candidates = JSON.parse(storedCandidates);
  } else {
    console.log("empty");
    return;
  }

  if (storedBallots) {
    ballotPaperStore.ballotPapers = JSON.parse(storedBallots);
  }

  redirectToVotePage();
}

function hasStoredData(): boolean {
  const storedCandidates: string | null = localStorage.getItem("candidates");

  return storedCandidates != null;
}

let other = ref(false);

if (process.client) {
  other.value = hasStoredData();
}

function redirectToCandidateInputPage() {
  return navigateTo("/CandidateInputPage");
}

function redirectToVotePage() {
  return navigateTo("/VotePage");
}
</script>

<template>
  <div id="outer2">
    <div id="outer">
      <h1>Kandidaten hinzufügen um zu starten!</h1>

      <div id="addCandidates">
        <label class="head">Selbst Kandidaten hinzufügen: </label>
        <button @click="redirectToCandidateInputPage">Hinzufügen</button>
      </div>

      <div id="restore">
        <label class="head">Daten aus letzter Sitzung wiederherstellen: </label>

        <button id="restoreButton" :disabled="!other" @click="restore">Wiederherstellen</button>
      </div>

      <div>
        <div id="loadLocalFiles">
          <label class="head">Daten aus lokalen Dateien laden: </label>

          <label class="buttonHead" for="candidates">Kandidaten-JSON</label>
          <input
            id="candidates"
            type="file"
            @change="handleCandidateFileChange($event)"
          />

          <label class="buttonHead" for="ballotPapers">Wahlzettel-JSON</label>
          <input
            id="ballotPapers"
            type="file"
            @change="handleBallotPaperFileChange($event)"
          />
        </div>
        <button
          :disabled="candidateFile === null || ballotPaperFile === null"
          id="localFilesButton"
          @click="loadDataFromFiles"
        >
          Laden
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#outer2 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#outer {
  height: 100vh;
  width: 55vw;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > div {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    margin: 10px;
  }
}

#loadLocalFiles {
  display: flex;
  flex-direction: column;
}

.head {
  font-size: 16px;
  font-weight: bold;
}

.buttonHead {
  margin-top: 15px;
  margin-bottom: 5px;
}
</style>
