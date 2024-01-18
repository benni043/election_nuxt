<script setup lang="ts">
import type { Candidate } from "~/utils/types";

let props = defineProps<{
  addedCandidate: Candidate;
}>();

let emit = defineEmits<{
  delete: [addedCandidate: Candidate];
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
  width: 300px;

  display: flex;
  flex-direction: column;
  align-items: center;
}

#head {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

</style>
