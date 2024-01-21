import { afterEach, beforeEach, expect, test } from "vitest";
import _resultPage from "../../pages/ResultPage.vue";
import { mount } from "@vue/test-utils";
import type { BallotPaper, Candidate, ElectionStats } from "~/utils/types";
import * as crypto from "crypto";
import { useBallotPaperStore, useCandidateStore } from "#imports";
import { wrap } from "unenv/runtime/node/module";

let candidateStore = useCandidateStore();
let ballotPaperStore = useBallotPaperStore();

describe("resultPage tests", () => {
  beforeEach(() => {
    let candidate1 = {
      id: crypto.randomUUID(),
      lastName: "Frischmann",
      firstName: "Tobias",
      schoolClass: "4AHIF",
      primaryVoteChecked: false,
      secondaryVoteChecked: false,
      electionStats: {
        points: 4,
        numberOfFirstVotes: 2,
      } as ElectionStats,
    } as Candidate;

    let candidate2 = {
      id: crypto.randomUUID(),
      lastName: "Huff",
      firstName: "Benedikt",
      schoolClass: "4AHIF",
      primaryVoteChecked: false,
      secondaryVoteChecked: false,
      electionStats: {
        points: 3,
        numberOfFirstVotes: 0,
      } as ElectionStats,
    } as Candidate;

    let invalid = {
      id: crypto.randomUUID(),
      lastName: "Ungültig",
      firstName: "Ungültig",
      schoolClass: "Ungültig",
      primaryVoteChecked: false,
      secondaryVoteChecked: false,
      electionStats: {
        points: 5,
        numberOfFirstVotes: 2,
      } as ElectionStats,
    } as Candidate;

    candidateStore.candidates.push(invalid);
    candidateStore.candidates.push(candidate1);
    candidateStore.candidates.push(candidate2);

    let ballotPaper1 = {
      id: crypto.randomUUID(),
      isActive: true,
      ballotPaperNumber: 1,
      primaryVoteCandidate: candidate1,
      secondaryVoteCandidate: candidate2,
    } as BallotPaper;

    let ballotPaper2 = {
      id: crypto.randomUUID(),
      isActive: true,
      ballotPaperNumber: 2,
      primaryVoteCandidate: candidate1,
      secondaryVoteCandidate: candidate2,
    } as BallotPaper;

    let ballotPaper3 = {
      id: crypto.randomUUID(),
      isActive: true,
      ballotPaperNumber: 3,
      primaryVoteCandidate: invalid,
      secondaryVoteCandidate: candidate2,
    } as BallotPaper;

    let ballotPaper4 = {
      id: crypto.randomUUID(),
      isActive: true,
      ballotPaperNumber: 4,
      primaryVoteCandidate: invalid,
      secondaryVoteCandidate: invalid,
    } as BallotPaper;

    ballotPaperStore.ballotPapers.push(ballotPaper1);
    ballotPaperStore.ballotPapers.push(ballotPaper2);
    ballotPaperStore.ballotPapers.push(ballotPaper3);
    ballotPaperStore.ballotPapers.push(ballotPaper4);
  });

  afterEach(() => {
    candidateStore.$reset();
    ballotPaperStore.$reset();
  });

  test("check if correct valid and invalid count", () => {
    expect(_resultPage).toBeTruthy();

    let wrapper = mount(_resultPage);

    const validVoteCount = wrapper.vm.validVoteCount;
    const invalidVoteCount = wrapper.vm.invalidVoteCount;

    expect(validVoteCount).toEqual(3);
    expect(invalidVoteCount).toEqual(1);
  });

  test("check if reset works", () => {
    expect(_resultPage).toBeTruthy();

    let wrapper = mount(_resultPage);

    wrapper.vm.reset();

    const validVoteCount = wrapper.vm.validVoteCount;
    const invalidVoteCount = wrapper.vm.invalidVoteCount;

    expect(validVoteCount).toEqual(0);
    expect(invalidVoteCount).toEqual(0);
    expect(candidateStore.candidates.length).toEqual(0);
    expect(ballotPaperStore.ballotPapers.length).toEqual(0);
    expect(localStorage.getItem("candidates")).toBeNull();
    expect(localStorage.getItem("ballots")).toBeNull();
  });
});
