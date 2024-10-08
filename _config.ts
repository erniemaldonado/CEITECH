import lume from "lume/mod.ts";
import date from "lume/plugins/date.ts";
import metas from "lume/plugins/metas.ts";
import unocss from "lume/plugins/unocss.ts";
import { env } from "lume/core/utils/env.ts";
import favicon from "lume/plugins/favicon.ts";
import basePath from "lume/plugins/base_path.ts";
import { alert } from "npm:@mdit/plugin-alert@0.12.0";
import filterPages from "lume/plugins/filter_pages.ts";
import lightningcss from "lume/plugins/lightningcss.ts";
import icons from "https://deno.land/x/lume_icon_plugins@v0.2.1/phosphor.ts";

const site = lume();

let id = 0;

site
  .use(date())
  .copy("files")
  .copy("scripts")
  .use(lightningcss())
  .use(unocss({ cssFile: "styles/unocss.css" }))
  .use(basePath())
  .use(metas())
  .data("counter", () => id++)
  .use(
    icons({
      name: "icon",
      defaultType: "duotone",
    })
  )
  .use(
    favicon({
      input: "files/favicon.svg",
    })
  )
  .remoteFile(
    "_includes/styles/reset.css",
    "https://cdn.jsdelivr.net/npm/modern-normalize@2.0.0/modern-normalize.css"
  );

// In CMS mode, show all pages, but ensure the URL is prefixed with the state
if (env("LUME_CMS") === true) {
  site.process([".html"], (pages) => {
    for (const page of pages) {
      if (page.data.only_state && page.data.only_state !== page.data.state) {
        page.data.url = `/${page.data.state}${page.data.url}`;
      }
    }
  });
} else {
  // In production mode, show only pages that match the current state
  site.use(
    filterPages({
      fn: (page) => !page.data.only_state || page.data.only_state === page.data.state,
    })
  );
}

// Alert plugin
site.hooks.addMarkdownItPlugin(alert);

export default site;
