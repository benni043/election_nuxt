import {afterEach, expect, test} from "vitest";
import _candidateDisplay from "~/components/CandidateDisplay.vue";
import { mount } from "@vue/test-utils";
import { type Candidate, type ElectionStats, VoteType } from "~/utils/types";

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
describe("candidateDisplay test", () => {
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
  })

  test("emit_first_vote", async () => {
    expect(_candidateDisplay).toBeTruthy();

    const wrapper = mount(_candidateDisplay, {
      props: {
        candidate: candidate1,
        isPrimaryVoteClicked: false,
        isSecondaryVoteClicked: false,
        canDoubleVote: false,
      },
    });

    wrapper.vm.change(VoteType.FIRST_VOTE);

    const candidate: Candidate[] = wrapper.emitted()
      .primaryVote[0] as unknown as Candidate[];

    expect(candidate[0].lastName).toEqual("Frischmann");
  });

  test("check_if_input_is_disabled_when_primaryVote_is_true", () => {
    expect(_candidateDisplay).toBeTruthy();

    const wrapper = mount(_candidateDisplay, {
      props: {
        candidate: candidate1,
        isPrimaryVoteClicked: true,
        isSecondaryVoteClicked: false,
        canDoubleVote: false,
      },
    });

    const inputField = wrapper.find("#firstVote");

    // @ts-ignore
    expect(inputField.element.disabled).toBeFalsy();
  })

  test("check_if_input_is_enabled_when_secondaryVote_is_false", () => {
    expect(_candidateDisplay).toBeTruthy();

    const wrapper = mount(_candidateDisplay, {
      props: {
        candidate: candidate1,
        isPrimaryVoteClicked: true,
        isSecondaryVoteClicked: false,
        canDoubleVote: false,
      },
    });

    const inputField = wrapper.find("#secondaryVote");

    // @ts-ignore
    expect(inputField.element.disabled).toBeTruthy();
  })

  test("check_if_input_is_enabled_when_primaryVote_is_true_and_primary_is_checked", () => {
    expect(_candidateDisplay).toBeTruthy();

    const wrapper = mount(_candidateDisplay, {
      props: {
        candidate: {
          id: crypto.randomUUID(),
          lastName: "Frischmann",
          firstName: "Tobias",
          schoolClass: "4AHIF",
          primaryVoteChecked: true,
          secondaryVoteChecked: false,
          electionStats: {
            points: 1,
            numberOfFirstVotes: 0,
          } as ElectionStats,
        } as Candidate,
        isPrimaryVoteClicked: true,
        isSecondaryVoteClicked: false,
        canDoubleVote: false,
      },
    });

    const inputField = wrapper.find("#firstVote");

    // @ts-ignore
    expect(inputField.element.disabled).toBeFalsy();
  })

  test("cant_click_both", () => {
    expect(_candidateDisplay).toBeTruthy();

    const wrapper = mount(_candidateDisplay, {
      props: {
        candidate: {
          id: crypto.randomUUID(),
          lastName: "Frischmann",
          firstName: "Tobias",
          schoolClass: "4AHIF",
          primaryVoteChecked: true,
          secondaryVoteChecked: false,
          electionStats: {
            points: 1,
            numberOfFirstVotes: 0,
          } as ElectionStats,
        } as Candidate,
        isPrimaryVoteClicked: false,
        isSecondaryVoteClicked: true,
        canDoubleVote: false,
      },
    });

    const inputField = wrapper.find("#secondaryVote");

    // @ts-ignore
    expect(inputField.element.disabled).toBeTruthy();
  })

  test("check_if_can_click_both_when_invalid", () => {
    expect(_candidateDisplay).toBeTruthy();

    const wrapper = mount(_candidateDisplay, {
      props: {
        candidate: {
          id: crypto.randomUUID(),
          lastName: "Ungültig",
          firstName: "Ungültig",
          schoolClass: "Ungültig",
          primaryVoteChecked: true,
          secondaryVoteChecked: false,
          electionStats: {
            points: 1,
            numberOfFirstVotes: 0,
          } as ElectionStats,
        } as Candidate,
        isPrimaryVoteClicked: false,
        isSecondaryVoteClicked: true,
        canDoubleVote: true,
      },
    });

    const inputField = wrapper.find("#secondaryVote");

    // @ts-ignore
    expect(inputField.element.disabled).toBeFalsy();
  })
});
