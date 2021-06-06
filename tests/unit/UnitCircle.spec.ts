import { mount } from "@vue/test-utils";
import UnitCircle from "@/components/UnitCircle.vue";

describe("UnitCircle.vue", () => {

    it("renders correctly", () => {
        const wrapper = mount(UnitCircle);

        expect(wrapper.html()).toContain("Show sine curve");
        expect(wrapper.html()).toContain("Show cosine curve");
        expect(wrapper.html()).toContain("Show angle");
        expect(wrapper.html()).toContain("Velocity");
        expect(wrapper.html()).toContain("Revolutions");
        expect(wrapper.html()).toContain("canvas");
    });
});