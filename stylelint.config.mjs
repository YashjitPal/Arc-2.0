/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard"],
  rules: {
    // Allow Mozilla's special queries
    "media-query-no-invalid": [true, { ignoreFunctions: ["-moz-pref"] }],
    "at-rule-no-vendor-prefix": [true, { ignoreAtRules: ["-moz-document"] }],

    // Allow improper cases for selectors as we don't have control of it
    "selector-id-pattern": null,
    "selector-class-pattern": null,
    "custom-property-pattern": null,

    // CSS is typically organized into sections for cleanliness, obeying this could result in confusion
    "no-duplicate-selectors": null,

    // Prettier should handle empty lines before comments and at-rules, not Stylelint
    "comment-empty-line-before": null,
    "at-rule-empty-line-before": null,

    // Allow custom Mozilla DOM elements
    "selector-type-no-unknown": [
      true,
      {
        ignoreTypes: [
          "tab",
          "tab-group",
          "zen-folder",
          "toolbarbutton",
          "browser",
          "groupbox",
          "vbox",
          "hbox",
          "findbar",
          "scrollbox",
          "window",
          "toolbaritem",
          "stack",
          "menupopup",
          "panel",
          "tooltip",
          "tab-group-tab",
          "tabpanels",
        ],
      },
    ],

    // Tampers highly with organization
    "no-descending-specificity": null,

    // tmp
    "color-function-alias-notation": null,
    "color-function-notation": null,
    "alpha-value-notation": null,

    /* "no-descending-specificity": null,
    "declaration-property-value-no-unknown": [
      true,
      {
        ignoreProperties: {
          "max-width": ["auto", "/fr$/"],
        },
      },
    ], */
  },
};
