import { useCandidateStore } from "~/stores/useCandidateStore";
import { useBallotPaperStore } from "~/stores/useBallotPaperStore";
import {afterEach, beforeEach, expect} from "vitest";
import crypto from "crypto";
import type { BallotPaper, Candidate, ElectionStats } from "~/utils/types";
import _votePage from "../../pages/VotePage.vue"
import {mount} from "@vue/test-utils";
import exp from "node:constants";

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

  test("check if ballot papers saves correctly", () => {
    expect(_votePage).toBeTruthy();

    const wrapper = mount(_votePage);

    let candidate1Copy = JSON.parse(JSON.stringify(candidateStore.candidates[0]));
    let candidate2Copy = JSON.parse(JSON.stringify(candidateStore.candidates[1]));

    let oldBallotPaperListLength = JSON.parse(JSON.stringify(ballotPaperStore.ballotPapers.length))

    wrapper.vm.primaryVoteCandidate = candidateStore.candidates[0];
    wrapper.vm.secondaryVoteCandidate = candidateStore.candidates[1];

    wrapper.vm.canSave = true;

    wrapper.vm.canPrimaryVoteBeClicked = false;
    wrapper.vm.canSecondaryVoteBeClicked = false;

    wrapper.vm.save();

    expect(candidateStore.candidates[0].electionStats.points).toEqual(candidate1Copy.electionStats.points + 2);
    expect(candidateStore.candidates[0].electionStats.numberOfFirstVotes).toEqual(candidate1Copy.electionStats.numberOfFirstVotes + 1);

    expect(candidateStore.candidates[1].electionStats.points).toEqual(candidate2Copy.electionStats.points + 1);

    expect(ballotPaperStore.ballotPapers.length).toEqual(oldBallotPaperListLength + 1)

    expect(JSON.parse(localStorage.getItem("ballots")!).length).toEqual(oldBallotPaperListLength + 1)
  })
});
