<script setup lang="ts">

import {type Candidate} from "~/utils/types";
import {useCandidateStore} from "~/stores/useCandidateStore";

let candidatesStore = useCandidateStore();

</script>

<template>
  <div id="outer">
    <h1>
      Fügen Sie hier bitte die Wahlkandidaten hinzu!
    </h1>

    <CandidateInputDisplay
        @candidate="
        (candidate: Candidate) => {
          candidatesStore.addCandidate(candidate);
        }">
    </CandidateInputDisplay>

    <nuxt-link class="button" href="VotePage">Wahl starten</nuxt-link>
  </div>

  <div id="addedCandidates">
    <div v-for="addedCandidate in candidatesStore">
      <AddedCandidateDisplay
          :added-candidate="addedCandidate"
          @delete="(candidate: Candidate) => {
            candidatesStore.candidates.splice(candidatesStore.candidates.indexOf(candidate), 1);
          }">
      </AddedCandidateDisplay>
    </div>
  </div>
</template>

<style scoped>

#addedCandidates {
  display: flex;
  flex-direction: column;

  height: 70vh;
  overflow: scroll;
}

#outer {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.button {
  text-align: center;
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

.button:hover {
  background-color: #ddd;
}

.button:disabled {
  background-color: #cccccc;
  color: #888888;
  cursor: default;
}
</style>