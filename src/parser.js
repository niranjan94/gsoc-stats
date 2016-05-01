


class Parser {

    constructor() {
        this.organizations = [];
        this.projects = [];
        this.raw = [];
    }

    getOrganizations() {
        return this.organizations;
    }

    getProjects() {
        return this.projects;
    }

    getRaw() {
        return this.raw;
    }

    parseAndAppend(json) {
        var data = Parser.parse(json);
        this.raw.concat(data);
        var parser = this;
        data.forEach(function (project) {
            var leanProject = Parser.cloneObject(project);
            delete leanProject.organization;
            leanProject.organization = {
                id: project.organization.id,
                name: project.organization.name
            };
            parser.projects.push(leanProject);
            parser.addOrganization(project.organization);
        });
    }

    addOrganization(organization) {
        Array.prototype.inArray = function(comparer) {
            for(var i=0; i < this.length; i++) {
                if(comparer(this[i])) return true;
            }
            return false;
        };

        Array.prototype.pushIfNotExist = function(element, comparer) {
            if (!this.inArray(comparer)) {
                this.push(element);
            }
        };

        this.organizations.pushIfNotExist(organization, function(e) {
            return e.id === organization.id;
        });
    }

    static parse(json) {
        return JSON.parse(json).results;
    }

    static cloneObject(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        var temp = obj.constructor();
        for (var key in obj) {
            temp[key] = Parser.cloneObject(obj[key]);
        }
        return temp;
    }
}

module.exports = Parser;