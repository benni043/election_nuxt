<script setup lang="ts">
import type { BallotPaper } from "~/utils/types";
import type { UUID } from "node:crypto";

let props = defineProps<{
  ballotPaper: BallotPaper;
}>();

let emit = defineEmits<{
  primaryVote: [id: UUID];
  secondaryVote: [id: UUID];
}>();

function change() {
  if (props.ballotPaper.firstVoteCandidate)
    emit("primaryVote", props.ballotPaper.firstVoteCandidate.id);
  if (props.ballotPaper.secondaryVoteCandidate)
    emit("secondaryVote", props.ballotPaper.secondaryVoteCandidate.id);
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

    <button>Ändern</button>
  </div>
</template>

<style scoped></style>
