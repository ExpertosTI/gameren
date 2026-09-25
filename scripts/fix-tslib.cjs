const Module = require("module");
const orig = Module._load;
Module._load = function (request, parent, isMain) {
  const exp = orig.apply(this, arguments);
  if (request === "tslib" && exp && typeof exp.__importDefault !== "function") {
    exp.__importDefault = (mod) => (mod && mod.__esModule ? mod : { default: mod });
    exp.__importStar = (mod) => {
      if (mod && mod.__esModule) return mod;
      const copy = {};
      if (mod) {
        for (const key of Object.keys(mod)) copy[key] = mod[key];
      }
      copy.default = mod;
      return copy;
    };
  }
  return exp;
};
