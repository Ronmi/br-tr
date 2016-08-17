/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />
/// <reference path="../typings/globals/promises-a-plus/index.d.ts" />
/// <reference path="../typings/globals/chai-as-promised/index.d.ts" />

import { API, ChangeSet, Callback } from "../src/API";
import { ByMock } from "./FakeAPI";

const expect = chai.expect;

describe("Mocked APIs", () => {
    it("should success for updateOwner if it.should.success", () => {
        let api = new ByMock;
        api.should.success;
        expect(api.updateOwner("", "")).to.be.fulfilled;
    });
    it("should fail for updateOwner if it.should.fail", () => {
        let api = new ByMock;
        api.should.fail;
        expect(api.updateOwner("", "")).to.be.rejected;
    });
    it("should success for updateDesc if it.should.success", () => {
        let api = new ByMock;
        api.should.success;
        expect(api.updateDesc("", "")).to.be.fulfilled;
    });
    it("should fail for updateDesc if it.should.fail", () => {
        let api = new ByMock;
        api.should.fail;
        expect(api.updateDesc("", "")).to.be.rejected;
    });
    it("calls all cb with correct changeset", () => {
        const c: ChangeSet = {
            modified: [],
            deleted: [],
        };

        let cb1 = sinon.spy();
        let cb2 = sinon.spy();
        let api = new ByMock;

        api.onUpdate(cb1);
        api.onUpdate(cb2);
        api.update(c);

        expect(cb1).to.be.calledOnce;
        expect(cb1).to.be.calledWith(c);
        expect(cb2).to.be.calledOnce;
        expect(cb2).to.be.calledWith(c);
    });
});
