<script setup lang="ts">

import CandidateDisplay from "~/components/CandidateDisplay.vue";
import {type Candidate, type ElectionStats, VoteType} from "~/utils/types";

let candidates: Candidate[] = [];

let candidate1 = {
  id: 0,
  lastName: "Huff",
  firstName: "Benedikt",
  schoolClass: "4AHIF",

  firstVoteChecked: false,
  secondaryVoteChecked: false,

  electionStats: {
    points: 10,
    numberOfFirstVotes: 5
  } as ElectionStats
} as Candidate;
let candidate2 = {
  id: 1,
  lastName: "Frischmann",
  firstName: "Tobias",
  schoolClass: "4AHIF",

  firstVoteChecked: false,
  secondaryVoteChecked: false,

  electionStats: {
    points: 10,
    numberOfFirstVotes: 5
  } as ElectionStats
} as Candidate;
let candidate3 = {
  id: 2,
  lastName: "Götz",
  firstName: "Fabian",
  schoolClass: "4AHIF",

  firstVoteChecked: false,
  secondaryVoteChecked: false,

  electionStats: {
    points: 10,
    numberOfFirstVotes: 5
  } as ElectionStats
} as Candidate;

candidates.push(candidate1);
candidates.push(candidate2);
candidates.push(candidate3);

let firstVoteEnabled = ref(true);
let secondaryVoteEnabled = ref(true);

let canSave = ref(false);

function set(voteType: VoteType) {
  if (voteType === VoteType.FIRST_VOTE) {
    firstVoteEnabled.value = !firstVoteEnabled.value;
  } else {
    secondaryVoteEnabled.value = !secondaryVoteEnabled.value;
  }

  canSave.value = !firstVoteEnabled.value && !secondaryVoteEnabled.value;
}

function save() {
  //todo save

  firstVoteEnabled.value = false;
  secondaryVoteEnabled.value = false;

  canSave.value = false;

  //todo dont update why?
  for (let candidate of candidates) {
    candidate.firstVoteChecked = false;
    candidate.secondaryVoteChecked = false;
  }
}

</script>

<template>
  <li ref="refs" v-for="candidate in candidates">
    <CandidateDisplay :candidate="candidate"
                      :first-vote-enabled="firstVoteEnabled"
                      :secondary-vote-enabled="secondaryVoteEnabled"
                      @first-vote="set(VoteType.FIRST_VOTE)"
                      @secondary-vote="set(VoteType.SECONDARY_VOTE)"></CandidateDisplay>
  </li>

  <button :disabled="!canSave" @click="save">Speichern</button>
</template>

<style scoped>

</style>