import { afterEach, beforeEach, expect, test } from "vitest";

import type { BallotPaper, Candidate, ElectionStats } from "~/utils/types";

import _ballotPaperDisplay from "../components/BallotPaperDisplay.vue";
import { mount } from "@vue/test-utils";
import { useBallotPaperStore, useCandidateStore } from "#imports";

let candidate1 = {
  id: crypto.randomUUID(),
  lastName: "Huff",
  firstName: "Benedikt",
  schoolClass: "4AHIF",
  primaryVoteChecked: false,
  secondaryVoteChecked: false,
  electionStats: {
    points: 2,
    numberOfFirstVotes: 1,
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
    points: 1,
    numberOfFirstVotes: 0,
  } as ElectionStats,
} as Candidate;

let ballotPaper = {
  ballotPaperNumber: 1,
  id: crypto.randomUUID(),
  isActive: true,
  primaryVoteCandidate: candidate1,
  secondaryVoteCandidate: candidate2,
} as BallotPaper;

let candidateStore = useCandidateStore();
let ballotPaperStore = useBallotPaperStore();

describe("ballotPaper test", () => {
  beforeEach(() => {
    candidateStore.candidates.push(candidate1);
    candidateStore.candidates.push(candidate2);

    ballotPaperStore.ballotPapers.push(ballotPaper);
  });

  afterEach(() => {
    candidateStore.$reset();
    ballotPaperStore.$reset();

    candidate1 = {
      id: crypto.randomUUID(),
      lastName: "Huff",
      firstName: "Benedikt",
      schoolClass: "4AHIF",
      primaryVoteChecked: false,
      secondaryVoteChecked: false,
      electionStats: {
        points: 2,
        numberOfFirstVotes: 1,
      } as ElectionStats,
    } as Candidate;

    candidate2 = {
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

    ballotPaper = {
      ballotPaperNumber: 1,
      id: crypto.randomUUID(),
      isActive: true,
      primaryVoteCandidate: candidate1,
      secondaryVoteCandidate: candidate2,
    } as BallotPaper;
  });

  test("remove", async () => {
    expect(_ballotPaperDisplay).toBeTruthy();

    let oldPrimaryCandidateStats = JSON.parse(
      JSON.stringify(candidateStore.getByID(candidate1.id)?.electionStats),
    );
    let oldSecondaryCandidateStats = JSON.parse(
      JSON.stringify(candidateStore.getByID(candidate2.id)?.electionStats),
    );

    const wrapper = mount(_ballotPaperDisplay, {
      props: { ballotPaper: ballotPaper, disabled: false },
    });

    await wrapper.find("#remove").trigger("click");

    expect(
      candidateStore.getByID(candidate1.id)?.electionStats.numberOfFirstVotes,
    ).toBe(oldPrimaryCandidateStats?.numberOfFirstVotes! - 1);
    expect(candidateStore.getByID(candidate1.id)?.electionStats.points).toBe(
      oldPrimaryCandidateStats?.points! - 2,
    );

    expect(
      candidateStore.getByID(candidate2.id)?.electionStats.numberOfFirstVotes,
    ).toBe(oldSecondaryCandidateStats?.numberOfFirstVotes!);
    expect(candidateStore.getByID(candidate2.id)?.electionStats.points).toBe(
      oldSecondaryCandidateStats?.points! - 1,
    );
  });

  test("change", async () => {
    expect(_ballotPaperDisplay).toBeTruthy();

    let oldPrimaryCandidate = JSON.parse(
      JSON.stringify(candidateStore.getByID(candidate1.id)),
    );
    let oldSecondaryCandidate = JSON.parse(
      JSON.stringify(candidateStore.getByID(candidate2.id)),
    );

    const wrapper = mount(_ballotPaperDisplay, {
      props: { ballotPaper: ballotPaper, disabled: false },
    });

    await wrapper.find("#change").trigger("click");

    expect(
      candidateStore.getByID(candidate1.id)?.electionStats.numberOfFirstVotes,
    ).toBe(oldPrimaryCandidate.electionStats.numberOfFirstVotes! - 1);
    expect(candidateStore.getByID(candidate1.id)?.electionStats.points).toBe(
      oldPrimaryCandidate.electionStats.points! - 2,
    );
    expect(
      candidateStore.getByID(candidate1.id)?.primaryVoteChecked,
    ).toBeTruthy();

    expect(
      candidateStore.getByID(candidate2.id)?.electionStats.numberOfFirstVotes,
    ).toBe(oldSecondaryCandidate.electionStats.numberOfFirstVotes!);
    expect(candidateStore.getByID(candidate2.id)?.electionStats.points).toBe(
      oldSecondaryCandidate.electionStats.points! - 1,
    );
    expect(
      candidateStore.getByID(candidate2.id)?.secondaryVoteChecked,
    ).toBeTruthy();
  });

  test("click_remove_when_disabled", async () => {
    expect(_ballotPaperDisplay).toBeTruthy();

    let oldPrimaryCandidateStats = JSON.parse(
        JSON.stringify(candidateStore.getByID(candidate1.id)?.electionStats),
    );
    let oldSecondaryCandidateStats = JSON.parse(
        JSON.stringify(candidateStore.getByID(candidate2.id)?.electionStats),
    );

    ballotPaper.isActive = false;

    const wrapper = mount(_ballotPaperDisplay, {
      props: { ballotPaper: ballotPaper, disabled: false },
    });

    await wrapper.find("#remove").trigger("click");

    expect(
        candidateStore.getByID(candidate1.id)?.electionStats.numberOfFirstVotes,
    ).toBe(oldPrimaryCandidateStats?.numberOfFirstVotes!);
    expect(candidateStore.getByID(candidate1.id)?.electionStats.points).toBe(
        oldPrimaryCandidateStats?.points!,
    );

    expect(
        candidateStore.getByID(candidate2.id)?.electionStats.numberOfFirstVotes,
    ).toBe(oldSecondaryCandidateStats?.numberOfFirstVotes!);
    expect(candidateStore.getByID(candidate2.id)?.electionStats.points).toBe(
        oldSecondaryCandidateStats?.points!,
    );
  });
});
