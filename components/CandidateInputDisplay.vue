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
  } as Candidate;

  emit("candidate", candidate);

  reset();
}

function isValid(
    firstName: string,
    lastName: string,
    schoolClass: string,
): boolean {
  return !(!firstName || !lastName || !schoolClass);
}

function reset() {
  firstName.value = "";
  lastName.value = "";
  schoolClass.value = "";
}

function generateClasses() {
  const grades = ['1', '2', '3', '4', '5'];
  const letters = ['A', 'B', 'C'];
  const hif = 'HIF';

  let schoolClasses: string[] = [];

  grades.forEach(grade => {
    letters.forEach(letter => {
      const className = grade + letter + hif;
      schoolClasses.push(className);
    });
  });

  return schoolClasses;
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
        <select>
          <option id="schoolClass" v-for="classItem in generateClasses()" :key="classItem">{{ classItem }}</option>
        </select>
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
button, select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

input[type="text"], select {
  width: 300px;
  box-sizing: border-box;
}

select {
  background: none;
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
