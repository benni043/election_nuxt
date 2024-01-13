<script setup lang="ts">

import type {Candidate} from "~/utils/types";

let props = defineProps<{
  addedCandidate: Candidate;
}>();

let emit = defineEmits<{
  delete: [addedCandidate: Candidate]
}>();

function deleteAddedCandidate() {
  emit("delete", props.addedCandidate);
}

</script>

<template>
  <div id="outer">
    <div id="head">
      {{ props.addedCandidate.lastName }} {{ props.addedCandidate.firstName }} |
      {{ props.addedCandidate.schoolClass }}
    </div>

    <button @click="deleteAddedCandidate">Löschen</button>
  </div>
</template>

<style scoped>
#outer {
  border: 3px solid black;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  width: 150px;

  display: flex;
  flex-direction: column;
  align-items: center;
}

#head {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

button {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin: 5px;
  width: 100px;
  background-color: #fff;
  color: black;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s,
  color 0.3s;
}

button:hover {
  background-color: #ddd;
}

button:disabled {
  background-color: #cccccc;
  color: #888888;
  cursor: default;
}
</style>