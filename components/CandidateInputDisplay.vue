<script setup lang="ts">
import type {Candidate, ElectionStats} from "~/utils/types";

let firstName = ref("");
let lastName = ref("");
let schoolClass = ref("");

let emit = defineEmits<{
  candidate: [candidate: Candidate];
}>();

function submitForm() {
  if (!isValid(firstName.value, lastName.value, schoolClass.value)) return;

  let candidate = {
    id: crypto.randomUUID(),
    firstName: firstName.value,
    lastName: lastName.value,
    schoolClass: schoolClass.value,

    primaryVoteChecked: false,
    secondaryVoteChecked: false,

    electionStats: {
      points: 0,
      numberOfFirstVotes: 0,
    } as ElectionStats,

    canDoubleVote: false
  } as Candidate;

  emit("candidate", candidate);

  reset();
}

function isValid(firstName: string, lastName: string, schoolClass: string): boolean {
  return !(!firstName || !lastName || !schoolClass);

}

function reset() {
  firstName.value = "";
  lastName.value = "";
  schoolClass.value = "";
}
</script>

<template>
  <div class="container">
    <form @submit.prevent="submitForm" class="form">
      <div class="form-group">
        <label for="firstName">Vorname:</label>
        <input type="text" id="firstName" v-model="firstName"/>
      </div>
      <div class="form-group">
        <label for="lastName">Nachname:</label>
        <input type="text" id="lastName" v-model="lastName"/>
      </div>
      <div class="form-group">
        <label for="schoolClass">Klasse:</label>
        <input type="text" id="schoolClass" v-model="schoolClass"/>
      </div>
      <button type="submit">Bestätigen</button>
    </form>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}

.form {
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  display: flex;
  flex-direction: column;
  max-width: 300px;
  height: min-content;
  margin: 0 auto;
  border: 3px solid black;
}

.form-group {
  margin-bottom: 15px;
}

label {
  color: black;
  margin-bottom: 5px;
  display: block;
  font-size: 18px;
  font-weight: bold;
}

input[type="text"],
button {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

input[type="text"] {
  width: 300px;
  box-sizing: border-box;
}

button {
  background-color: #fff;
  color: black;
  width: 300px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s,
  color 0.3s;
}

button:hover {
  background-color: #ddd;
}
</style>
