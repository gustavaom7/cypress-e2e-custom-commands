// cypress-image-diff-js settings (loaded from the project root by the plugin).
// Set VISUAL_UPDATE=1 to (re)generate missing baselines instead of failing.
module.exports = {
  ROOT_DIR: 'cypress/visual',
  FAILURE_THRESHOLD: 0.01,
  FAIL_ON_MISSING_BASELINE: !process.env.VISUAL_UPDATE,
  CYPRESS_SCREENSHOT_OPTIONS: { capture: 'viewport' },
};
