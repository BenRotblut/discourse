import {
  registerHelpers,
  createHelperContext,
} from "discourse-common/lib/helpers";
import RawHandlebars from "discourse-common/lib/raw-handlebars";
import { registerRawHelpers } from "discourse-common/lib/raw-handlebars-helpers";
import Handlebars from "handlebars";
import { setOwner } from "@ember/application";

export function autoLoadModules(container, registry) {
  Object.keys(requirejs.entries).forEach((entry) => {
    if (/\/helpers\//.test(entry) && !/-test/.test(entry)) {
      requirejs(entry, null, null, true);
    }
    if (/\/widgets\//.test(entry) && !/-test/.test(entry)) {
      requirejs(entry, null, null, true);
    }
  });

  let context = {
    siteSettings: container.lookup("site-settings:main"),
    themeSettings: container.lookup("service:theme-settings"),
    keyValueStore: container.lookup("key-value-store:main"),
    capabilities: container.lookup("capabilities:main"),
    currentUser: container.lookup("current-user:main"),
    site: container.lookup("site:main"),
    session: container.lookup("session:main"),
    topicTrackingState: container.lookup("topic-tracking-state:main"),
  };
  setOwner(context, container);

  createHelperContext(context);
  registerHelpers(registry);
  registerRawHelpers(RawHandlebars, Handlebars);
}

export default {
  name: "auto-load-modules",
  initialize: autoLoadModules,
};
