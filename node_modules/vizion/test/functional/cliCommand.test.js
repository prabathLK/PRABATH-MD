var expect = require('chai').expect;
var cliCommand = require("../../lib/cliCommand.js");

describe('Functional: cliCommand', function () {

    it("ok", function () {
        var target, folder;

        if (/^win/.exec(process.platform)) {
            folder = "C:\\Program Files\\nodejs\\foobar";
            target = "cd \"" + folder + "\" && git status -s";
        }
        else {
            folder = "/etc/node/foobar";
            target = "cd '" + folder + "';LC_ALL=en_US.UTF-8 git status -s";
        }


        var result = cliCommand(folder, "git status -s");
        expect(target).to.eq(result);
    });

});
