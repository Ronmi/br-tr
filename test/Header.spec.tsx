/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />
/// <reference path="../typings/globals/promises-a-plus/index.d.ts" />
/// <reference path="../typings/globals/chai-as-promised/index.d.ts" />

import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import Header, { Props } from "../src/Header";

const expect = chai.expect;

function prop(): Props {
    return {
        keywordChanged: sinon.spy(),
        name: "test",
        img: "test_image",
	loginURL: "http://google.com",
    };
}

describe("<Header />", () => {

    // some common tests
    let wrapper = shallow(<Header {...prop() } />);
    it("is div.header", () => {
        expect(wrapper.is("div.header")).to.be.true;
    });
    it("has a div.logo", () => {
        expect(wrapper.find("div.logo")).to.have.length(1);
    });
    it("shows your company name in div.logo > span", () => {
        expect(wrapper.find("div.logo").text()).to.equal("test");
    });
    it("has a div.search", () => {
        expect(wrapper.find("div.search")).to.have.length(1);
    });
    it("has a search bar (DebouncedInput) in div.search", () => {
        expect(wrapper.find("div.search > DebouncedInput")).to.have.length(1);
    });
    it("has a div.user", () => {
        expect(wrapper.find("div.user")).to.have.length(1);
    });
    it("has a link to login in div.user", () => {
        expect(wrapper.find("div.user a").prop("href")).to.equal("http://google.com");
    });
    it("shows an image in div.user", () => {
        expect(wrapper.find("div.user a > img").prop("src")).to.equal("test_image");
    });
});
