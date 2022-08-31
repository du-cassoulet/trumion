const Babel = require("@babel/standalone");
const BlacklistedIdentifiers = require("../constants/BlacklistedIdentifiers");
const MaskedGlobals = require("../constants/MaskedGlobals");

const MAX_SOURCE_ITERATIONS = 100000;

class Code {
  /**
   * @param {string} code 
   */
  constructor(code) {
    this.code = code;
  }

  #preventInfiniteLoops({ types: t, template }) {
    const buildGuard = template(`if(ITERATOR++>MAX_ITERATIONS){throw new RangeError('Potential infinite loop: exceeded '+MAX_ITERATIONS+' iterations.');}`);

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
            const statement = path.get("body").node;
            path.get("body").replaceWith(t.blockStatement([guard, statement]));
          } else {
            path.get("body").unshiftContainer("body", guard);
          }
        }
      }
    }
  }

  #preventGlobalVars() {
    return {
      visitor: {
        "Identifier": (path) => {
          const Require = "require";

          if (path.scope.globals[path.node.name]) {
            for (const blacklisted of BlacklistedIdentifiers) {
              if (blacklisted === path.node.name) {
                throw new Error(`The global identifier '${blacklisted}' was blacklisted.`);
              }
            }
  
            if (path.node.name === Require) {
              throw new Error("You can't use 'require' here, use module() instead.");
            }
          }
        }
      }
    }
  }

  #changeRootUsedVars() {
    return {
      visitor: {
        "Identifier": (path) => {
          let nodeQual = 2;

          if (MaskedGlobals.includes(path.node.name) && path.scope.globals[path.node.name]) {
            while (
              path.scope.globals[path.node.name + nodeQual.toString()] ||
              path.scope.bindings[path.node.name + nodeQual.toString()] ||
              path.scope.references[path.node.name + nodeQual.toString()]
            ) nodeQual++;
            path.node.name = path.node.name + nodeQual.toString();
          }
        }
      }
    }
  }

  parse() {
    Babel.availablePlugins.changeRootUsedVars = this.#changeRootUsedVars;
    Babel.availablePlugins.preventGlobalVars = this.#preventGlobalVars;
    Babel.availablePlugins.preventInfiniteLoops = this.#preventInfiniteLoops;

    const output = Babel.transform(this.code, {
      presets: ["env"],
      plugins: [
        "changeRootUsedVars",
        "preventGlobalVars",
        "preventInfiniteLoops"
      ]
    });

    console.log(output.code);

    return output.code;
  }
}

module.exports = Code;