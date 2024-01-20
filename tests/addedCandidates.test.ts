import { afterEach, expect, test } from "vitest";
import _addedCandidateDisplay from "../components/AddedCandidateDisplay.vue";
import { mount } from "@vue/test-utils";
import type { Candidate, ElectionStats } from "~/utils/types";

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

describe("addedCandidate tests", () => {
  afterEach(() => {
    candidate1 = {
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
  });

  test("delete_candidate", async () => {
    expect(_addedCandidateDisplay).toBeTruthy();

    const wrapper = mount(_addedCandidateDisplay, {
      props: { addedCandidate: candidate1 },
    });

    wrapper.vm.deleteAddedCandidate();

    const candidate: Candidate[] = wrapper.emitted()
        .delete[0] as unknown as Candidate[];

    expect(candidate[0].lastName).toEqual("Frischmann");
  });
});
