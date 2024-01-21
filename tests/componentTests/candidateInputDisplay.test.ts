import _candidateInputDisplay from "../../components/CandidateInputDisplay.vue";
import { expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import type { Candidate } from "~/utils/types";

describe("candidateInput test", () => {
  test("try_to_add_user_with_empty_form", async () => {
    expect(_candidateInputDisplay).toBeTruthy();

    const wrapper = mount(_candidateInputDisplay);

    wrapper.vm.submitForm();

    expect(wrapper.emitted().candidate).toBeUndefined();
  });

  test("try_to_add_user_with_half_empty_form", async () => {
    expect(_candidateInputDisplay).toBeTruthy();

    const wrapper = mount(_candidateInputDisplay);

    await wrapper.find("#lastName").setValue("Huff");

    wrapper.vm.submitForm();

    expect(wrapper.emitted().candidate).toBeUndefined();
  });

  test("add_candidate", async () => {
    expect(_candidateInputDisplay).toBeTruthy();

    const wrapper = mount(_candidateInputDisplay);

    await wrapper.find("#firstName").setValue("Benedikt");
    await wrapper.find("#lastName").setValue("Huff");
    await wrapper.find("#schoolClass").setValue("4AHIF");

    wrapper.vm.submitForm();

    const candidate: Candidate[] = wrapper.emitted()
      .candidate[0] as unknown as Candidate[];

    expect(candidate[0].lastName).toEqual("Huff");
  });

  test("generate_classes", async () => {
    expect(_candidateInputDisplay).toBeTruthy();

    const wrapper = mount(_candidateInputDisplay);

    expect(wrapper.vm.generateClasses()).toEqual([
      "1AHIF",
      "1BHIF",
      "1CHIF",
      "2AHIF",
      "2BHIF",
      "2CHIF",
      "3AHIF",
      "3BHIF",
      "3CHIF",
      "4AHIF",
      "4BHIF",
      "4CHIF",
      "5AHIF",
      "5BHIF",
      "5CHIF",
    ]);
  });
});
