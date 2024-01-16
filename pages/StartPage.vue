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

    <nuxt-link href="VotePage">Wahl starten</nuxt-link>
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
  justify-content: space-around;
  align-items: center;
}

</style>