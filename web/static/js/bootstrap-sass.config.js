// Example file. Copy this to your project. Change then names of the referenced files or comment
// them out. Convention is to name sass partials to start with an '_'
module.exports = {
  verbose: true, // Set to true to show diagnostic information

  // IMPORTANT: Set next two configuration so you can customize
  // bootstrapCustomizations: gets loaded before bootstrap so you can configure the variables used
  // by bootstrap mainSass: gets loaded after bootstrap, so you can override a bootstrap style.
  // NOTE, these are optional.

  // Use preBootstrapCustomizations to change $brand-primary. Ensure this
  // preBootstrapCustomizations does not depend on other bootstrap variables.
  // preBootstrapCustomizations: './_pre-bootstrap-customizations.scss',

  // Use bootstrapCustomizations to utilize other sass variables defined in
  // preBootstrapCustomizations or the _variables.scss file. This is useful to set one
  // customization value based on another value.
  // bootstrapCustomizations: './_bootstrap-customizations.scss',

  // mainSass: './_main.scss',

  // Default for the style loading
  styleLoader: 'style-loader!css-loader!sass-loader',
  //
  // If you want to use the ExtractTextPlugin
  //   and you want compressed
  //     styleLoader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader'),
  //
  // If you want expanded CSS
  //   styleLoader: ExtractTextPlugin.extract('style-loader',
  // 'css-loader!sass?outputStyle=expanded'),

  scripts: {
    transition: true,
    alert: true,
    button: true,
    carousel: true,
    collapse: true,
    dropdown: true,
    modal: true,
    tooltip: true,
    popover: true,
    scrollspy: true,
    tab: true,
    affix: true
  },
  styles: {
    mixins: true,

    normalize: true,
    print: true,
    glyphicons: true,

    scaffolding: true,
    type: true,
    code: true,
    grid: true,
    tables: true,
    forms: true,
    buttons: true,

    'component-animations': true,
    dropdowns: true,
    'button-groups': true,
    'input-groups': true,
    navs: true,
    navbar: true,
    breadcrumbs: true,
    pagination: true,
    pager: true,
    labels: true,
    badges: true,
    jumbotron: true,
    thumbnails: true,
    alerts: true,
    'progress-bars': true,
    media: true,
    'list-group': true,
    panels: true,
    wells: true,
    'responsive-embed': true,
    close: true,

    modals: true,
    tooltip: true,
    popovers: true,
    carousel: true,

    utilities: true,
    'responsive-utilities': true
  }
};
