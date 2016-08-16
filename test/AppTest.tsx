/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />
/// <reference path="../typings/globals/promises-a-plus/index.d.ts" />
/// <reference path="../typings/globals/chai-as-promised/index.d.ts" />

import * as React from "react";
import { shallow } from "enzyme";
import App from "../src/App";

const expect = chai.expect;

describe("<App />", () => {
    let wrapper = shallow(<App />);
    it("is div", () => {
        expect(wrapper.is("div")).to.be.true;
    });
    it("has a Header", () => {
        expect(wrapper.find("Header")).to.have.length(1);
    });
    it("has a div.projects", () => {
        expect(wrapper.find("div.projects")).to.have.length(1);
    });
    it("contains correct number of Project elements in div.projects", () => {
        expect(wrapper.find("div.projects > Project")).to.have.length(3);
    });
});
