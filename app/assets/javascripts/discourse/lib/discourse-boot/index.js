"use strict";

module.exports = {
  name: require("./package").name,

  included() {
    this.app.options.autoRun = false;
  },

  contentFor(type, config) {
    if (type === "discourse-boot") {
      let appJSON = JSON.stringify(config.APP || {});
      return `
        <script>
          (function() {
            fetch("/bootstrap.json").then(res => res.json()).then(data => {
              let appJSON = ${appJSON};
              appJSON.bootstrap = data.bootstrap;

              let locale = data.bootstrap.locale_script;

              let head = document.getElementsByTagName('head')[0];
              (data.bootstrap.stylesheets || []).forEach(s => {
                let link = document.createElement('link');
                link.setAttribute('rel', 'stylesheet');
                link.setAttribute('type', 'text/css');
                link.setAttribute('href', s.href);
                if (s.media) {
                  link.setAttribute('media', s.media);
                }
                if (s.target) {
                  link.setAttribute('data-target', s.target);
                }
                if (s.theme_id) {
                  link.setAttribute('data-theme-id', s.theme_id);
                }
                head.append(link);
              });

              return new Promise((resolve, reject) => {
                let script = document.createElement('script');
                script.onload = () => {
                  define("I18n", ['exports'], function(exports) { return I18n; });
                  window.__widget_helpers = require('discourse-widget-hbs/helpers').default;
                  const app = require("${config.modulePrefix}/app")["default"].create(appJSON);
                  app.start();
                  resolve();
                }
                script.src = locale;
                head.appendChild(script);
              });
            });
          })();
        </script>
      `;
    }
  },
};
