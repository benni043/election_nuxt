<script setup lang="ts">

import type {Candidate} from "~/utils/types";

let props = defineProps<{
  candidate: Candidate;
  firstVoteEnabled: boolean;
  secondaryVoteEnabled: boolean;
}>();

let value: boolean;
let value2: boolean;

</script>

<template>
  <div>
    <h3>{{ props.candidate.lastName }} {{ props.candidate.firstName }} | {{ props.candidate.schoolClass }}</h3>

    <h4>Punkte: {{ props.candidate.electionStats.points }}</h4>
    <h4>Erststimmen: {{ props.candidate.electionStats.numberOfFirstVotes }}</h4>

    <label for="firstVote">Erststimme</label>
    <input :disabled="!props.firstVoteEnabled && !value" type="checkbox" name="firstVote" id="firstVote"
           @change="$emit('firstVote')" v-model="value">

    <label for="secondaryVote">Zweitstimme</label>
    <input :disabled="!props.secondaryVoteEnabled && !value" type="checkbox" name="secondaryVote" id="secondaryVote"
           @change="$emit('secondaryVote')" v-model="value2">
  </div>
</template>

<style scoped>

</style>