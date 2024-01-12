<script setup lang="ts">
import type { BallotPaper, Candidate } from "~/utils/types";

let props = defineProps<{
  ballotPaper: BallotPaper;
  disabled: boolean;
}>();

let emit = defineEmits<{
  primaryVote: [id: Candidate];
  secondaryVote: [id: Candidate];
  activeBallotPaper: [ballotPaper: BallotPaper];
}>();

function change() {
  if (props.ballotPaper.primaryVoteCandidate) {
    props.ballotPaper.primaryVoteCandidate.primaryVoteChecked = true;
    props.ballotPaper.primaryVoteCandidate.electionStats.points -= 2;
    props.ballotPaper.primaryVoteCandidate.electionStats.numberOfFirstVotes -= 1;

    emit("primaryVote", props.ballotPaper.primaryVoteCandidate);
  }

  if (props.ballotPaper.secondaryVoteCandidate) {
    props.ballotPaper.secondaryVoteCandidate.secondaryVoteChecked = true;
    props.ballotPaper.secondaryVoteCandidate.electionStats.points -= 1;

    emit("secondaryVote", props.ballotPaper.secondaryVoteCandidate);
  }

  if (
    props.ballotPaper.primaryVoteCandidate ||
    props.ballotPaper.secondaryVoteCandidate
  ) {
    emit("activeBallotPaper", props.ballotPaper);
  }
}
</script>

<template>
  <div id="outer" :class="{ inActive: !props.ballotPaper.isActive }">
    <div id="head">{{ props.ballotPaper.id }}</div>
    <div id="head2">Wahlkarte: {{ props.ballotPaper.ballotPaperNumber }}</div>

    <div class="data">
      <div v-if="props.ballotPaper.primaryVoteCandidate">
        <div class="innerHead">Erststimme:</div>
        <div>
          {{ props.ballotPaper.primaryVoteCandidate.lastName }}
          {{ props.ballotPaper.primaryVoteCandidate.firstName }} |
          {{ props.ballotPaper.primaryVoteCandidate.schoolClass }}
        </div>
      </div>

      <div v-if="props.ballotPaper.secondaryVoteCandidate">
        <div class="innerHead">Zweitstimme:</div>
        <div>
          {{ props.ballotPaper.secondaryVoteCandidate.lastName }}
          {{ props.ballotPaper.secondaryVoteCandidate.firstName }} |
          {{ props.ballotPaper.secondaryVoteCandidate.schoolClass }}
        </div>
      </div>
    </div>

    <button
      @click="change"
      :disabled="!props.ballotPaper.isActive || props.disabled"
    >
      Ändern
    </button>
  </div>
</template>

<style scoped>
.inActive {
  background: #cccccc !important;
}

#outer {
  border: 3px solid black;
  border-radius: 5px;
  padding: 20px;
  margin: 10px;

  display: flex;
  flex-direction: column;
}

#head {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

#head2 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.innerHead {
  font-weight: bold;
  margin: 5px 5px 0 0;
}

.data {
  font-size: 18px;
  margin-bottom: 10px;
}
</style>
