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
  devConfig: {
    "map": {
      "grunt-contrib-requirejs": "npm:grunt-contrib-requirejs@0.4.4",
      "grunt-contrib-csslint": "npm:grunt-contrib-csslint@0.5.0",
      "grunt-exec": "npm:grunt-exec@0.4.7",
      "grunt-jscs": "npm:grunt-jscs@1.8.0",
      "grunt-eslint": "npm:grunt-eslint@16.0.0",
      "grunt-contrib-watch": "npm:grunt-contrib-watch@0.6.1",
      "grunt": "npm:grunt@0.4.5",
      "browserify-shim": "npm:browserify-shim@3.8.12",
      "grunt-banner": "npm:grunt-banner@0.4.0",
      "grunt-contrib-uglify": "npm:grunt-contrib-uglify@0.9.2",
      "grunt-browserify": "npm:grunt-browserify@3.8.0",
      "browserify": "npm:browserify@10.2.6",
      "deamdify": "npm:deamdify@0.1.1",
      "grunt-jsdoc-to-markdown": "npm:grunt-jsdoc-to-markdown@1.2.1",
      "source-map": "npm:source-map@0.5.6",
      "fs": "github:jspm/nodelibs-fs@0.2.0-alpha",
      "assert": "github:jspm/nodelibs-assert@0.2.0-alpha",
      "crypto": "github:jspm/nodelibs-crypto@0.2.0-alpha",
      "vm": "github:jspm/nodelibs-vm@0.2.0-alpha",
      "buffer": "github:jspm/nodelibs-buffer@0.2.0-alpha",
      "util": "github:jspm/nodelibs-util@0.2.0-alpha",
      "os": "github:jspm/nodelibs-os@0.2.0-alpha",
      "constants": "github:jspm/nodelibs-constants@0.2.0-alpha",
      "stream": "github:jspm/nodelibs-stream@0.2.0-alpha",
      "estraverse": "npm:estraverse@4.2.0",
      "fsevents": "npm:fsevents@1.0.14",
      "http": "github:jspm/nodelibs-http@0.2.0-alpha",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.2.0-alpha",
      "uglify-js": "npm:uglify-js@2.3.6",
      "child_process": "github:jspm/nodelibs-child_process@0.2.0-alpha",
      "graceful-fs": "npm:graceful-fs@4.1.9",
      "tty": "github:jspm/nodelibs-tty@0.2.0-alpha",
      "url": "github:jspm/nodelibs-url@0.2.0-alpha",
      "module": "github:jspm/nodelibs-module@0.2.0-alpha",
      "timers": "github:jspm/nodelibs-timers@0.2.0-alpha",
      "jsbn": "npm:jsbn@0.1.0",
      "ecc-jsbn": "npm:ecc-jsbn@0.1.1",
      "bcrypt-pbkdf": "npm:bcrypt-pbkdf@1.0.0",
      "jodid25519": "npm:jodid25519@1.0.2",
      "readline": "github:jspm/nodelibs-readline@0.2.0-alpha",
      "tweetnacl": "npm:tweetnacl@0.14.3",
      "zlib": "github:jspm/nodelibs-zlib@0.2.0-alpha",
      "net": "github:jspm/nodelibs-net@0.2.0-alpha",
      "tls": "github:jspm/nodelibs-tls@0.2.0-alpha",
      "https": "github:jspm/nodelibs-https@0.2.0-alpha",
      "querystring": "github:jspm/nodelibs-querystring@0.2.0-alpha",
      "domain": "github:jspm/nodelibs-domain@0.2.0-alpha",
      "dgram": "github:jspm/nodelibs-dgram@0.2.0-alpha",
      "dns": "github:jspm/nodelibs-dns@0.2.0-alpha"
    },
    "packages": {
      "npm:grunt-browserify@3.8.0": {
        "map": {
          "browserify": "npm:browserify@10.2.6",
          "lodash": "npm:lodash@3.10.1",
          "resolve": "npm:resolve@1.1.7",
          "watchify": "npm:watchify@3.7.0",
          "async": "npm:async@0.9.2",
          "glob": "npm:glob@5.0.15"
        }
      },
      "npm:grunt-contrib-csslint@0.5.0": {
        "map": {
          "lodash": "npm:lodash@3.10.1",
          "strip-json-comments": "npm:strip-json-comments@1.0.4",
          "csslint": "npm:csslint@0.10.0",
          "chalk": "npm:chalk@1.1.3"
        }
      },
      "npm:grunt@0.4.5": {
        "map": {
          "lodash": "npm:lodash@0.9.2",
          "getobject": "npm:getobject@0.1.0",
          "grunt-legacy-log": "npm:grunt-legacy-log@0.1.3",
          "hooker": "npm:hooker@0.2.3",
          "exit": "npm:exit@0.1.2",
          "grunt-legacy-util": "npm:grunt-legacy-util@0.2.0",
          "colors": "npm:colors@0.6.2",
          "findup-sync": "npm:findup-sync@0.1.3",
          "which": "npm:which@1.0.9",
          "dateformat": "npm:dateformat@1.0.2-1.2.3",
          "nopt": "npm:nopt@1.0.10",
          "coffee-script": "npm:coffee-script@1.3.3",
          "eventemitter2": "npm:eventemitter2@0.4.14",
          "minimatch": "npm:minimatch@0.2.14",
          "iconv-lite": "npm:iconv-lite@0.2.11",
          "rimraf": "npm:rimraf@2.2.8",
          "js-yaml": "npm:js-yaml@2.0.5",
          "async": "npm:async@0.1.22",
          "underscore.string": "npm:underscore.string@2.2.1",
          "glob": "npm:glob@3.1.21"
        }
      },
      "npm:grunt-jscs@1.8.0": {
        "map": {
          "lodash": "npm:lodash@2.4.2",
          "hooker": "npm:hooker@0.2.3",
          "vow": "npm:vow@0.4.12",
          "jscs": "npm:jscs@1.13.1"
        }
      },
      "npm:grunt-contrib-watch@0.6.1": {
        "map": {
          "lodash": "npm:lodash@2.4.2",
          "tiny-lr-fork": "npm:tiny-lr-fork@0.0.5",
          "gaze": "npm:gaze@0.5.2",
          "async": "npm:async@0.2.10"
        }
      },
      "npm:grunt-contrib-uglify@0.9.2": {
        "map": {
          "lodash": "npm:lodash@3.10.1",
          "uri-path": "npm:uri-path@0.0.2",
          "maxmin": "npm:maxmin@1.1.0",
          "chalk": "npm:chalk@1.1.3",
          "uglify-js": "npm:uglify-js@2.7.4"
        }
      },
      "npm:browserify@10.2.6": {
        "map": {
          "path-browserify": "npm:path-browserify@0.0.0",
          "duplexer2": "npm:duplexer2@0.0.2",
          "url": "npm:url@0.10.3",
          "string_decoder": "npm:string_decoder@0.10.31",
          "timers-browserify": "npm:timers-browserify@1.4.2",
          "vm-browserify": "npm:vm-browserify@0.0.4",
          "xtend": "npm:xtend@4.0.1",
          "util": "npm:util@0.10.3",
          "stream-browserify": "npm:stream-browserify@1.0.0",
          "crypto-browserify": "npm:crypto-browserify@3.11.0",
          "buffer": "npm:buffer@3.6.0",
          "assert": "npm:assert@1.3.0",
          "events": "npm:events@1.0.2",
          "isarray": "npm:isarray@0.0.1",
          "inherits": "npm:inherits@2.0.3",
          "https-browserify": "npm:https-browserify@0.0.1",
          "readable-stream": "npm:readable-stream@1.1.14",
          "punycode": "npm:punycode@1.4.1",
          "os-browserify": "npm:os-browserify@0.1.2",
          "process": "npm:process@0.11.9",
          "browserify-zlib": "npm:browserify-zlib@0.1.4",
          "builtins": "npm:builtins@0.0.7",
          "commondir": "npm:commondir@0.0.1",
          "defined": "npm:defined@1.0.0",
          "parents": "npm:parents@1.0.1",
          "htmlescape": "npm:htmlescape@1.1.1",
          "has": "npm:has@1.0.1",
          "querystring-es3": "npm:querystring-es3@0.2.1",
          "subarg": "npm:subarg@1.0.0",
          "read-only-stream": "npm:read-only-stream@1.1.1",
          "shasum": "npm:shasum@1.0.2",
          "tty-browserify": "npm:tty-browserify@0.0.0",
          "labeled-stream-splicer": "npm:labeled-stream-splicer@1.0.2",
          "syntax-error": "npm:syntax-error@1.1.6",
          "constants-browserify": "npm:constants-browserify@0.0.1",
          "console-browserify": "npm:console-browserify@1.1.0",
          "domain-browser": "npm:domain-browser@1.1.7",
          "deps-sort": "npm:deps-sort@1.3.9",
          "shell-quote": "npm:shell-quote@0.0.1",
          "resolve": "npm:resolve@1.1.7",
          "browser-resolve": "npm:browser-resolve@1.11.2",
          "concat-stream": "npm:concat-stream@1.4.10",
          "browser-pack": "npm:browser-pack@5.0.1",
          "through2": "npm:through2@1.1.1",
          "JSONStream": "npm:JSONStream@1.2.1",
          "http-browserify": "npm:http-browserify@1.7.0",
          "insert-module-globals": "npm:insert-module-globals@6.6.3",
          "glob": "npm:glob@4.5.3",
          "module-deps": "npm:module-deps@3.9.1"
        }
      },
      "npm:util@0.10.3": {
        "map": {
          "inherits": "npm:inherits@2.0.1"
        }
      },
      "npm:url@0.10.3": {
        "map": {
          "punycode": "npm:punycode@1.3.2",
          "querystring": "npm:querystring@0.2.0"
        }
      },
      "npm:assert@1.3.0": {
        "map": {
          "util": "npm:util@0.10.3"
        }
      },
      "npm:browserify-shim@3.8.12": {
        "map": {
          "rename-function-calls": "npm:rename-function-calls@0.1.1",
          "mothership": "npm:mothership@0.2.0",
          "exposify": "npm:exposify@0.4.3",
          "through": "npm:through@2.3.8",
          "resolve": "npm:resolve@0.6.3"
        }
      },
      "npm:grunt-contrib-requirejs@0.4.4": {
        "map": {
          "requirejs": "npm:requirejs@2.1.22"
        }
      },
      "npm:buffer@3.6.0": {
        "map": {
          "isarray": "npm:isarray@1.0.0",
          "base64-js": "npm:base64-js@0.0.8",
          "ieee754": "npm:ieee754@1.1.8"
        }
      },
      "npm:stream-browserify@1.0.0": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "readable-stream": "npm:readable-stream@1.1.14"
        }
      },
      "npm:timers-browserify@1.4.2": {
        "map": {
          "process": "npm:process@0.11.9"
        }
      },
      "npm:duplexer2@0.0.2": {
        "map": {
          "readable-stream": "npm:readable-stream@1.1.14"
        }
      },
      "npm:deamdify@0.1.1": {
        "map": {
          "through": "npm:through@2.3.8",
          "estraverse": "npm:estraverse@1.9.3",
          "escodegen": "npm:escodegen@0.0.28",
          "esprima": "npm:esprima@1.2.5"
        }
      },
      "npm:grunt-legacy-log@0.1.3": {
        "map": {
          "colors": "npm:colors@0.6.2",
          "hooker": "npm:hooker@0.2.3",
          "lodash": "npm:lodash@2.4.2",
          "underscore.string": "npm:underscore.string@2.3.3",
          "grunt-legacy-log-utils": "npm:grunt-legacy-log-utils@0.1.1"
        }
      },
      "npm:grunt-eslint@16.0.0": {
        "map": {
          "chalk": "npm:chalk@1.1.3",
          "eslint": "npm:eslint@0.24.1"
        }
      },
      "npm:grunt-banner@0.4.0": {
        "map": {
          "chalk": "npm:chalk@1.0.0"
        }
      },
      "npm:grunt-legacy-util@0.2.0": {
        "map": {
          "hooker": "npm:hooker@0.2.3",
          "lodash": "npm:lodash@0.9.2",
          "exit": "npm:exit@0.1.2",
          "getobject": "npm:getobject@0.1.0",
          "which": "npm:which@1.0.9",
          "async": "npm:async@0.1.22",
          "underscore.string": "npm:underscore.string@2.2.1"
        }
      },
      "npm:maxmin@1.1.0": {
        "map": {
          "chalk": "npm:chalk@1.1.3",
          "figures": "npm:figures@1.7.0",
          "pretty-bytes": "npm:pretty-bytes@1.0.4",
          "gzip-size": "npm:gzip-size@1.0.0"
        }
      },
      "npm:read-only-stream@1.1.1": {
        "map": {
          "readable-stream": "npm:readable-stream@1.1.14",
          "readable-wrap": "npm:readable-wrap@1.0.0"
        }
      },
      "npm:vm-browserify@0.0.4": {
        "map": {
          "indexof": "npm:indexof@0.0.1"
        }
      },
      "npm:exposify@0.4.3": {
        "map": {
          "through2": "npm:through2@0.4.2",
          "map-obj": "npm:map-obj@1.0.1",
          "globo": "npm:globo@1.0.2",
          "has-require": "npm:has-require@1.1.0",
          "replace-requires": "npm:replace-requires@1.0.3",
          "transformify": "npm:transformify@0.1.2"
        }
      },
      "npm:crypto-browserify@3.11.0": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "browserify-cipher": "npm:browserify-cipher@1.0.0",
          "create-hash": "npm:create-hash@1.1.2",
          "create-ecdh": "npm:create-ecdh@4.0.0",
          "public-encrypt": "npm:public-encrypt@4.0.0",
          "create-hmac": "npm:create-hmac@1.1.4",
          "randombytes": "npm:randombytes@2.0.3",
          "browserify-sign": "npm:browserify-sign@4.0.0",
          "pbkdf2": "npm:pbkdf2@3.0.9",
          "diffie-hellman": "npm:diffie-hellman@5.0.2"
        }
      },
      "npm:readable-stream@1.1.14": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "isarray": "npm:isarray@0.0.1",
          "string_decoder": "npm:string_decoder@0.10.31",
          "stream-browserify": "npm:stream-browserify@1.0.0",
          "core-util-is": "npm:core-util-is@1.0.2"
        }
      },
      "npm:findup-sync@0.1.3": {
        "map": {
          "lodash": "npm:lodash@2.4.2",
          "glob": "npm:glob@3.2.11"
        }
      },
      "npm:labeled-stream-splicer@1.0.2": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "isarray": "npm:isarray@0.0.1",
          "stream-splicer": "npm:stream-splicer@1.3.2"
        }
      },
      "npm:deps-sort@1.3.9": {
        "map": {
          "JSONStream": "npm:JSONStream@1.2.1",
          "shasum": "npm:shasum@1.0.2",
          "subarg": "npm:subarg@1.0.0",
          "through2": "npm:through2@1.1.1"
        }
      },
      "npm:browserify-zlib@0.1.4": {
        "map": {
          "readable-stream": "npm:readable-stream@2.1.5",
          "pako": "npm:pako@0.2.9"
        }
      },
      "npm:browser-resolve@1.11.2": {
        "map": {
          "resolve": "npm:resolve@1.1.7"
        }
      },
      "npm:concat-stream@1.4.10": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "readable-stream": "npm:readable-stream@1.1.14",
          "typedarray": "npm:typedarray@0.0.6"
        }
      },
      "npm:through2@0.4.2": {
        "map": {
          "readable-stream": "npm:readable-stream@1.0.34",
          "xtend": "npm:xtend@2.1.2"
        }
      },
      "npm:through2@1.1.1": {
        "map": {
          "readable-stream": "npm:readable-stream@1.1.14",
          "xtend": "npm:xtend@4.0.1"
        }
      },
      "npm:browser-pack@5.0.1": {
        "map": {
          "JSONStream": "npm:JSONStream@1.2.1",
          "defined": "npm:defined@1.0.0",
          "through2": "npm:through2@1.1.1",
          "umd": "npm:umd@3.0.1",
          "combine-source-map": "npm:combine-source-map@0.6.1"
        }
      },
      "npm:http-browserify@1.7.0": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "Base64": "npm:Base64@0.2.1"
        }
      },
      "npm:JSONStream@1.2.1": {
        "map": {
          "through": "npm:through@2.3.8",
          "jsonparse": "npm:jsonparse@1.2.0"
        }
      },
      "npm:shasum@1.0.2": {
        "map": {
          "sha.js": "npm:sha.js@2.4.5",
          "json-stable-stringify": "npm:json-stable-stringify@0.0.1"
        }
      },
      "npm:js-yaml@2.0.5": {
        "map": {
          "esprima": "npm:esprima@1.0.4",
          "argparse": "npm:argparse@0.1.16"
        }
      },
      "npm:escodegen@0.0.28": {
        "map": {
          "esprima": "npm:esprima@1.0.4",
          "estraverse": "npm:estraverse@1.3.2"
        }
      },
      "npm:watchify@3.7.0": {
        "map": {
          "browserify": "npm:browserify@13.1.1",
          "through2": "npm:through2@2.0.1",
          "xtend": "npm:xtend@4.0.1",
          "defined": "npm:defined@1.0.0",
          "anymatch": "npm:anymatch@1.3.0",
          "outpipe": "npm:outpipe@1.1.1",
          "chokidar": "npm:chokidar@1.6.1"
        }
      },
      "npm:insert-module-globals@6.6.3": {
        "map": {
          "process": "npm:process@0.11.9",
          "xtend": "npm:xtend@4.0.1",
          "JSONStream": "npm:JSONStream@1.2.1",
          "concat-stream": "npm:concat-stream@1.4.10",
          "through2": "npm:through2@1.1.1",
          "combine-source-map": "npm:combine-source-map@0.6.1",
          "is-buffer": "npm:is-buffer@1.1.4",
          "lexical-scope": "npm:lexical-scope@1.2.0"
        }
      },
      "npm:glob@3.1.21": {
        "map": {
          "inherits": "npm:inherits@1.0.2",
          "minimatch": "npm:minimatch@0.2.14",
          "graceful-fs": "npm:graceful-fs@1.2.3"
        }
      },
      "npm:glob@4.5.3": {
        "map": {
          "minimatch": "npm:minimatch@2.0.10",
          "inherits": "npm:inherits@2.0.3",
          "inflight": "npm:inflight@1.0.6",
          "once": "npm:once@1.4.0"
        }
      },
      "npm:glob@5.0.15": {
        "map": {
          "minimatch": "npm:minimatch@3.0.3",
          "inherits": "npm:inherits@2.0.3",
          "inflight": "npm:inflight@1.0.6",
          "path-is-absolute": "npm:path-is-absolute@1.0.1",
          "once": "npm:once@1.4.0"
        }
      },
      "npm:glob@3.2.11": {
        "map": {
          "minimatch": "npm:minimatch@0.3.0",
          "inherits": "npm:inherits@2.0.3"
        }
      },
      "npm:grunt-jsdoc-to-markdown@1.2.1": {
        "map": {
          "jsdoc-to-markdown": "npm:jsdoc-to-markdown@1.3.8"
        }
      },
      "npm:parents@1.0.1": {
        "map": {
          "path-platform": "npm:path-platform@0.11.15"
        }
      },
      "npm:chalk@1.0.0": {
        "map": {
          "escape-string-regexp": "npm:escape-string-regexp@1.0.5",
          "ansi-styles": "npm:ansi-styles@2.2.1",
          "has-ansi": "npm:has-ansi@1.0.3",
          "strip-ansi": "npm:strip-ansi@2.0.1",
          "supports-color": "npm:supports-color@1.3.1"
        }
      },
      "npm:chalk@1.1.3": {
        "map": {
          "ansi-styles": "npm:ansi-styles@2.2.1",
          "escape-string-regexp": "npm:escape-string-regexp@1.0.5",
          "has-ansi": "npm:has-ansi@2.0.0",
          "strip-ansi": "npm:strip-ansi@3.0.1",
          "supports-color": "npm:supports-color@2.0.0"
        }
      },
      "npm:browserify@13.1.1": {
        "map": {
          "browser-pack": "npm:browser-pack@6.0.1",
          "buffer": "npm:buffer@4.9.1",
          "concat-stream": "npm:concat-stream@1.5.2",
          "constants-browserify": "npm:constants-browserify@1.0.0",
          "deps-sort": "npm:deps-sort@2.0.0",
          "duplexer2": "npm:duplexer2@0.1.4",
          "events": "npm:events@1.1.1",
          "insert-module-globals": "npm:insert-module-globals@7.0.1",
          "labeled-stream-splicer": "npm:labeled-stream-splicer@2.0.0",
          "read-only-stream": "npm:read-only-stream@2.0.0",
          "shell-quote": "npm:shell-quote@1.6.1",
          "stream-browserify": "npm:stream-browserify@2.0.1",
          "url": "npm:url@0.11.0",
          "crypto-browserify": "npm:crypto-browserify@3.11.0",
          "inherits": "npm:inherits@2.0.3",
          "process": "npm:process@0.11.9",
          "xtend": "npm:xtend@4.0.1",
          "JSONStream": "npm:JSONStream@1.2.1",
          "assert": "npm:assert@1.3.0",
          "browser-resolve": "npm:browser-resolve@1.11.2",
          "browserify-zlib": "npm:browserify-zlib@0.1.4",
          "console-browserify": "npm:console-browserify@1.1.0",
          "defined": "npm:defined@1.0.0",
          "domain-browser": "npm:domain-browser@1.1.7",
          "glob": "npm:glob@5.0.15",
          "has": "npm:has@1.0.1",
          "htmlescape": "npm:htmlescape@1.1.1",
          "https-browserify": "npm:https-browserify@0.0.1",
          "os-browserify": "npm:os-browserify@0.1.2",
          "parents": "npm:parents@1.0.1",
          "path-browserify": "npm:path-browserify@0.0.0",
          "punycode": "npm:punycode@1.4.1",
          "querystring-es3": "npm:querystring-es3@0.2.1",
          "readable-stream": "npm:readable-stream@2.1.5",
          "resolve": "npm:resolve@1.1.7",
          "shasum": "npm:shasum@1.0.2",
          "string_decoder": "npm:string_decoder@0.10.31",
          "subarg": "npm:subarg@1.0.0",
          "syntax-error": "npm:syntax-error@1.1.6",
          "through2": "npm:through2@2.0.1",
          "timers-browserify": "npm:timers-browserify@1.4.2",
          "tty-browserify": "npm:tty-browserify@0.0.0",
          "util": "npm:util@0.10.3",
          "vm-browserify": "npm:vm-browserify@0.0.4",
          "module-deps": "npm:module-deps@4.0.8",
          "cached-path-relative": "npm:cached-path-relative@1.0.0",
          "stream-http": "npm:stream-http@2.4.1"
        }
      },
      "npm:has@1.0.1": {
        "map": {
          "function-bind": "npm:function-bind@1.1.0"
        }
      },
      "npm:tiny-lr-fork@0.0.5": {
        "map": {
          "noptify": "npm:noptify@0.0.3",
          "faye-websocket": "npm:faye-websocket@0.4.4",
          "debug": "npm:debug@0.7.4",
          "qs": "npm:qs@0.5.6"
        }
      },
      "npm:mothership@0.2.0": {
        "map": {
          "find-parent-dir": "npm:find-parent-dir@0.3.0"
        }
      },
      "npm:nopt@1.0.10": {
        "map": {
          "abbrev": "npm:abbrev@1.0.9"
        }
      },
      "npm:console-browserify@1.1.0": {
        "map": {
          "date-now": "npm:date-now@0.1.4"
        }
      },
      "npm:rename-function-calls@0.1.1": {
        "map": {
          "detective": "npm:detective@3.1.0"
        }
      },
      "npm:concat-stream@1.5.2": {
        "map": {
          "readable-stream": "npm:readable-stream@2.0.6",
          "inherits": "npm:inherits@2.0.3",
          "typedarray": "npm:typedarray@0.0.6"
        }
      },
      "npm:uglify-js@2.7.4": {
        "map": {
          "async": "npm:async@0.2.10",
          "source-map": "npm:source-map@0.5.6",
          "uglify-to-browserify": "npm:uglify-to-browserify@1.0.2",
          "yargs": "npm:yargs@3.10.0"
        }
      },
      "npm:grunt-legacy-log-utils@0.1.1": {
        "map": {
          "lodash": "npm:lodash@2.4.2",
          "underscore.string": "npm:underscore.string@2.3.3",
          "colors": "npm:colors@0.6.2"
        }
      },
      "npm:labeled-stream-splicer@2.0.0": {
        "map": {
          "stream-splicer": "npm:stream-splicer@2.0.0",
          "inherits": "npm:inherits@2.0.3",
          "isarray": "npm:isarray@0.0.1"
        }
      },
      "npm:readable-stream@2.1.5": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "core-util-is": "npm:core-util-is@1.0.2",
          "isarray": "npm:isarray@1.0.0",
          "string_decoder": "npm:string_decoder@0.10.31",
          "buffer-shims": "npm:buffer-shims@1.0.0",
          "process-nextick-args": "npm:process-nextick-args@1.0.7",
          "util-deprecate": "npm:util-deprecate@1.0.2"
        }
      },
      "npm:through2@2.0.1": {
        "map": {
          "xtend": "npm:xtend@4.0.1",
          "readable-stream": "npm:readable-stream@2.0.6"
        }
      },
      "npm:insert-module-globals@7.0.1": {
        "map": {
          "process": "npm:process@0.11.9",
          "xtend": "npm:xtend@4.0.1",
          "JSONStream": "npm:JSONStream@1.2.1",
          "concat-stream": "npm:concat-stream@1.5.2",
          "through2": "npm:through2@2.0.1",
          "combine-source-map": "npm:combine-source-map@0.7.2",
          "is-buffer": "npm:is-buffer@1.1.4",
          "lexical-scope": "npm:lexical-scope@1.2.0"
        }
      },
      "npm:readable-wrap@1.0.0": {
        "map": {
          "readable-stream": "npm:readable-stream@1.1.14"
        }
      },
      "npm:browser-pack@6.0.1": {
        "map": {
          "JSONStream": "npm:JSONStream@1.2.1",
          "defined": "npm:defined@1.0.0",
          "through2": "npm:through2@2.0.1",
          "umd": "npm:umd@3.0.1",
          "combine-source-map": "npm:combine-source-map@0.7.2"
        }
      },
      "npm:duplexer2@0.1.4": {
        "map": {
          "readable-stream": "npm:readable-stream@2.1.5"
        }
      },
      "npm:deps-sort@2.0.0": {
        "map": {
          "JSONStream": "npm:JSONStream@1.2.1",
          "shasum": "npm:shasum@1.0.2",
          "subarg": "npm:subarg@1.0.0",
          "through2": "npm:through2@2.0.1"
        }
      },
      "npm:read-only-stream@2.0.0": {
        "map": {
          "readable-stream": "npm:readable-stream@2.1.5"
        }
      },
      "npm:module-deps@3.9.1": {
        "map": {
          "detective": "npm:detective@4.3.2",
          "inherits": "npm:inherits@2.0.3",
          "xtend": "npm:xtend@4.0.1",
          "JSONStream": "npm:JSONStream@1.2.1",
          "browser-resolve": "npm:browser-resolve@1.11.2",
          "concat-stream": "npm:concat-stream@1.4.10",
          "defined": "npm:defined@1.0.0",
          "duplexer2": "npm:duplexer2@0.0.2",
          "parents": "npm:parents@1.0.1",
          "readable-stream": "npm:readable-stream@1.1.14",
          "resolve": "npm:resolve@1.1.7",
          "subarg": "npm:subarg@1.0.0",
          "through2": "npm:through2@1.1.1",
          "stream-combiner2": "npm:stream-combiner2@1.0.2"
        }
      },
      "npm:module-deps@4.0.8": {
        "map": {
          "detective": "npm:detective@4.3.2",
          "inherits": "npm:inherits@2.0.3",
          "readable-stream": "npm:readable-stream@2.1.5",
          "xtend": "npm:xtend@4.0.1",
          "JSONStream": "npm:JSONStream@1.2.1",
          "browser-resolve": "npm:browser-resolve@1.11.2",
          "concat-stream": "npm:concat-stream@1.5.2",
          "defined": "npm:defined@1.0.0",
          "duplexer2": "npm:duplexer2@0.1.4",
          "parents": "npm:parents@1.0.1",
          "resolve": "npm:resolve@1.1.7",
          "subarg": "npm:subarg@1.0.0",
          "through2": "npm:through2@2.0.1",
          "cached-path-relative": "npm:cached-path-relative@1.0.0",
          "stream-combiner2": "npm:stream-combiner2@1.1.1"
        }
      },
      "npm:noptify@0.0.3": {
        "map": {
          "nopt": "npm:nopt@2.0.0"
        }
      },
      "npm:readable-stream@1.0.34": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "core-util-is": "npm:core-util-is@1.0.2",
          "isarray": "npm:isarray@0.0.1",
          "string_decoder": "npm:string_decoder@0.10.31",
          "stream-browserify": "npm:stream-browserify@1.0.0"
        }
      },
      "npm:subarg@1.0.0": {
        "map": {
          "minimist": "npm:minimist@1.2.0"
        }
      },
      "npm:gaze@0.5.2": {
        "map": {
          "globule": "npm:globule@0.1.0"
        }
      },
      "npm:minimatch@0.2.14": {
        "map": {
          "sigmund": "npm:sigmund@1.0.1",
          "lru-cache": "npm:lru-cache@2.7.3"
        }
      },
      "npm:minimatch@0.3.0": {
        "map": {
          "sigmund": "npm:sigmund@1.0.1",
          "lru-cache": "npm:lru-cache@2.7.3"
        }
      },
      "npm:replace-requires@1.0.3": {
        "map": {
          "detective": "npm:detective@4.1.1",
          "has-require": "npm:has-require@1.2.2",
          "xtend": "npm:xtend@4.0.1",
          "patch-text": "npm:patch-text@1.0.2"
        }
      },
      "npm:figures@1.7.0": {
        "map": {
          "escape-string-regexp": "npm:escape-string-regexp@1.0.5",
          "object-assign": "npm:object-assign@4.1.0"
        }
      },
      "npm:transformify@0.1.2": {
        "map": {
          "readable-stream": "npm:readable-stream@1.1.14"
        }
      },
      "npm:csslint@0.10.0": {
        "map": {
          "parserlib": "npm:parserlib@0.2.5"
        }
      },
      "npm:detective@3.1.0": {
        "map": {
          "escodegen": "npm:escodegen@1.1.0",
          "esprima-fb": "npm:esprima-fb@3001.1.0-dev-harmony-fb"
        }
      },
      "npm:sha.js@2.4.5": {
        "map": {
          "inherits": "npm:inherits@2.0.3"
        }
      },
      "npm:stream-splicer@1.3.2": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "isarray": "npm:isarray@0.0.1",
          "readable-stream": "npm:readable-stream@1.1.14",
          "readable-wrap": "npm:readable-wrap@1.0.0",
          "through2": "npm:through2@1.1.1",
          "indexof": "npm:indexof@0.0.1"
        }
      },
      "npm:stream-splicer@2.0.0": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "readable-stream": "npm:readable-stream@2.1.5"
        }
      },
      "npm:jscs@1.13.1": {
        "map": {
          "chalk": "npm:chalk@1.0.0",
          "esprima": "npm:esprima@1.2.5",
          "estraverse": "npm:estraverse@1.9.3",
          "exit": "npm:exit@0.1.2",
          "glob": "npm:glob@5.0.15",
          "minimatch": "npm:minimatch@2.0.10",
          "strip-json-comments": "npm:strip-json-comments@1.0.4",
          "vow": "npm:vow@0.4.12",
          "xmlbuilder": "npm:xmlbuilder@2.6.5",
          "commander": "npm:commander@2.6.0",
          "cli-table": "npm:cli-table@0.3.1",
          "pathval": "npm:pathval@0.1.1",
          "vow-fs": "npm:vow-fs@0.3.6",
          "lodash.assign": "npm:lodash.assign@3.0.0",
          "esprima-harmony-jscs": "npm:esprima-harmony-jscs@1.1.0-bin",
          "prompt": "npm:prompt@0.2.14"
        }
      },
      "npm:nopt@2.0.0": {
        "map": {
          "abbrev": "npm:abbrev@1.0.9"
        }
      },
      "npm:detective@4.3.2": {
        "map": {
          "defined": "npm:defined@1.0.0",
          "acorn": "npm:acorn@3.3.0"
        }
      },
      "npm:has-require@1.2.2": {
        "map": {
          "escape-string-regexp": "npm:escape-string-regexp@1.0.5"
        }
      },
      "npm:globule@0.1.0": {
        "map": {
          "lodash": "npm:lodash@1.0.2",
          "glob": "npm:glob@3.1.21",
          "minimatch": "npm:minimatch@0.2.14"
        }
      },
      "npm:detective@4.1.1": {
        "map": {
          "escodegen": "npm:escodegen@1.8.1",
          "defined": "npm:defined@1.0.0",
          "acorn": "npm:acorn@1.2.2"
        }
      },
      "npm:escodegen@1.1.0": {
        "map": {
          "estraverse": "npm:estraverse@1.5.1",
          "esprima": "npm:esprima@1.0.4",
          "esutils": "npm:esutils@1.0.0"
        }
      },
      "npm:readable-stream@2.0.6": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "core-util-is": "npm:core-util-is@1.0.2",
          "isarray": "npm:isarray@1.0.0",
          "string_decoder": "npm:string_decoder@0.10.31",
          "process-nextick-args": "npm:process-nextick-args@1.0.7",
          "util-deprecate": "npm:util-deprecate@1.0.2"
        }
      },
      "npm:strip-ansi@2.0.1": {
        "map": {
          "ansi-regex": "npm:ansi-regex@1.1.1"
        }
      },
      "npm:has-ansi@1.0.3": {
        "map": {
          "ansi-regex": "npm:ansi-regex@1.1.1",
          "get-stdin": "npm:get-stdin@4.0.1"
        }
      },
      "npm:strip-ansi@3.0.1": {
        "map": {
          "ansi-regex": "npm:ansi-regex@2.0.0"
        }
      },
      "npm:has-ansi@2.0.0": {
        "map": {
          "ansi-regex": "npm:ansi-regex@2.0.0"
        }
      },
      "npm:buffer@4.9.1": {
        "map": {
          "base64-js": "npm:base64-js@1.2.0",
          "ieee754": "npm:ieee754@1.1.8",
          "isarray": "npm:isarray@1.0.0"
        }
      },
      "npm:combine-source-map@0.6.1": {
        "map": {
          "source-map": "npm:source-map@0.4.4",
          "inline-source-map": "npm:inline-source-map@0.5.0",
          "lodash.memoize": "npm:lodash.memoize@3.0.4",
          "convert-source-map": "npm:convert-source-map@1.1.3"
        }
      },
      "npm:stream-browserify@2.0.1": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "readable-stream": "npm:readable-stream@2.1.5"
        }
      },
      "npm:url@0.11.0": {
        "map": {
          "punycode": "npm:punycode@1.3.2",
          "querystring": "npm:querystring@0.2.0"
        }
      },
      "npm:combine-source-map@0.7.2": {
        "map": {
          "source-map": "npm:source-map@0.5.6",
          "inline-source-map": "npm:inline-source-map@0.6.2",
          "lodash.memoize": "npm:lodash.memoize@3.0.4",
          "convert-source-map": "npm:convert-source-map@1.1.3"
        }
      },
      "npm:gzip-size@1.0.0": {
        "map": {
          "concat-stream": "npm:concat-stream@1.5.2",
          "browserify-zlib": "npm:browserify-zlib@0.1.4"
        }
      },
      "npm:escodegen@1.8.1": {
        "map": {
          "esprima": "npm:esprima@2.7.3",
          "estraverse": "npm:estraverse@1.9.3",
          "esutils": "npm:esutils@2.0.2",
          "optionator": "npm:optionator@0.8.2"
        }
      },
      "npm:syntax-error@1.1.6": {
        "map": {
          "acorn": "npm:acorn@2.7.0"
        }
      },
      "npm:xtend@2.1.2": {
        "map": {
          "object-keys": "npm:object-keys@0.4.0"
        }
      },
      "npm:outpipe@1.1.1": {
        "map": {
          "shell-quote": "npm:shell-quote@1.6.1"
        }
      },
      "npm:create-hash@1.1.2": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "sha.js": "npm:sha.js@2.4.5",
          "cipher-base": "npm:cipher-base@1.0.3",
          "ripemd160": "npm:ripemd160@1.0.1"
        }
      },
      "npm:create-hmac@1.1.4": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "create-hash": "npm:create-hash@1.1.2"
        }
      },
      "npm:public-encrypt@4.0.0": {
        "map": {
          "create-hash": "npm:create-hash@1.1.2",
          "randombytes": "npm:randombytes@2.0.3",
          "browserify-rsa": "npm:browserify-rsa@4.0.1",
          "parse-asn1": "npm:parse-asn1@5.0.0",
          "bn.js": "npm:bn.js@4.11.6"
        }
      },
      "npm:inflight@1.0.6": {
        "map": {
          "once": "npm:once@1.4.0",
          "wrappy": "npm:wrappy@1.0.2"
        }
      },
      "npm:shell-quote@1.6.1": {
        "map": {
          "array-reduce": "npm:array-reduce@0.0.0",
          "jsonify": "npm:jsonify@0.0.0",
          "array-map": "npm:array-map@0.0.0",
          "array-filter": "npm:array-filter@0.0.1"
        }
      },
      "npm:json-stable-stringify@0.0.1": {
        "map": {
          "jsonify": "npm:jsonify@0.0.0"
        }
      },
      "npm:argparse@0.1.16": {
        "map": {
          "underscore.string": "npm:underscore.string@2.4.0",
          "underscore": "npm:underscore@1.7.0"
        }
      },
      "github:jspm/nodelibs-crypto@0.2.0-alpha": {
        "map": {
          "crypto-browserify": "npm:crypto-browserify@3.11.0"
        }
      },
      "github:jspm/nodelibs-buffer@0.2.0-alpha": {
        "map": {
          "buffer-browserify": "npm:buffer@4.9.1"
        }
      },
      "npm:minimatch@3.0.3": {
        "map": {
          "brace-expansion": "npm:brace-expansion@1.1.6"
        }
      },
      "npm:minimatch@2.0.10": {
        "map": {
          "brace-expansion": "npm:brace-expansion@1.1.6"
        }
      },
      "npm:jsdoc-to-markdown@1.3.8": {
        "map": {
          "stream-connect": "npm:stream-connect@1.0.2",
          "jsdoc2md-stats": "npm:jsdoc2md-stats@1.0.4",
          "ansi-escape-sequences": "npm:ansi-escape-sequences@3.0.0",
          "command-line-usage": "npm:command-line-usage@3.0.5",
          "object-tools": "npm:object-tools@2.0.6",
          "config-master": "npm:config-master@2.0.4",
          "command-line-args": "npm:command-line-args@3.0.1",
          "jsdoc-parse": "npm:jsdoc-parse@1.2.7",
          "dmd": "npm:dmd@1.4.2"
        }
      },
      "npm:browserify-sign@4.0.0": {
        "map": {
          "create-hash": "npm:create-hash@1.1.2",
          "create-hmac": "npm:create-hmac@1.1.4",
          "inherits": "npm:inherits@2.0.3",
          "browserify-rsa": "npm:browserify-rsa@4.0.1",
          "parse-asn1": "npm:parse-asn1@5.0.0",
          "elliptic": "npm:elliptic@6.3.2",
          "bn.js": "npm:bn.js@4.11.6"
        }
      },
      "npm:diffie-hellman@5.0.2": {
        "map": {
          "randombytes": "npm:randombytes@2.0.3",
          "miller-rabin": "npm:miller-rabin@4.0.0",
          "bn.js": "npm:bn.js@4.11.6"
        }
      },
      "npm:pbkdf2@3.0.9": {
        "map": {
          "create-hmac": "npm:create-hmac@1.1.4"
        }
      },
      "npm:globo@1.0.2": {
        "map": {
          "ternary": "npm:ternary@1.0.0",
          "accessory": "npm:accessory@1.0.1",
          "is-defined": "npm:is-defined@1.0.0"
        }
      },
      "npm:pretty-bytes@1.0.4": {
        "map": {
          "get-stdin": "npm:get-stdin@4.0.1",
          "meow": "npm:meow@3.7.0"
        }
      },
      "npm:eslint@0.24.1": {
        "map": {
          "debug": "npm:debug@2.2.0",
          "estraverse": "npm:estraverse@4.2.0",
          "js-yaml": "npm:js-yaml@3.6.1",
          "chalk": "npm:chalk@1.1.3",
          "escape-string-regexp": "npm:escape-string-regexp@1.0.5",
          "concat-stream": "npm:concat-stream@1.5.2",
          "minimatch": "npm:minimatch@2.0.10",
          "path-is-absolute": "npm:path-is-absolute@1.0.1",
          "strip-json-comments": "npm:strip-json-comments@1.0.4",
          "object-assign": "npm:object-assign@2.1.1",
          "globals": "npm:globals@8.18.0",
          "optionator": "npm:optionator@0.5.0",
          "estraverse-fb": "npm:estraverse-fb@1.3.1",
          "user-home": "npm:user-home@1.1.1",
          "xml-escape": "npm:xml-escape@1.0.0",
          "mkdirp": "npm:mkdirp@0.5.1",
          "text-table": "npm:text-table@0.2.0",
          "escope": "npm:escope@3.6.0",
          "doctrine": "npm:doctrine@0.6.4",
          "is-my-json-valid": "npm:is-my-json-valid@2.15.0",
          "inquirer": "npm:inquirer@0.8.5",
          "espree": "npm:espree@2.2.5"
        }
      },
      "npm:xmlbuilder@2.6.5": {
        "map": {
          "lodash": "npm:lodash@3.10.1"
        }
      },
      "npm:stream-combiner2@1.0.2": {
        "map": {
          "through2": "npm:through2@0.5.1",
          "duplexer2": "npm:duplexer2@0.0.2"
        }
      },
      "npm:stream-combiner2@1.1.1": {
        "map": {
          "readable-stream": "npm:readable-stream@2.1.5",
          "duplexer2": "npm:duplexer2@0.1.4"
        }
      },
      "npm:browserify-cipher@1.0.0": {
        "map": {
          "browserify-des": "npm:browserify-des@1.0.0",
          "browserify-aes": "npm:browserify-aes@1.0.6",
          "evp_bytestokey": "npm:evp_bytestokey@1.0.0"
        }
      },
      "npm:js-yaml@3.6.1": {
        "map": {
          "argparse": "npm:argparse@1.0.9",
          "esprima": "npm:esprima@2.7.3"
        }
      },
      "npm:stream-http@2.4.1": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "readable-stream": "npm:readable-stream@2.1.5",
          "xtend": "npm:xtend@4.0.1",
          "builtin-status-codes": "npm:builtin-status-codes@2.0.0",
          "to-arraybuffer": "npm:to-arraybuffer@1.0.1"
        }
      },
      "npm:chokidar@1.6.1": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "anymatch": "npm:anymatch@1.3.0",
          "path-is-absolute": "npm:path-is-absolute@1.0.1",
          "is-binary-path": "npm:is-binary-path@1.0.1",
          "async-each": "npm:async-each@1.0.1",
          "glob-parent": "npm:glob-parent@2.0.0",
          "is-glob": "npm:is-glob@2.0.1",
          "readdirp": "npm:readdirp@2.1.0"
        }
      },
      "npm:command-line-usage@3.0.5": {
        "map": {
          "ansi-escape-sequences": "npm:ansi-escape-sequences@3.0.0",
          "array-back": "npm:array-back@1.0.3",
          "feature-detect-es6": "npm:feature-detect-es6@1.3.1",
          "typical": "npm:typical@2.6.0",
          "table-layout": "npm:table-layout@0.2.3"
        }
      },
      "npm:cli-table@0.3.1": {
        "map": {
          "colors": "npm:colors@1.0.3"
        }
      },
      "npm:anymatch@1.3.0": {
        "map": {
          "arrify": "npm:arrify@1.0.1",
          "micromatch": "npm:micromatch@2.3.11"
        }
      },
      "npm:vow-fs@0.3.6": {
        "map": {
          "glob": "npm:glob@7.1.1",
          "vow": "npm:vow@0.4.12",
          "vow-queue": "npm:vow-queue@0.4.2",
          "uuid": "npm:uuid@2.0.3"
        }
      },
      "npm:lexical-scope@1.2.0": {
        "map": {
          "astw": "npm:astw@2.0.0"
        }
      },
      "npm:source-map@0.4.4": {
        "map": {
          "amdefine": "npm:amdefine@1.0.0"
        }
      },
      "npm:once@1.4.0": {
        "map": {
          "wrappy": "npm:wrappy@1.0.2"
        }
      },
      "npm:through2@0.5.1": {
        "map": {
          "xtend": "npm:xtend@3.0.0",
          "readable-stream": "npm:readable-stream@1.0.34"
        }
      },
      "npm:glob@7.1.1": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "inflight": "npm:inflight@1.0.6",
          "minimatch": "npm:minimatch@3.0.3",
          "once": "npm:once@1.4.0",
          "path-is-absolute": "npm:path-is-absolute@1.0.1",
          "fs.realpath": "npm:fs.realpath@1.0.0"
        }
      },
      "npm:meow@3.7.0": {
        "map": {
          "map-obj": "npm:map-obj@1.0.1",
          "minimist": "npm:minimist@1.2.0",
          "object-assign": "npm:object-assign@4.1.0",
          "loud-rejection": "npm:loud-rejection@1.6.0",
          "normalize-package-data": "npm:normalize-package-data@2.3.5",
          "trim-newlines": "npm:trim-newlines@1.0.0",
          "camelcase-keys": "npm:camelcase-keys@2.1.0",
          "decamelize": "npm:decamelize@1.2.0",
          "read-pkg-up": "npm:read-pkg-up@1.0.1",
          "redent": "npm:redent@1.0.0"
        }
      },
      "npm:inline-source-map@0.5.0": {
        "map": {
          "source-map": "npm:source-map@0.4.4"
        }
      },
      "npm:inline-source-map@0.6.2": {
        "map": {
          "source-map": "npm:source-map@0.5.6"
        }
      },
      "npm:jsdoc-parse@1.2.7": {
        "map": {
          "ansi-escape-sequences": "npm:ansi-escape-sequences@2.2.2",
          "command-line-args": "npm:command-line-args@2.1.6",
          "object-tools": "npm:object-tools@2.0.6",
          "stream-connect": "npm:stream-connect@1.0.2",
          "core-js": "npm:core-js@2.4.1",
          "feature-detect-es6": "npm:feature-detect-es6@1.3.1",
          "test-value": "npm:test-value@1.1.0",
          "collect-json": "npm:collect-json@1.0.8",
          "command-line-tool": "npm:command-line-tool@0.1.0",
          "file-set": "npm:file-set@0.2.8",
          "jsdoc-api": "npm:jsdoc-api@1.2.4",
          "array-tools": "npm:array-tools@2.0.9"
        }
      },
      "npm:astw@2.0.0": {
        "map": {
          "acorn": "npm:acorn@1.2.2"
        }
      },
      "npm:config-master@2.0.4": {
        "map": {
          "babel-polyfill": "npm:babel-polyfill@6.16.0",
          "feature-detect-es6": "npm:feature-detect-es6@1.3.1",
          "walk-back": "npm:walk-back@2.0.1"
        }
      },
      "npm:brace-expansion@1.1.6": {
        "map": {
          "concat-map": "npm:concat-map@0.0.1",
          "balanced-match": "npm:balanced-match@0.4.2"
        }
      },
      "npm:stream-connect@1.0.2": {
        "map": {
          "array-back": "npm:array-back@1.0.3"
        }
      },
      "npm:object-tools@2.0.6": {
        "map": {
          "array-back": "npm:array-back@1.0.3",
          "object-get": "npm:object-get@2.1.0",
          "test-value": "npm:test-value@1.1.0",
          "collect-json": "npm:collect-json@1.0.8",
          "typical": "npm:typical@2.6.0"
        }
      },
      "npm:ansi-escape-sequences@3.0.0": {
        "map": {
          "array-back": "npm:array-back@1.0.3"
        }
      },
      "npm:command-line-args@3.0.1": {
        "map": {
          "array-back": "npm:array-back@1.0.3",
          "core-js": "npm:core-js@2.4.1",
          "feature-detect-es6": "npm:feature-detect-es6@1.3.1",
          "typical": "npm:typical@2.6.0",
          "find-replace": "npm:find-replace@1.0.2"
        }
      },
      "npm:accessory@1.0.1": {
        "map": {
          "dot-parts": "npm:dot-parts@1.0.1"
        }
      },
      "npm:command-line-args@2.1.6": {
        "map": {
          "command-line-usage": "npm:command-line-usage@2.0.5",
          "array-back": "npm:array-back@1.0.3",
          "core-js": "npm:core-js@2.4.1",
          "feature-detect-es6": "npm:feature-detect-es6@1.3.1",
          "typical": "npm:typical@2.6.0",
          "find-replace": "npm:find-replace@1.0.2"
        }
      },
      "npm:browserify-aes@1.0.6": {
        "map": {
          "create-hash": "npm:create-hash@1.1.2",
          "inherits": "npm:inherits@2.0.3",
          "cipher-base": "npm:cipher-base@1.0.3",
          "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
          "buffer-xor": "npm:buffer-xor@1.0.3"
        }
      },
      "npm:browserify-des@1.0.0": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "cipher-base": "npm:cipher-base@1.0.3",
          "des.js": "npm:des.js@1.0.0"
        }
      },
      "npm:ansi-escape-sequences@2.2.2": {
        "map": {
          "array-back": "npm:array-back@1.0.3",
          "collect-all": "npm:collect-all@0.2.1"
        }
      },
      "npm:jsdoc2md-stats@1.0.4": {
        "map": {
          "feature-detect-es6": "npm:feature-detect-es6@1.3.1",
          "app-usage-stats": "npm:app-usage-stats@0.3.6"
        }
      },
      "npm:babel-polyfill@6.16.0": {
        "map": {
          "core-js": "npm:core-js@2.4.1",
          "babel-runtime": "npm:babel-runtime@6.18.0",
          "regenerator-runtime": "npm:regenerator-runtime@0.9.5"
        }
      },
      "npm:mkdirp@0.5.1": {
        "map": {
          "minimist": "npm:minimist@0.0.8"
        }
      },
      "npm:create-ecdh@4.0.0": {
        "map": {
          "elliptic": "npm:elliptic@6.3.2",
          "bn.js": "npm:bn.js@4.11.6"
        }
      },
      "npm:array-back@1.0.3": {
        "map": {
          "typical": "npm:typical@2.6.0"
        }
      },
      "npm:command-line-usage@2.0.5": {
        "map": {
          "ansi-escape-sequences": "npm:ansi-escape-sequences@2.2.2",
          "array-back": "npm:array-back@1.0.3",
          "feature-detect-es6": "npm:feature-detect-es6@1.3.1",
          "typical": "npm:typical@2.6.0",
          "wordwrapjs": "npm:wordwrapjs@1.2.1",
          "column-layout": "npm:column-layout@2.1.4"
        }
      },
      "npm:lodash.assign@3.0.0": {
        "map": {
          "lodash._baseassign": "npm:lodash._baseassign@3.2.0",
          "lodash._createassigner": "npm:lodash._createassigner@3.1.1"
        }
      },
      "github:jspm/nodelibs-os@0.2.0-alpha": {
        "map": {
          "os-browserify": "npm:os-browserify@0.2.1"
        }
      },
      "npm:escope@3.6.0": {
        "map": {
          "es6-map": "npm:es6-map@0.1.4",
          "estraverse": "npm:estraverse@4.2.0",
          "es6-weak-map": "npm:es6-weak-map@2.0.1",
          "esrecurse": "npm:esrecurse@4.1.0"
        }
      },
      "npm:doctrine@0.6.4": {
        "map": {
          "esutils": "npm:esutils@1.1.6",
          "isarray": "npm:isarray@0.0.1"
        }
      },
      "npm:feature-detect-es6@1.3.1": {
        "map": {
          "array-back": "npm:array-back@1.0.3"
        }
      },
      "npm:cipher-base@1.0.3": {
        "map": {
          "inherits": "npm:inherits@2.0.3"
        }
      },
      "npm:browserify-rsa@4.0.1": {
        "map": {
          "randombytes": "npm:randombytes@2.0.3",
          "bn.js": "npm:bn.js@4.11.6"
        }
      },
      "npm:evp_bytestokey@1.0.0": {
        "map": {
          "create-hash": "npm:create-hash@1.1.2"
        }
      },
      "npm:dmd@1.4.2": {
        "map": {
          "array-back": "npm:array-back@1.0.3",
          "object-tools": "npm:object-tools@2.0.6",
          "walk-back": "npm:walk-back@2.0.1",
          "command-line-tool": "npm:command-line-tool@0.5.2",
          "file-set": "npm:file-set@1.1.1",
          "handlebars-array": "npm:handlebars-array@0.2.1",
          "handlebars-json": "npm:handlebars-json@1.0.1",
          "common-sequence": "npm:common-sequence@1.0.2",
          "reduce-unique": "npm:reduce-unique@1.0.0",
          "reduce-without": "npm:reduce-without@1.0.1",
          "stream-handlebars": "npm:stream-handlebars@0.1.6",
          "string-tools": "npm:string-tools@1.0.0",
          "handlebars-regexp": "npm:handlebars-regexp@1.0.1",
          "handlebars-comparison": "npm:handlebars-comparison@2.0.1",
          "handlebars-string": "npm:handlebars-string@2.0.2",
          "ddata": "npm:ddata@0.1.28"
        }
      },
      "npm:micromatch@2.3.11": {
        "map": {
          "is-glob": "npm:is-glob@2.0.1",
          "filename-regex": "npm:filename-regex@2.0.0",
          "array-unique": "npm:array-unique@0.2.1",
          "normalize-path": "npm:normalize-path@2.0.1",
          "is-extglob": "npm:is-extglob@1.0.0",
          "object.omit": "npm:object.omit@2.0.1",
          "arr-diff": "npm:arr-diff@2.0.0",
          "parse-glob": "npm:parse-glob@3.0.4",
          "regex-cache": "npm:regex-cache@0.4.3",
          "extglob": "npm:extglob@0.3.2",
          "kind-of": "npm:kind-of@3.0.4",
          "expand-brackets": "npm:expand-brackets@0.1.5",
          "braces": "npm:braces@1.8.5"
        }
      },
      "npm:test-value@1.1.0": {
        "map": {
          "array-back": "npm:array-back@1.0.3",
          "typical": "npm:typical@2.6.0"
        }
      },
      "npm:glob-parent@2.0.0": {
        "map": {
          "is-glob": "npm:is-glob@2.0.1"
        }
      },
      "npm:parse-asn1@5.0.0": {
        "map": {
          "browserify-aes": "npm:browserify-aes@1.0.6",
          "create-hash": "npm:create-hash@1.1.2",
          "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
          "pbkdf2": "npm:pbkdf2@3.0.9",
          "asn1.js": "npm:asn1.js@4.8.1"
        }
      },
      "npm:is-my-json-valid@2.15.0": {
        "map": {
          "xtend": "npm:xtend@4.0.1",
          "generate-function": "npm:generate-function@2.0.0",
          "jsonpointer": "npm:jsonpointer@4.0.0",
          "generate-object-property": "npm:generate-object-property@1.2.0"
        }
      },
      "npm:collect-json@1.0.8": {
        "map": {
          "stream-connect": "npm:stream-connect@1.0.2",
          "collect-all": "npm:collect-all@1.0.2",
          "stream-via": "npm:stream-via@1.0.3"
        }
      },
      "npm:prompt@0.2.14": {
        "map": {
          "read": "npm:read@1.0.7",
          "pkginfo": "npm:pkginfo@0.4.0",
          "revalidator": "npm:revalidator@0.1.8",
          "utile": "npm:utile@0.2.1",
          "winston": "npm:winston@0.8.3"
        }
      },
      "npm:argparse@1.0.9": {
        "map": {
          "sprintf-js": "npm:sprintf-js@1.0.3"
        }
      },
      "npm:table-layout@0.2.3": {
        "map": {
          "ansi-escape-sequences": "npm:ansi-escape-sequences@3.0.0",
          "array-back": "npm:array-back@1.0.3",
          "collect-json": "npm:collect-json@1.0.8",
          "core-js": "npm:core-js@2.4.1",
          "feature-detect-es6": "npm:feature-detect-es6@1.3.1",
          "typical": "npm:typical@2.6.0",
          "command-line-tool": "npm:command-line-tool@0.6.4",
          "wordwrapjs": "npm:wordwrapjs@1.2.1",
          "deep-extend": "npm:deep-extend@0.4.1"
        }
      },
      "npm:vow-queue@0.4.2": {
        "map": {
          "vow": "npm:vow@0.4.12"
        }
      },
      "npm:readdirp@2.1.0": {
        "map": {
          "graceful-fs": "npm:graceful-fs@4.1.9",
          "readable-stream": "npm:readable-stream@2.1.5",
          "minimatch": "npm:minimatch@3.0.3",
          "set-immediate-shim": "npm:set-immediate-shim@1.0.1"
        }
      },
      "npm:find-replace@1.0.2": {
        "map": {
          "test-value": "npm:test-value@2.1.0",
          "array-back": "npm:array-back@1.0.3"
        }
      },
      "github:jspm/nodelibs-stream@0.2.0-alpha": {
        "map": {
          "stream-browserify": "npm:stream-browserify@2.0.1"
        }
      },
      "npm:inquirer@0.8.5": {
        "map": {
          "chalk": "npm:chalk@1.1.3",
          "ansi-regex": "npm:ansi-regex@1.1.1",
          "figures": "npm:figures@1.7.0",
          "lodash": "npm:lodash@3.10.1",
          "through": "npm:through@2.3.8",
          "readline2": "npm:readline2@0.1.1",
          "cli-width": "npm:cli-width@1.1.1",
          "rx": "npm:rx@2.5.3"
        }
      },
      "npm:miller-rabin@4.0.0": {
        "map": {
          "bn.js": "npm:bn.js@4.11.6",
          "brorand": "npm:brorand@1.0.6"
        }
      },
      "npm:debug@2.2.0": {
        "map": {
          "ms": "npm:ms@0.7.1"
        }
      },
      "npm:optionator@0.8.2": {
        "map": {
          "deep-is": "npm:deep-is@0.1.3",
          "wordwrap": "npm:wordwrap@1.0.0",
          "prelude-ls": "npm:prelude-ls@1.1.2",
          "fast-levenshtein": "npm:fast-levenshtein@2.0.5",
          "type-check": "npm:type-check@0.3.2",
          "levn": "npm:levn@0.3.0"
        }
      },
      "npm:optionator@0.5.0": {
        "map": {
          "deep-is": "npm:deep-is@0.1.3",
          "wordwrap": "npm:wordwrap@0.0.3",
          "prelude-ls": "npm:prelude-ls@1.1.2",
          "fast-levenshtein": "npm:fast-levenshtein@1.0.7",
          "type-check": "npm:type-check@0.3.2",
          "levn": "npm:levn@0.2.5"
        }
      },
      "npm:yargs@3.10.0": {
        "map": {
          "decamelize": "npm:decamelize@1.2.0",
          "camelcase": "npm:camelcase@1.2.1",
          "window-size": "npm:window-size@0.1.0",
          "cliui": "npm:cliui@2.1.0"
        }
      },
      "npm:app-usage-stats@0.3.6": {
        "map": {
          "array-back": "npm:array-back@1.0.3",
          "core-js": "npm:core-js@2.4.1",
          "feature-detect-es6": "npm:feature-detect-es6@1.3.1",
          "test-value": "npm:test-value@2.1.0",
          "home-path": "npm:home-path@1.0.3",
          "usage-stats": "npm:usage-stats@0.7.0"
        }
      },
      "npm:babel-runtime@6.18.0": {
        "map": {
          "core-js": "npm:core-js@2.4.1",
          "regenerator-runtime": "npm:regenerator-runtime@0.9.5"
        }
      },
      "npm:command-line-tool@0.6.4": {
        "map": {
          "ansi-escape-sequences": "npm:ansi-escape-sequences@3.0.0",
          "array-back": "npm:array-back@1.0.3",
          "command-line-args": "npm:command-line-args@3.0.1",
          "command-line-usage": "npm:command-line-usage@3.0.5",
          "feature-detect-es6": "npm:feature-detect-es6@1.3.1",
          "typical": "npm:typical@2.6.0"
        }
      },
      "npm:command-line-tool@0.1.0": {
        "map": {
          "ansi-escape-sequences": "npm:ansi-escape-sequences@2.2.2",
          "array-back": "npm:array-back@1.0.3"
        }
      },
      "npm:command-line-tool@0.5.2": {
        "map": {
          "ansi-escape-sequences": "npm:ansi-escape-sequences@2.2.2",
          "array-back": "npm:array-back@1.0.3",
          "command-line-args": "npm:command-line-args@3.0.1",
          "command-line-usage": "npm:command-line-usage@3.0.5",
          "feature-detect-es6": "npm:feature-detect-es6@1.3.1",
          "typical": "npm:typical@2.6.0"
        }
      },
      "npm:test-value@2.1.0": {
        "map": {
          "array-back": "npm:array-back@1.0.3",
          "typical": "npm:typical@2.6.0"
        }
      },
      "npm:elliptic@6.3.2": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "bn.js": "npm:bn.js@4.11.6",
          "brorand": "npm:brorand@1.0.6",
          "hash.js": "npm:hash.js@1.0.3"
        }
      },
      "npm:camelcase-keys@2.1.0": {
        "map": {
          "map-obj": "npm:map-obj@1.0.1",
          "camelcase": "npm:camelcase@2.1.1"
        }
      },
      "npm:collect-all@1.0.2": {
        "map": {
          "stream-connect": "npm:stream-connect@1.0.2",
          "stream-via": "npm:stream-via@1.0.3"
        }
      },
      "npm:collect-all@0.2.1": {
        "map": {
          "stream-connect": "npm:stream-connect@1.0.2",
          "typical": "npm:typical@2.6.0",
          "stream-via": "npm:stream-via@0.1.1"
        }
      },
      "npm:normalize-package-data@2.3.5": {
        "map": {
          "hosted-git-info": "npm:hosted-git-info@2.1.5",
          "validate-npm-package-license": "npm:validate-npm-package-license@3.0.1",
          "is-builtin-module": "npm:is-builtin-module@1.0.0",
          "semver": "npm:semver@5.3.0"
        }
      },
      "npm:loud-rejection@1.6.0": {
        "map": {
          "currently-unhandled": "npm:currently-unhandled@0.4.1",
          "signal-exit": "npm:signal-exit@3.0.1"
        }
      },
      "npm:type-check@0.3.2": {
        "map": {
          "prelude-ls": "npm:prelude-ls@1.1.2"
        }
      },
      "npm:levn@0.2.5": {
        "map": {
          "prelude-ls": "npm:prelude-ls@1.1.2",
          "type-check": "npm:type-check@0.3.2"
        }
      },
      "npm:levn@0.3.0": {
        "map": {
          "prelude-ls": "npm:prelude-ls@1.1.2",
          "type-check": "npm:type-check@0.3.2"
        }
      },
      "npm:utile@0.2.1": {
        "map": {
          "async": "npm:async@0.2.10",
          "mkdirp": "npm:mkdirp@0.5.1",
          "rimraf": "npm:rimraf@2.2.8",
          "deep-equal": "npm:deep-equal@1.0.1",
          "ncp": "npm:ncp@0.4.2",
          "i": "npm:i@0.3.5"
        }
      },
      "npm:is-binary-path@1.0.1": {
        "map": {
          "binary-extensions": "npm:binary-extensions@1.7.0"
        }
      },
      "npm:is-glob@2.0.1": {
        "map": {
          "is-extglob": "npm:is-extglob@1.0.0"
        }
      },
      "npm:es6-weak-map@2.0.1": {
        "map": {
          "d": "npm:d@0.1.1",
          "es5-ext": "npm:es5-ext@0.10.12",
          "es6-iterator": "npm:es6-iterator@2.0.0",
          "es6-symbol": "npm:es6-symbol@3.1.0"
        }
      },
      "npm:file-set@0.2.8": {
        "map": {
          "glob": "npm:glob@4.5.3",
          "array-tools": "npm:array-tools@2.0.9"
        }
      },
      "npm:file-set@1.1.1": {
        "map": {
          "array-back": "npm:array-back@1.0.3",
          "glob": "npm:glob@7.1.1"
        }
      },
      "npm:lodash._createassigner@3.1.1": {
        "map": {
          "lodash._bindcallback": "npm:lodash._bindcallback@3.0.1",
          "lodash.restparam": "npm:lodash.restparam@3.6.1",
          "lodash._isiterateecall": "npm:lodash._isiterateecall@3.0.9"
        }
      },
      "npm:winston@0.8.3": {
        "map": {
          "pkginfo": "npm:pkginfo@0.3.1",
          "async": "npm:async@0.2.10",
          "colors": "npm:colors@0.6.2",
          "isstream": "npm:isstream@0.1.2",
          "stack-trace": "npm:stack-trace@0.0.9",
          "eyes": "npm:eyes@0.1.8",
          "cycle": "npm:cycle@1.0.3"
        }
      },
      "npm:jsdoc-api@1.2.4": {
        "map": {
          "core-js": "npm:core-js@2.4.1",
          "array-back": "npm:array-back@1.0.3",
          "collect-all": "npm:collect-all@1.0.2",
          "feature-detect-es6": "npm:feature-detect-es6@1.3.1",
          "file-set": "npm:file-set@1.1.1",
          "walk-back": "npm:walk-back@2.0.1",
          "cache-point": "npm:cache-point@0.3.4",
          "promise.prototype.finally": "npm:promise.prototype.finally@1.0.1",
          "temp-path": "npm:temp-path@1.0.0",
          "object-to-spawn-args": "npm:object-to-spawn-args@1.1.0",
          "then-fs": "npm:then-fs@2.0.0",
          "jsdoc-75lb": "npm:jsdoc-75lb@3.6.0"
        }
      },
      "npm:wordwrapjs@1.2.1": {
        "map": {
          "array-back": "npm:array-back@1.0.3",
          "typical": "npm:typical@2.6.0"
        }
      },
      "npm:lodash._baseassign@3.2.0": {
        "map": {
          "lodash._basecopy": "npm:lodash._basecopy@3.0.1",
          "lodash.keys": "npm:lodash.keys@3.1.2"
        }
      },
      "npm:esrecurse@4.1.0": {
        "map": {
          "estraverse": "npm:estraverse@4.1.1",
          "object-assign": "npm:object-assign@4.1.0"
        }
      },
      "npm:column-layout@2.1.4": {
        "map": {
          "core-js": "npm:core-js@2.4.1",
          "ansi-escape-sequences": "npm:ansi-escape-sequences@2.2.2",
          "array-back": "npm:array-back@1.0.3",
          "collect-json": "npm:collect-json@1.0.8",
          "command-line-args": "npm:command-line-args@2.1.6",
          "deep-extend": "npm:deep-extend@0.4.1",
          "feature-detect-es6": "npm:feature-detect-es6@1.3.1",
          "object-tools": "npm:object-tools@2.0.6",
          "typical": "npm:typical@2.6.0",
          "wordwrapjs": "npm:wordwrapjs@1.2.1"
        }
      },
      "npm:read@1.0.7": {
        "map": {
          "mute-stream": "npm:mute-stream@0.0.6"
        }
      },
      "npm:parse-glob@3.0.4": {
        "map": {
          "is-extglob": "npm:is-extglob@1.0.0",
          "is-glob": "npm:is-glob@2.0.1",
          "is-dotfile": "npm:is-dotfile@1.0.2",
          "glob-base": "npm:glob-base@0.3.0"
        }
      },
      "npm:handlebars-array@0.2.1": {
        "map": {
          "array-tools": "npm:array-tools@1.8.6"
        }
      },
      "npm:read-pkg-up@1.0.1": {
        "map": {
          "find-up": "npm:find-up@1.1.2",
          "read-pkg": "npm:read-pkg@1.1.0"
        }
      },
      "npm:redent@1.0.0": {
        "map": {
          "indent-string": "npm:indent-string@2.1.0",
          "strip-indent": "npm:strip-indent@1.0.1"
        }
      },
      "npm:stream-handlebars@0.1.6": {
        "map": {
          "object-tools": "npm:object-tools@1.6.7",
          "handlebars": "npm:handlebars@3.0.3"
        }
      },
      "npm:des.js@1.0.0": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
        }
      },
      "npm:reduce-without@1.0.1": {
        "map": {
          "test-value": "npm:test-value@2.1.0"
        }
      },
      "npm:extglob@0.3.2": {
        "map": {
          "is-extglob": "npm:is-extglob@1.0.0"
        }
      },
      "npm:kind-of@3.0.4": {
        "map": {
          "is-buffer": "npm:is-buffer@1.1.4"
        }
      },
      "npm:readline2@0.1.1": {
        "map": {
          "mute-stream": "npm:mute-stream@0.0.4",
          "strip-ansi": "npm:strip-ansi@2.0.1"
        }
      },
      "npm:handlebars-comparison@2.0.1": {
        "map": {
          "array-tools": "npm:array-tools@1.8.6"
        }
      },
      "npm:handlebars-string@2.0.2": {
        "map": {
          "string-tools": "npm:string-tools@0.1.8",
          "array-tools": "npm:array-tools@1.8.6"
        }
      },
      "npm:cliui@2.1.0": {
        "map": {
          "wordwrap": "npm:wordwrap@0.0.2",
          "right-align": "npm:right-align@0.1.3",
          "center-align": "npm:center-align@0.1.3"
        }
      },
      "github:jspm/nodelibs-http@0.2.0-alpha": {
        "map": {
          "http-browserify": "npm:stream-http@2.4.1"
        }
      },
      "npm:array-tools@1.8.6": {
        "map": {
          "object-tools": "npm:object-tools@1.6.7",
          "typical": "npm:typical@2.6.0"
        }
      },
      "npm:array-tools@2.0.9": {
        "map": {
          "ansi-escape-sequences": "npm:ansi-escape-sequences@2.2.2",
          "array-back": "npm:array-back@1.0.3",
          "collect-json": "npm:collect-json@1.0.8",
          "object-get": "npm:object-get@2.1.0",
          "reduce-unique": "npm:reduce-unique@1.0.0",
          "reduce-without": "npm:reduce-without@1.0.1",
          "test-value": "npm:test-value@1.1.0",
          "sort-array": "npm:sort-array@1.1.1",
          "filter-where": "npm:filter-where@1.0.1",
          "reduce-extract": "npm:reduce-extract@1.0.0",
          "reduce-flatten": "npm:reduce-flatten@1.0.1"
        }
      },
      "npm:object-tools@1.6.7": {
        "map": {
          "array-tools": "npm:array-tools@1.8.6",
          "typical": "npm:typical@2.6.0"
        }
      },
      "npm:ddata@0.1.28": {
        "map": {
          "core-js": "npm:core-js@2.4.1",
          "array-back": "npm:array-back@1.0.3",
          "object-get": "npm:object-get@2.1.0",
          "string-tools": "npm:string-tools@1.0.0",
          "test-value": "npm:test-value@2.1.0",
          "handlebars": "npm:handlebars@3.0.3",
          "reduce-flatten": "npm:reduce-flatten@1.0.1",
          "marked": "npm:marked@0.3.6"
        }
      },
      "github:jspm/nodelibs-string_decoder@0.2.0-alpha": {
        "map": {
          "string_decoder-browserify": "npm:string_decoder@0.10.31"
        }
      },
      "npm:strip-indent@1.0.1": {
        "map": {
          "get-stdin": "npm:get-stdin@4.0.1"
        }
      },
      "npm:fsevents@1.0.14": {
        "map": {
          "nan": "npm:nan@2.4.0",
          "node-pre-gyp": "npm:node-pre-gyp@0.6.31"
        }
      },
      "npm:validate-npm-package-license@3.0.1": {
        "map": {
          "spdx-correct": "npm:spdx-correct@1.0.2",
          "spdx-expression-parse": "npm:spdx-expression-parse@1.0.4"
        }
      },
      "npm:usage-stats@0.7.0": {
        "map": {
          "core-js": "npm:core-js@2.4.1",
          "array-back": "npm:array-back@1.0.3",
          "command-line-args": "npm:command-line-args@3.0.1",
          "command-line-usage": "npm:command-line-usage@3.0.5",
          "feature-detect-es6": "npm:feature-detect-es6@1.3.1",
          "home-path": "npm:home-path@1.0.3",
          "mkdirp": "npm:mkdirp@0.5.1",
          "typical": "npm:typical@2.6.0",
          "command-line-commands": "npm:command-line-commands@1.0.4",
          "node-uuid": "npm:node-uuid@1.4.7",
          "req-then": "npm:req-then@0.5.0"
        }
      },
      "npm:object.omit@2.0.1": {
        "map": {
          "for-own": "npm:for-own@0.1.4",
          "is-extendable": "npm:is-extendable@0.1.1"
        }
      },
      "npm:generate-object-property@1.2.0": {
        "map": {
          "is-property": "npm:is-property@1.0.2"
        }
      },
      "npm:arr-diff@2.0.0": {
        "map": {
          "arr-flatten": "npm:arr-flatten@1.0.1"
        }
      },
      "npm:regex-cache@0.4.3": {
        "map": {
          "is-primitive": "npm:is-primitive@2.0.0",
          "is-equal-shallow": "npm:is-equal-shallow@0.1.3"
        }
      },
      "npm:expand-brackets@0.1.5": {
        "map": {
          "is-posix-bracket": "npm:is-posix-bracket@0.1.1"
        }
      },
      "npm:read-pkg@1.1.0": {
        "map": {
          "normalize-package-data": "npm:normalize-package-data@2.3.5",
          "path-type": "npm:path-type@1.1.0",
          "load-json-file": "npm:load-json-file@1.1.0"
        }
      },
      "npm:currently-unhandled@0.4.1": {
        "map": {
          "array-find-index": "npm:array-find-index@1.0.2"
        }
      },
      "npm:asn1.js@4.8.1": {
        "map": {
          "bn.js": "npm:bn.js@4.11.6",
          "inherits": "npm:inherits@2.0.3",
          "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
        }
      },
      "npm:indent-string@2.1.0": {
        "map": {
          "repeating": "npm:repeating@2.0.1"
        }
      },
      "npm:find-up@1.1.2": {
        "map": {
          "pinkie-promise": "npm:pinkie-promise@2.0.1",
          "path-exists": "npm:path-exists@2.1.0"
        }
      },
      "npm:cache-point@0.3.4": {
        "map": {
          "core-js": "npm:core-js@2.4.1",
          "array-back": "npm:array-back@1.0.3",
          "feature-detect-es6": "npm:feature-detect-es6@1.3.1",
          "mkdirp": "npm:mkdirp@0.5.1",
          "fs-then-native": "npm:fs-then-native@1.0.2"
        }
      },
      "npm:braces@1.8.5": {
        "map": {
          "repeat-element": "npm:repeat-element@1.1.2",
          "preserve": "npm:preserve@0.2.0",
          "expand-range": "npm:expand-range@1.8.2"
        }
      },
      "npm:node-pre-gyp@0.6.31": {
        "map": {
          "nopt": "npm:nopt@3.0.6",
          "rimraf": "npm:rimraf@2.5.4",
          "mkdirp": "npm:mkdirp@0.5.1",
          "semver": "npm:semver@5.3.0",
          "tar": "npm:tar@2.2.1",
          "tar-pack": "npm:tar-pack@3.3.0",
          "npmlog": "npm:npmlog@4.0.0",
          "rc": "npm:rc@1.1.6",
          "request": "npm:request@2.76.0"
        }
      },
      "npm:glob-base@0.3.0": {
        "map": {
          "glob-parent": "npm:glob-parent@2.0.0",
          "is-glob": "npm:is-glob@2.0.1"
        }
      },
      "npm:hash.js@1.0.3": {
        "map": {
          "inherits": "npm:inherits@2.0.3"
        }
      },
      "npm:is-equal-shallow@0.1.3": {
        "map": {
          "is-primitive": "npm:is-primitive@2.0.0"
        }
      },
      "npm:rimraf@2.5.4": {
        "map": {
          "glob": "npm:glob@7.1.1"
        }
      },
      "npm:jsdoc-75lb@3.6.0": {
        "map": {
          "espree": "npm:espree@3.1.7",
          "strip-json-comments": "npm:strip-json-comments@2.0.1",
          "underscore": "npm:underscore@1.8.3",
          "escape-string-regexp": "npm:escape-string-regexp@1.0.5",
          "mkdirp": "npm:mkdirp@0.5.1",
          "marked": "npm:marked@0.3.6",
          "requizzle": "npm:requizzle@0.2.1",
          "taffydb": "npm:taffydb@2.6.2",
          "js2xmlparser": "npm:js2xmlparser@1.0.0",
          "klaw": "npm:klaw@1.3.1",
          "catharsis": "npm:catharsis@0.8.8",
          "bluebird": "npm:bluebird@3.4.6"
        }
      },
      "npm:nopt@3.0.6": {
        "map": {
          "abbrev": "npm:abbrev@1.0.9"
        }
      },
      "npm:is-builtin-module@1.0.0": {
        "map": {
          "builtin-modules": "npm:builtin-modules@1.1.1"
        }
      },
      "npm:lodash.keys@3.1.2": {
        "map": {
          "lodash._getnative": "npm:lodash._getnative@3.9.1",
          "lodash.isarguments": "npm:lodash.isarguments@3.1.0",
          "lodash.isarray": "npm:lodash.isarray@3.0.4"
        }
      },
      "npm:handlebars@3.0.3": {
        "map": {
          "source-map": "npm:source-map@0.1.43",
          "optimist": "npm:optimist@0.6.1"
        }
      },
      "npm:sort-array@1.1.1": {
        "map": {
          "array-back": "npm:array-back@1.0.3",
          "object-get": "npm:object-get@2.1.0",
          "typical": "npm:typical@2.6.0"
        }
      },
      "npm:filter-where@1.0.1": {
        "map": {
          "test-value": "npm:test-value@1.1.0"
        }
      },
      "npm:reduce-extract@1.0.0": {
        "map": {
          "test-value": "npm:test-value@1.1.0"
        }
      },
      "npm:espree@3.1.7": {
        "map": {
          "acorn": "npm:acorn@3.3.0",
          "acorn-jsx": "npm:acorn-jsx@3.0.1"
        }
      },
      "npm:uglify-js@2.3.6": {
        "map": {
          "async": "npm:async@0.2.10",
          "source-map": "npm:source-map@0.1.43",
          "optimist": "npm:optimist@0.3.7"
        }
      },
      "npm:source-map@0.1.43": {
        "map": {
          "amdefine": "npm:amdefine@1.0.0"
        }
      },
      "npm:command-line-commands@1.0.4": {
        "map": {
          "array-back": "npm:array-back@1.0.3",
          "feature-detect-es6": "npm:feature-detect-es6@1.3.1"
        }
      },
      "npm:for-own@0.1.4": {
        "map": {
          "for-in": "npm:for-in@0.1.6"
        }
      },
      "npm:req-then@0.5.0": {
        "map": {
          "array-back": "npm:array-back@1.0.3",
          "feature-detect-es6": "npm:feature-detect-es6@1.3.1",
          "typical": "npm:typical@2.6.0",
          "lodash.pick": "npm:lodash.pick@4.4.0",
          "defer-promise": "npm:defer-promise@1.0.0"
        }
      },
      "npm:pinkie-promise@2.0.1": {
        "map": {
          "pinkie": "npm:pinkie@2.0.4"
        }
      },
      "npm:path-exists@2.1.0": {
        "map": {
          "pinkie-promise": "npm:pinkie-promise@2.0.1"
        }
      },
      "npm:spdx-correct@1.0.2": {
        "map": {
          "spdx-license-ids": "npm:spdx-license-ids@1.2.2"
        }
      },
      "npm:right-align@0.1.3": {
        "map": {
          "align-text": "npm:align-text@0.1.4"
        }
      },
      "npm:center-align@0.1.3": {
        "map": {
          "align-text": "npm:align-text@0.1.4",
          "lazy-cache": "npm:lazy-cache@1.0.4"
        }
      },
      "npm:tar-pack@3.3.0": {
        "map": {
          "once": "npm:once@1.3.3",
          "readable-stream": "npm:readable-stream@2.1.5",
          "debug": "npm:debug@2.2.0",
          "rimraf": "npm:rimraf@2.5.4",
          "tar": "npm:tar@2.2.1",
          "uid-number": "npm:uid-number@0.0.6",
          "fstream-ignore": "npm:fstream-ignore@1.0.5",
          "fstream": "npm:fstream@1.0.10"
        }
      },
      "npm:tar@2.2.1": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "block-stream": "npm:block-stream@0.0.9",
          "fstream": "npm:fstream@1.0.10"
        }
      },
      "npm:then-fs@2.0.0": {
        "map": {
          "promise": "npm:promise@7.1.1"
        }
      },
      "npm:path-type@1.1.0": {
        "map": {
          "graceful-fs": "npm:graceful-fs@4.1.9",
          "pinkie-promise": "npm:pinkie-promise@2.0.1",
          "pify": "npm:pify@2.3.0"
        }
      },
      "npm:fs-then-native@1.0.2": {
        "map": {
          "feature-detect-es6": "npm:feature-detect-es6@1.3.1"
        }
      },
      "npm:rc@1.1.6": {
        "map": {
          "strip-json-comments": "npm:strip-json-comments@1.0.4",
          "deep-extend": "npm:deep-extend@0.4.1",
          "minimist": "npm:minimist@1.2.0",
          "ini": "npm:ini@1.3.4"
        }
      },
      "npm:load-json-file@1.1.0": {
        "map": {
          "graceful-fs": "npm:graceful-fs@4.1.9",
          "pinkie-promise": "npm:pinkie-promise@2.0.1",
          "parse-json": "npm:parse-json@2.2.0",
          "pify": "npm:pify@2.3.0",
          "strip-bom": "npm:strip-bom@2.0.0"
        }
      },
      "npm:repeating@2.0.1": {
        "map": {
          "is-finite": "npm:is-finite@1.0.2"
        }
      },
      "npm:requizzle@0.2.1": {
        "map": {
          "underscore": "npm:underscore@1.6.0"
        }
      },
      "npm:expand-range@1.8.2": {
        "map": {
          "fill-range": "npm:fill-range@2.2.3"
        }
      },
      "npm:once@1.3.3": {
        "map": {
          "wrappy": "npm:wrappy@1.0.2"
        }
      },
      "npm:align-text@0.1.4": {
        "map": {
          "kind-of": "npm:kind-of@3.0.4",
          "longest": "npm:longest@1.0.1",
          "repeat-string": "npm:repeat-string@1.6.1"
        }
      },
      "npm:fill-range@2.2.3": {
        "map": {
          "repeat-element": "npm:repeat-element@1.1.2",
          "repeat-string": "npm:repeat-string@1.6.1",
          "isobject": "npm:isobject@2.1.0",
          "is-number": "npm:is-number@2.1.0",
          "randomatic": "npm:randomatic@1.1.5"
        }
      },
      "npm:optimist@0.6.1": {
        "map": {
          "wordwrap": "npm:wordwrap@0.0.3",
          "minimist": "npm:minimist@0.0.8"
        }
      },
      "npm:optimist@0.3.7": {
        "map": {
          "wordwrap": "npm:wordwrap@0.0.3"
        }
      },
      "npm:acorn-jsx@3.0.1": {
        "map": {
          "acorn": "npm:acorn@3.3.0"
        }
      },
      "npm:npmlog@4.0.0": {
        "map": {
          "set-blocking": "npm:set-blocking@2.0.0",
          "console-control-strings": "npm:console-control-strings@1.1.0",
          "are-we-there-yet": "npm:are-we-there-yet@1.1.2",
          "gauge": "npm:gauge@2.6.0"
        }
      },
      "npm:block-stream@0.0.9": {
        "map": {
          "inherits": "npm:inherits@2.0.3"
        }
      },
      "npm:fstream-ignore@1.0.5": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "minimatch": "npm:minimatch@3.0.3",
          "fstream": "npm:fstream@1.0.10"
        }
      },
      "npm:are-we-there-yet@1.1.2": {
        "map": {
          "readable-stream": "npm:readable-stream@1.1.14",
          "delegates": "npm:delegates@1.0.0"
        }
      },
      "npm:promise@7.1.1": {
        "map": {
          "asap": "npm:asap@2.0.5"
        }
      },
      "npm:fstream@1.0.10": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "graceful-fs": "npm:graceful-fs@4.1.9",
          "mkdirp": "npm:mkdirp@0.5.1",
          "rimraf": "npm:rimraf@2.5.4"
        }
      },
      "npm:is-finite@1.0.2": {
        "map": {
          "number-is-nan": "npm:number-is-nan@1.0.1"
        }
      },
      "npm:catharsis@0.8.8": {
        "map": {
          "underscore-contrib": "npm:underscore-contrib@0.3.0"
        }
      },
      "npm:gauge@2.6.0": {
        "map": {
          "object-assign": "npm:object-assign@4.1.0",
          "strip-ansi": "npm:strip-ansi@3.0.1",
          "console-control-strings": "npm:console-control-strings@1.1.0",
          "signal-exit": "npm:signal-exit@3.0.1",
          "has-color": "npm:has-color@0.1.7",
          "aproba": "npm:aproba@1.0.4",
          "has-unicode": "npm:has-unicode@2.0.1",
          "string-width": "npm:string-width@1.0.2",
          "wide-align": "npm:wide-align@1.1.0"
        }
      },
      "npm:request@2.76.0": {
        "map": {
          "qs": "npm:qs@6.3.0",
          "isstream": "npm:isstream@0.1.2",
          "node-uuid": "npm:node-uuid@1.4.7",
          "aws-sign2": "npm:aws-sign2@0.6.0",
          "is-typedarray": "npm:is-typedarray@1.0.0",
          "forever-agent": "npm:forever-agent@0.6.1",
          "json-stringify-safe": "npm:json-stringify-safe@5.0.1",
          "oauth-sign": "npm:oauth-sign@0.8.2",
          "stringstream": "npm:stringstream@0.0.5",
          "tunnel-agent": "npm:tunnel-agent@0.4.3",
          "extend": "npm:extend@3.0.0",
          "caseless": "npm:caseless@0.11.0",
          "combined-stream": "npm:combined-stream@1.0.5",
          "http-signature": "npm:http-signature@1.1.1",
          "form-data": "npm:form-data@2.1.1",
          "har-validator": "npm:har-validator@2.0.6",
          "mime-types": "npm:mime-types@2.1.12",
          "aws4": "npm:aws4@1.5.0",
          "tough-cookie": "npm:tough-cookie@2.3.2",
          "hawk": "npm:hawk@3.1.3"
        }
      },
      "github:jspm/nodelibs-url@0.2.0-alpha": {
        "map": {
          "url-browserify": "npm:url@0.11.0"
        }
      },
      "npm:parse-json@2.2.0": {
        "map": {
          "error-ex": "npm:error-ex@1.3.0"
        }
      },
      "npm:isobject@2.1.0": {
        "map": {
          "isarray": "npm:isarray@1.0.0"
        }
      },
      "npm:randomatic@1.1.5": {
        "map": {
          "is-number": "npm:is-number@2.1.0",
          "kind-of": "npm:kind-of@3.0.4"
        }
      },
      "npm:is-number@2.1.0": {
        "map": {
          "kind-of": "npm:kind-of@3.0.4"
        }
      },
      "npm:underscore-contrib@0.3.0": {
        "map": {
          "underscore": "npm:underscore@1.6.0"
        }
      },
      "npm:strip-bom@2.0.0": {
        "map": {
          "is-utf8": "npm:is-utf8@0.2.1"
        }
      },
      "npm:string-width@1.0.2": {
        "map": {
          "strip-ansi": "npm:strip-ansi@3.0.1",
          "code-point-at": "npm:code-point-at@1.0.1",
          "is-fullwidth-code-point": "npm:is-fullwidth-code-point@1.0.0"
        }
      },
      "npm:wide-align@1.1.0": {
        "map": {
          "string-width": "npm:string-width@1.0.2"
        }
      },
      "npm:error-ex@1.3.0": {
        "map": {
          "is-arrayish": "npm:is-arrayish@0.2.1"
        }
      },
      "npm:form-data@2.1.1": {
        "map": {
          "combined-stream": "npm:combined-stream@1.0.5",
          "mime-types": "npm:mime-types@2.1.12",
          "asynckit": "npm:asynckit@0.4.0"
        }
      },
      "npm:har-validator@2.0.6": {
        "map": {
          "commander": "npm:commander@2.9.0",
          "chalk": "npm:chalk@1.1.3",
          "is-my-json-valid": "npm:is-my-json-valid@2.15.0",
          "pinkie-promise": "npm:pinkie-promise@2.0.1"
        }
      },
      "npm:tough-cookie@2.3.2": {
        "map": {
          "punycode": "npm:punycode@1.4.1"
        }
      },
      "github:jspm/nodelibs-timers@0.2.0-alpha": {
        "map": {
          "timers-browserify": "npm:timers-browserify@1.4.2"
        }
      },
      "npm:combined-stream@1.0.5": {
        "map": {
          "delayed-stream": "npm:delayed-stream@1.0.0"
        }
      },
      "npm:http-signature@1.1.1": {
        "map": {
          "assert-plus": "npm:assert-plus@0.2.0",
          "jsprim": "npm:jsprim@1.3.1",
          "sshpk": "npm:sshpk@1.10.1"
        }
      },
      "npm:code-point-at@1.0.1": {
        "map": {
          "number-is-nan": "npm:number-is-nan@1.0.1"
        }
      },
      "npm:is-fullwidth-code-point@1.0.0": {
        "map": {
          "number-is-nan": "npm:number-is-nan@1.0.1"
        }
      },
      "npm:commander@2.9.0": {
        "map": {
          "graceful-readlink": "npm:graceful-readlink@1.0.1"
        }
      },
      "npm:mime-types@2.1.12": {
        "map": {
          "mime-db": "npm:mime-db@1.24.0"
        }
      },
      "npm:hawk@3.1.3": {
        "map": {
          "cryptiles": "npm:cryptiles@2.0.5",
          "sntp": "npm:sntp@1.0.9",
          "boom": "npm:boom@2.10.1",
          "hoek": "npm:hoek@2.16.3"
        }
      },
      "npm:sshpk@1.10.1": {
        "map": {
          "assert-plus": "npm:assert-plus@1.0.0",
          "getpass": "npm:getpass@0.1.6",
          "asn1": "npm:asn1@0.2.3",
          "dashdash": "npm:dashdash@1.14.0"
        }
      },
      "npm:cryptiles@2.0.5": {
        "map": {
          "boom": "npm:boom@2.10.1"
        }
      },
      "npm:jsprim@1.3.1": {
        "map": {
          "extsprintf": "npm:extsprintf@1.0.2",
          "json-schema": "npm:json-schema@0.2.3",
          "verror": "npm:verror@1.3.6"
        }
      },
      "npm:sntp@1.0.9": {
        "map": {
          "hoek": "npm:hoek@2.16.3"
        }
      },
      "npm:boom@2.10.1": {
        "map": {
          "hoek": "npm:hoek@2.16.3"
        }
      },
      "npm:verror@1.3.6": {
        "map": {
          "extsprintf": "npm:extsprintf@1.0.2"
        }
      },
      "npm:getpass@0.1.6": {
        "map": {
          "assert-plus": "npm:assert-plus@1.0.0"
        }
      },
      "npm:ecc-jsbn@0.1.1": {
        "map": {
          "jsbn": "npm:jsbn@0.1.0"
        }
      },
      "npm:jodid25519@1.0.2": {
        "map": {
          "jsbn": "npm:jsbn@0.1.0"
        }
      },
      "npm:bcrypt-pbkdf@1.0.0": {
        "map": {
          "tweetnacl": "npm:tweetnacl@0.14.3"
        }
      },
      "npm:dashdash@1.14.0": {
        "map": {
          "assert-plus": "npm:assert-plus@1.0.0"
        }
      },
      "github:jspm/nodelibs-zlib@0.2.0-alpha": {
        "map": {
          "zlib-browserify": "npm:browserify-zlib@0.1.4"
        }
      },
      "github:jspm/nodelibs-domain@0.2.0-alpha": {
        "map": {
          "domain-browserify": "npm:domain-browser@1.1.7"
        }
      }
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
  },
  map: {
    "plugin-babel": "npm:systemjs-plugin-babel@0.0.14"
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
    "events": "github:jspm/nodelibs-events@0.2.0-alpha",
    "path": "github:jspm/nodelibs-path@0.2.0-alpha",
    "process": "github:jspm/nodelibs-process@0.2.0-alpha"
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
    "npm:es6-set@0.1.4": {
      "map": {
        "d": "npm:d@0.1.1",
        "es5-ext": "npm:es5-ext@0.10.12",
        "es6-iterator": "npm:es6-iterator@2.0.0",
        "es6-symbol": "npm:es6-symbol@3.1.0",
        "event-emitter": "npm:event-emitter@0.3.4"
      }
    },
    "npm:es6-symbol@3.1.0": {
      "map": {
        "d": "npm:d@0.1.1",
        "es5-ext": "npm:es5-ext@0.10.12"
      }
    },
    "npm:event-emitter@0.3.4": {
      "map": {
        "es5-ext": "npm:es5-ext@0.10.12",
        "d": "npm:d@0.1.1"
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
