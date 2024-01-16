<script setup lang="ts">
import { type Candidate, VoteType } from "~/utils/types";

let props = defineProps<{
  candidate: Candidate;
  isPrimaryVoteClicked: boolean;
  isSecondaryVoteClicked: boolean;
  canDoubleVote: boolean;
}>();

let emit = defineEmits<{
  primaryVote: [id: Candidate];
  secondaryVote: [id: Candidate];
}>();

function change(voteType: VoteType) {
  if (voteType === VoteType.FIRST_VOTE) emit("primaryVote", props.candidate);
  else emit("secondaryVote", props.candidate);
}
</script>

<template>
  <div id="outer">
    <div id="head">
      {{ props.candidate.lastName }} {{ props.candidate.firstName }} |
      {{ props.candidate.schoolClass }}
    </div>

    <div id="data">
      <div>Punkte: {{ props.candidate.electionStats.points }}</div>
      <div>
        Erststimmen: {{ props.candidate.electionStats.numberOfFirstVotes }}
      </div>
    </div>

    <div id="field">
      <div>
        <input
          :disabled="
            (!props.isPrimaryVoteClicked &&
              !props.candidate.primaryVoteChecked) ||
            (props.candidate.secondaryVoteChecked && !props.canDoubleVote)
          "
          v-model="props.candidate.primaryVoteChecked"
          type="checkbox"
          name="firstVote"
          id="firstVote"
          @change="change(VoteType.FIRST_VOTE)"
        />
        <label
          :class="{
            disabled:
              (!props.isPrimaryVoteClicked &&
                !props.candidate.primaryVoteChecked) ||
              (props.candidate.secondaryVoteChecked && !props.canDoubleVote),
          }"
          for="firstVote"
          >Erststimme</label
        >
      </div>

      <div>
        <input
          :disabled="
            (!props.isSecondaryVoteClicked &&
              !props.candidate.secondaryVoteChecked) ||
            (props.candidate.primaryVoteChecked && !props.canDoubleVote)
          "
          v-model="props.candidate.secondaryVoteChecked"
          type="checkbox"
          name="secondaryVote"
          id="secondaryVote"
          @change="change(VoteType.SECONDARY_VOTE)"
        />
        <label
          :class="{
            disabled:
              (!props.isSecondaryVoteClicked &&
                !props.candidate.secondaryVoteChecked) ||
              (props.candidate.primaryVoteChecked && !props.canDoubleVote),
          }"
          for="secondaryVote"
          >Zweitstimme</label
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
#outer {
  border: 3px solid black;
  border-radius: 5px;
  padding: 20px;
  margin: 10px;
  width: 300px;

  display: flex;
  flex-direction: column;
}

#head {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

#data {
  font-size: 18px;
  margin-bottom: 10px;
}

#field {
  font-size: 18px;
}

.disabled {
  color: #aaaaaa;
}

input {
  margin: 0 10px 0 0;
}
</style>
