<script setup lang="ts">
import type { Candidate } from "~/utils/types";

let props = defineProps<{
  candidate: Candidate;
}>();
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
</style>
