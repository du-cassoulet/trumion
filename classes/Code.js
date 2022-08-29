const Babel = require("@babel/standalone");

const MAX_SOURCE_ITERATIONS = 10000;

class Code {
  /**
   * @param {string} code 
   */
  constructor(code) {
    this.code = code;
  }

  #preventInfiniteLoops({ types: t, template }) {
    const buildGuard = template(`if(ITERATOR++>MAX_ITERATIONS){throw new RangeError('Potential infinite loop: exceeded '+MAX_ITERATIONS +' iterations.');}`);

    return {
      visitor: {
        "WhileStatement|ForStatement|DoWhileStatement": (path) => {
          const iterator = path.scope.parent.generateUidIdentifier("loopIt");
          const iteratorInit = t.numericLiteral(0);
          path.scope.parent.push({
            id: iterator,
            init: iteratorInit,
          });

          const guard = buildGuard({
            ITERATOR: iterator,
            MAX_ITERATIONS: t.numericLiteral(MAX_SOURCE_ITERATIONS),
          });

          if (!path.get("body").isBlockStatement()) {
            const statement = path.get("body").node
            path.get("body").replaceWith(t.blockStatement([guard, statement]));
          } else {
            path.get("body").unshiftContainer("body", guard);
          }
        },
      },
    }
  }

  #preventGlobalVars() {
    return {
      visitor: {
        "Identifier": (path) => {
          const BlacklistedIdentifiers = [
            "global",
            "globalThis",
            "process",
            "console"
          ]

          const Require = "require";

          if (BlacklistedIdentifiers.includes(path.node.name)) {
            throw new Error("Unexpected identifier");
          }

          if (path.node.name === Require) {
            throw new Error("You can't use this built-in function here, use module() instead.");
          }
        }
      }
    }
  }

  parse() {
    Babel.availablePlugins["preventInfiniteLoops"] = this.#preventInfiniteLoops;
    Babel.availablePlugins["preventGlobalVars"] = this.#preventGlobalVars;

    const output = Babel.transform(this.code, {
      presets: ["env"],
      plugins: [
        "preventInfiniteLoops",
        "preventGlobalVars"
      ]
    });

    return output.code;
  }
}

module.exports = Code;