const fs = require('fs')
const NodeID3 = require('../index.js')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const { expect } = chai
chai.use(chaiAsPromised)

describe('NodeID3.Promise', function () {
    const invalidFilepath = 'should-hopefully-not-be-a-valid-file.mp3'
    const testFilepath = 'write-promise-test-file.mp3'
    describe('#create()', function () {
        it('resolve', function () {
            return expect(
                NodeID3.Promise.create({})
            ).to.eventually.be.instanceOf(Buffer)
        })
    })
    const writeTestCases = [
        ['#write()', NodeID3.Promise.write],
        ['#update()', NodeID3.Promise.update]
    ]
    writeTestCases.forEach(([name, fn]) => {
        describe(name, function () {
            describe('with buffer', function() {
                it('resolve', function () {
                    return expect(
                        fn({}, Buffer.alloc(0))
                    ).to.eventually.be.instanceOf(Buffer)
                })
            })
            describe('with invalid file path', function() {
                it('reject', function () {
                    return expect(
                        fn({}, invalidFilepath)
                    ).to.eventually.be.rejectedWith(Error)
                })
            })
            describe('with valid file path', function() {
                before(function() {
                    fs.writeFileSync(testFilepath, Buffer.alloc(0))
                })
                it('resolve', function () {
                    return expect(
                        fn({}, testFilepath)
                    ).to.eventually.be.fulfilled
                })
                after(function() {
                    fs.unlinkSync(testFilepath)
                })
            })
        })
    })
    describe('#read()', function () {
        describe('with buffer', function() {
            it('resolve', function () {
                return expect(
                    NodeID3.Promise.read(Buffer.alloc(0))
                ).to.eventually.to.have.key('raw')
            })
        })
        describe('with invalid file path', function() {
            it('reject', function () {
                return expect(
                    NodeID3.Promise.read(invalidFilepath)
                ).to.eventually.be.rejectedWith(Error)
            })
        })
        describe('with valid file path', function() {
            before(function() {
                fs.writeFileSync(testFilepath, Buffer.alloc(0))
            })
            it('resolve', function () {
                return expect(
                    NodeID3.Promise.read(testFilepath)
                ).to.eventually.to.have.key('raw')
            })
            after(function() {
                fs.unlinkSync(testFilepath)
            })
        })
    })
    describe('#removeTags()', function () {
        describe('with invalid file path', function() {
            it('reject', function () {
                return expect(
                    NodeID3.Promise.removeTags(invalidFilepath)
                ).to.eventually.be.rejectedWith(Error)
            })
        })
        describe('with valid file path', function() {
            before(function() {
                fs.writeFileSync(testFilepath, Buffer.alloc(0))
            })
            it('resolve', function () {
                return expect(
                    NodeID3.Promise.removeTags(testFilepath)
                ).to.eventually.be.fulfilled
            })
            after(function() {
                fs.unlinkSync(testFilepath)
            })
        })
    })
})
