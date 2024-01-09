<script setup lang="ts">

import {type Candidate, VoteType} from "~/utils/types";

let props = defineProps<{
  candidate: Candidate;
  firstVoteEnabled: boolean;
  secondaryVoteEnabled: boolean;

}>();

let emit = defineEmits<{
  firstVote: []
  secondaryVote: []
}>();

function change(voteType: VoteType) {
  if (voteType === VoteType.FIRST_VOTE) {
    props.candidate.firstVoteChecked = !props.candidate.firstVoteChecked;
    emit('firstVote');
  } else {
    props.candidate.secondaryVoteChecked = !props.candidate.secondaryVoteChecked;
    emit('secondaryVote');
  }
}

</script>

<template>
  <div>
    <h3>{{ props.candidate.lastName }} {{ props.candidate.firstName }} | {{ props.candidate.schoolClass }}</h3>

    <h4>Punkte: {{ props.candidate.electionStats.points }}</h4>
    <h4>Erststimmen: {{ props.candidate.electionStats.numberOfFirstVotes }}</h4>

    <label for="firstVote">Erststimme</label>
    <input class="x" :disabled="!props.firstVoteEnabled && !props.candidate.firstVoteChecked"
           type="checkbox" name="firstVote" id="firstVote"
           @change="change(VoteType.FIRST_VOTE)">

    <label for="secondaryVote">Zweitstimme</label>
    <input :disabled="!props.secondaryVoteEnabled && !props.candidate.secondaryVoteChecked"
           type="checkbox"
           name="secondaryVote"
           id="secondaryVote"
           @change="change(VoteType.SECONDARY_VOTE)">
  </div>
</template>

<style scoped>

</style>