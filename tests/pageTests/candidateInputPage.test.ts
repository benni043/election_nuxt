import { afterEach, beforeEach, expect, test } from "vitest";
import type { Candidate, ElectionStats } from "~/utils/types";
import { useCandidateStore } from "#imports";
import _candidateInputPage from "~/pages/CandidateInputPage.vue";
import { mount } from "@vue/test-utils";

let candidateStore = useCandidateStore();

describe("candidateInputPage tests", () => {
  beforeEach(() => {
    let candidate1 = {
      id: crypto.randomUUID(),
      lastName: "Frischmann",
      firstName: "Tobias",
      schoolClass: "4AHIF",
      primaryVoteChecked: false,
      secondaryVoteChecked: false,
      electionStats: {
        points: 1,
        numberOfFirstVotes: 0,
      } as ElectionStats,
    } as Candidate;

    candidateStore.candidates.push(candidate1);
  });

  afterEach(() => {
    candidateStore.$reset();
  });

  test("check if redirect to main clears candidate list", () => {
    expect(_candidateInputPage).toBeTruthy();

    const wrapper = mount(_candidateInputPage);

    wrapper.vm.redirectToMainMenu();

    expect(candidateStore.candidates.length).toEqual(0);
  });

  test("check if redirect to vote page adds invalid and updates local storage", () => {
    expect(_candidateInputPage).toBeTruthy();

    const wrapper = mount(_candidateInputPage);

    wrapper.vm.redirectToVotePage();

    //check if candidateStore saves all candidates
    expect(candidateStore.candidates.length).toEqual(2);
    //check if localStorage saves all candidates
    expect(JSON.parse(localStorage.getItem("candidates")!).length).toEqual(2);
  });
});
