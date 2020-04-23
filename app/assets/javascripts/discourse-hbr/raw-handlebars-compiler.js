"use strict";

const Filter = require("broccoli-filter");
const Handlebars = require("handlebars");

function TemplateCompiler(inputTree, options) {
  if (!(this instanceof TemplateCompiler)) {
    return new TemplateCompiler(inputTree, options);
  }

  Filter.call(this, inputTree, options); // this._super()

  this.options = options || {};
  this.inputTree = inputTree;
}

TemplateCompiler.prototype = Object.create(Filter.prototype);
TemplateCompiler.prototype.constructor = TemplateCompiler;
TemplateCompiler.prototype.extensions = ["hbr"];
TemplateCompiler.prototype.targetExtension = "js";

TemplateCompiler.prototype.registerPlugins = function registerPlugins() {};

TemplateCompiler.prototype.initializeFeatures = function initializeFeatures() {};

TemplateCompiler.prototype.processString = function(string, relativePath) {
  let filename = relativePath.replace(/^templates\//, "").replace(/\.hbr$/, "");

  return (
    'import Handlebars from "discourse-common/lib/raw-handlebars";\n' +
    'import { addRawTemplate } from "discourse-common/lib/raw-templates";\n\n' +
    "let template = Handlebars.template(" +
    this.precompile(string, false) +
    ");\n\n" +
    'addRawTemplate("' +
    filename +
    '", template);\n' +
    "export default template;"
  );
};

TemplateCompiler.prototype.precompile = function(value, asObject) {
  var ast = Handlebars.parse(value);

  var options = {};

  asObject = asObject === undefined ? true : asObject;

  var environment = new Handlebars.Compiler().compile(ast, options);
  let result = new Handlebars.JavaScriptCompiler().compile(
    environment,
    options,
    undefined,
    asObject
  );
  return result;
};

module.exports = TemplateCompiler;
