<script setup lang="ts">
import CandidateDisplay from "~/components/CandidateDisplay.vue";
import { type Candidate, type ElectionStats, VoteType } from "~/utils/types";
import type { UUID } from "node:crypto";

let candidates = reactive<Candidate[]>([]);

let candidate1 = {
  id: crypto.randomUUID(),
  lastName: "Huff",
  firstName: "Benedikt",
  schoolClass: "4AHIF",

  primaryVoteChecked: false,
  secondaryVoteChecked: false,

  electionStats: {
    points: 0,
    numberOfFirstVotes: 0,
  } as ElectionStats,
} as Candidate;
let candidate2 = {
  id: crypto.randomUUID(),
  lastName: "Frischmann",
  firstName: "Tobias",
  schoolClass: "4AHIF",

  primaryVoteChecked: false,
  secondaryVoteChecked: false,

  electionStats: {
    points: 0,
    numberOfFirstVotes: 0,
  } as ElectionStats,
} as Candidate;
let candidate3 = {
  id: crypto.randomUUID(),
  lastName: "Götz",
  firstName: "Fabian",
  schoolClass: "4AHIF",

  primaryVoteChecked: false,
  secondaryVoteChecked: false,

  electionStats: {
    points: 0,
    numberOfFirstVotes: 0,
  } as ElectionStats,
} as Candidate;

candidates.push(candidate1);
candidates.push(candidate2);
candidates.push(candidate3);

let primaryVoteEnabled = ref(true);
let secondaryVoteEnabled = ref(true);

let canSave = ref(false);

let primaryVoteCandidateID: UUID | null;
let secondaryVoteCandidateID: UUID | null;

function set(voteType: VoteType, id: UUID | null) {
  if (voteType === VoteType.FIRST_VOTE) {
    primaryVoteEnabled.value = !primaryVoteEnabled.value;
    primaryVoteCandidateID = primaryVoteEnabled.value ? null : id;
  } else {
    secondaryVoteEnabled.value = !secondaryVoteEnabled.value;
    secondaryVoteCandidateID = secondaryVoteEnabled.value ? null : id;
  }

  canSave.value = !primaryVoteEnabled.value || !secondaryVoteEnabled.value;
}

function save() {
  const primaryVoteIndex = getCandidateIndexByID(primaryVoteCandidateID!);
  if (primaryVoteIndex !== null) {
    candidates[primaryVoteIndex].electionStats.points += 2;
    candidates[primaryVoteIndex].electionStats.numberOfFirstVotes += 1;
  }

  const secondaryVoteIndex = getCandidateIndexByID(secondaryVoteCandidateID!);
  if (secondaryVoteIndex !== null)
    candidates[secondaryVoteIndex].electionStats.points += 1;

  reset();
}

function reset() {
  primaryVoteEnabled.value = true;
  secondaryVoteEnabled.value = true;

  canSave.value = false;

  primaryVoteCandidateID = null;
  secondaryVoteCandidateID = null;

  for (let candidate of candidates) {
    candidate.primaryVoteChecked = false;
    candidate.secondaryVoteChecked = false;
  }
}

function getCandidateIndexByID(id: UUID): number | null {
  for (let i = 0; i < candidates.length; i++) {
    if (candidates[i].id === id) return i;
  }

  return null;
}
</script>

<template>
  <div id="outer">
    <CandidateInputDisplay
      @candidate="
        (candidate: Candidate) => {
          candidates.push(candidate);
        }
      "
    ></CandidateInputDisplay>

    <div id="inner">
      <div ref="refs" v-for="candidate in candidates">
        <CandidateDisplay
          :candidate="candidate"
          :primary-vote-enabled="primaryVoteEnabled"
          :secondary-vote-enabled="secondaryVoteEnabled"
          @primary-vote="
            (id: UUID) => {
              set(VoteType.FIRST_VOTE, id);
            }
          "
          @secondary-vote="
            (id: UUID) => {
              set(VoteType.SECONDARY_VOTE, id);
            }
          "
        ></CandidateDisplay>
      </div>

      <button :disabled="!canSave" @click="save">Speichern</button>
    </div>
  </div>
</template>

<style scoped>
#outer {
  display: flex;
  justify-content: space-around;
}

#inner {
  display: flex;
  flex-direction: column;
}
</style>
