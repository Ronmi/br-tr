/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />
/// <reference path="../typings/globals/promises-a-plus/index.d.ts" />
/// <reference path="../typings/globals/chai-as-promised/index.d.ts" />

import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";

const expect = chai.expect;

describe("<Header />", () => {
    it("is div.header");
    it("has a div.logo");
    it("shows your company name in div.logo > span");
    it("has a div.search");
    it("has a search bar (DebouncedInput) in div.search");
    it("has a div.user");
    it("shows an image in div.user");
});
