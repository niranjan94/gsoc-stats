var _ = require('underscore');
var GendrFactory = require('gendr');
var Strategies = GendrFactory.Strategies;
var async = require('async');
var fs = require("fs");

var Gendr = GendrFactory.create([
    Strategies.CENSUS.US,
    Strategies.CENSUS.WORLD,
    Strategies.WEB.BABYNAMEGUESSER,
    Strategies.WEB.BEHINDTHENAME
]);

function save(data, what) {
    fs.writeFileSync("./out/" + what + ".json", JSON.stringify(data));
}
module.exports = {
    analyse(parser) {
        "use strict";

        save(_.countBy(parser.getProjects(), function (project) {
            return project.organization.name;
        }), "projects_per_organization");
        console.log("Projects per organization. Done.");

        save(_.countBy(parser.getOrganizations(), function (organization) {
            return organization.category;
        }), "organizations_category");
        console.log("Organizations per category. Done.");

        save(_.countBy(parser.getOrganizations(), function (organization) {
            return organization.primary_open_source_license;
        }), "organizations_primary_license");
        console.log("Organizations per license type. Done.");

        console.log("Guessing students' gender. Start.");
        async.map(parser.getProjects(), function (project, callback) {
            Gendr.guess(project.student.display_name, function(err, gender) {
                var fixedGender = function () {
                    if(gender != null) {
                        if(gender.gender == "M" || gender.gender == "?M") {
                            return "Male";
                        } else if(gender.gender == "F" || gender.gender == "?F") {
                            return "Female";
                        } else {
                            return null
                        }
                    } else {
                        return null;
                    }
                } ();
                callback(err, fixedGender);
            });
        }, function(err, results){
            save(_.countBy(results, function (result) {
                return result;
            }), "students_gender_distribution");
            console.log("Guessing students' gender. Done.");
        });

        console.log("Analysis complete. Results saved in ./out/*");
    }
};