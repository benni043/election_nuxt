<script setup lang="ts">
import { type Candidate } from "~/utils/types";
import { useCandidateStore } from "~/stores/useCandidateStore";

let candidatesStore = useCandidateStore();

function start() {
  return navigateTo("/VotePage");
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

      <button @click="start">Wahl starten</button>
    </div>

    <div id="addedCandidates">
      <div
        v-for="addedCandidate in candidatesStore.candidates"
        :key="addedCandidate"
      >
        <AddedCandidateDisplay
          :added-candidate="addedCandidate"
          @delete="
            (candidate: Candidate) => {
              candidatesStore.candidates.splice(
                candidatesStore.candidates.indexOf(candidate),
                1,
              );
            }
          "
        >
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
