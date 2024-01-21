import { expect, test } from "vitest";
import _index from "../../pages/index.vue";
import { mount } from "@vue/test-utils";
import type { Candidate, ElectionStats } from "~/utils/types";

describe("candidateInputPage tests", () => {
  test("check if restore button is disabled when no stored data", () => {
    expect(_index).toBeTruthy();

    const wrapper = mount(_index);

    let button = wrapper.find("#restoreButton");

    // @ts-ignore
    expect(button.element.disabled).toBeTruthy();
  });

  test("check if restore button is disabled when no stored data", () => {
    expect(_index).toBeTruthy();

    const wrapper = mount(_index);

    localStorage.setItem(
      "candidates",
      JSON.stringify([
        {
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
        } as Candidate,
      ]),
    );

    // @ts-ignore
    expect(wrapper.vm.hasStoredData()).toBeTruthy();
  });

  test("check if button disabled when not all files are selected", () => {
    expect(_index).toBeTruthy();

    const wrapper = mount(_index);

    let button = wrapper.find("#localFilesButton");

    // @ts-ignore
    expect(button.element.disabled).toBeTruthy();
  });
});
