<script setup lang="ts">

import type {Candidate} from "~/utils/types";
import {useCandidateStore} from "~/stores/useCandidateStore";

let candidatesStore = useCandidateStore();

function redirectToVotePage() {
  candidatesStore.init();
  return navigateTo("/VotePage");
}

function redirectToMainMenu() {
  candidatesStore.reset();
  navigateTo("/");
}

</script>

<template>
  <div id="candidateInput">
    <div id="input">
      <h1>Fügen Sie hier bitte die Wahlkandidaten hinzu!</h1>

      <CandidateInputDisplay
          @candidate="
          (candidate: Candidate) => {
            candidatesStore.addCandidate(candidate);
          }
        "
      >
      </CandidateInputDisplay>

      <button :disabled="candidatesStore.candidates.length < 1" @click="redirectToVotePage">Wahl starten</button>
      <button @click="redirectToMainMenu">Zurück zum Hauptmenu</button>
    </div>

    <div id="addedCandidates">
      <div
          v-for="addedCandidate in candidatesStore.candidates"
          :key="addedCandidate">
        <AddedCandidateDisplay
            :added-candidate="addedCandidate"
            @delete="
            (candidate: Candidate) => {
              candidatesStore.candidates.splice(
                candidatesStore.candidates.indexOf(candidate),
                1,
              );
            }">
        </AddedCandidateDisplay>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#candidateInput {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

#addedCandidates {
  display: flex;
  flex-direction: column;

  height: 70vh;
  overflow: scroll;
}

#candidateInput {
  #input {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

button {
  margin: 20px 20px 0 20px;
}

</style>
