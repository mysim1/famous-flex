SystemJS.config({
  browserConfig: {
    "paths": {
      "npm:": "/jspm_packages/npm/",
      "github:": "/jspm_packages/github/",
      "famous-flex/": "/src/"
    }
  },
  nodeConfig: {
    "paths": {
      "npm:": "jspm_packages/npm/",
      "github:": "jspm_packages/github/",
      "famous-flex/": "src/"
    }
  },
  transpiler: "plugin-babel",
  packages: {
    "famous-flex": {
      "main": "famous-flex.js",
      "meta": {
        "*.js": {
          "loader": "plugin-babel"
        }
      }
    }
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  map: {
    "es6-map": "npm:es6-map@0.1.4",
    "events": "npm:jspm-nodelibs-events@0.2.0",
    "path": "npm:jspm-nodelibs-path@0.2.1",
    "process": "npm:jspm-nodelibs-process@0.2.0"
  },
  packages: {
    "npm:es6-map@0.1.4": {
      "map": {
        "d": "npm:d@0.1.1",
        "es5-ext": "npm:es5-ext@0.10.12",
        "es6-set": "npm:es6-set@0.1.4",
        "es6-symbol": "npm:es6-symbol@3.1.0",
        "event-emitter": "npm:event-emitter@0.3.4",
        "es6-iterator": "npm:es6-iterator@2.0.0"
      }
    },
    "npm:es6-set@0.1.4": {
      "map": {
        "d": "npm:d@0.1.1",
        "es5-ext": "npm:es5-ext@0.10.12",
        "es6-iterator": "npm:es6-iterator@2.0.0",
        "es6-symbol": "npm:es6-symbol@3.1.0",
        "event-emitter": "npm:event-emitter@0.3.4"
      }
    },
    "npm:event-emitter@0.3.4": {
      "map": {
        "es5-ext": "npm:es5-ext@0.10.12",
        "d": "npm:d@0.1.1"
      }
    },
    "npm:d@0.1.1": {
      "map": {
        "es5-ext": "npm:es5-ext@0.10.12"
      }
    },
    "npm:es5-ext@0.10.12": {
      "map": {
        "es6-iterator": "npm:es6-iterator@2.0.0",
        "es6-symbol": "npm:es6-symbol@3.1.0"
      }
    },
    "npm:es6-symbol@3.1.0": {
      "map": {
        "d": "npm:d@0.1.1",
        "es5-ext": "npm:es5-ext@0.10.12"
      }
    },
    "npm:es6-iterator@2.0.0": {
      "map": {
        "d": "npm:d@0.1.1",
        "es5-ext": "npm:es5-ext@0.10.12",
        "es6-symbol": "npm:es6-symbol@3.1.0"
      }
    }
  }
});
