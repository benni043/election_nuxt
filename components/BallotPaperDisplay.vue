<script setup lang="ts">
import type { BallotPaper, Candidate } from "~/utils/types";
import type { UUID } from "node:crypto";

let props = defineProps<{
  ballotPaper: BallotPaper;
}>();

let emit = defineEmits<{
  primaryVote: [id: Candidate];
  secondaryVote: [id: Candidate];
}>();

function change() {
  if (props.ballotPaper.firstVoteCandidate) {
    props.ballotPaper.firstVoteCandidate.primaryVoteChecked = true;
    props.ballotPaper.firstVoteCandidate.electionStats.points -= 2;
    props.ballotPaper.firstVoteCandidate.electionStats.numberOfFirstVotes -= 1;

    emit("primaryVote", props.ballotPaper.firstVoteCandidate);
  }
  if (props.ballotPaper.secondaryVoteCandidate) {
    props.ballotPaper.secondaryVoteCandidate.secondaryVoteChecked = true;
    props.ballotPaper.secondaryVoteCandidate.electionStats.points -= 1;

    emit("secondaryVote", props.ballotPaper.secondaryVoteCandidate);
  }
}
</script>

<template>
  <div>
    <div>{{ props.ballotPaper.id }}</div>

    <div v-if="props.ballotPaper.firstVoteCandidate">
      <span>Erststimme:</span>
      <span>
        {{ props.ballotPaper.firstVoteCandidate.lastName }}
        {{ props.ballotPaper.firstVoteCandidate.firstName }} |
        {{ props.ballotPaper.firstVoteCandidate.schoolClass }}</span
      >
    </div>

    <div v-if="props.ballotPaper.secondaryVoteCandidate">
      <span>Zweitstimme:</span>
      <span>
        {{ props.ballotPaper.secondaryVoteCandidate.lastName }}
        {{ props.ballotPaper.secondaryVoteCandidate.firstName }} |
        {{ props.ballotPaper.secondaryVoteCandidate.schoolClass }}</span
      >
    </div>

    <button @click="change">Ändern</button>
  </div>
</template>

<style scoped></style>
