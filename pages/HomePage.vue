<script setup lang="ts">

import CandidateDisplay from "~/components/CandidateDisplay.vue";
import type {Candidate, ElectionStats} from "~/utils/types";

let candidates: Candidate[] = [];

let candidate1 = {
  lastName: "Huff",
  firstName: "Benedikt",
  schoolClass: "4AHIF",
  electionStats: {
    points: 10,
    numberOfFirstVotes: 5
  } as ElectionStats
} as Candidate;

let candidate2 = {
  lastName: "Frischmann",
  firstName: "Tobias",
  schoolClass: "4AHIF",
  electionStats: {
    points: 20,
    numberOfFirstVotes: 5
  } as ElectionStats
} as Candidate;

candidates.push(candidate1);
candidates.push(candidate2);

let firstVoteEnabled = ref(true);
let secondaryVoteEnabled = ref(true);

function func() {
  console.log("f " + firstVoteEnabled)
  console.log("s " + secondaryVoteEnabled)
}

</script>

<template>
  <li v-for="candidate in candidates">
    <CandidateDisplay :candidate="candidate" :first-vote-enabled="firstVoteEnabled"
                      :secondary-vote-enabled="secondaryVoteEnabled"
                      @first-vote="firstVoteEnabled = !firstVoteEnabled"
                      @secondary-vote="secondaryVoteEnabled = !secondaryVoteEnabled"></CandidateDisplay>
  </li>

  <button @click="func">sad</button>
</template>

<style scoped>

</style>