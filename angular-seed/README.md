## AngularJS Seed using Material (ES6)


### Purpose

This project uses the latest master branch of AngularJS Material to build the application


This Starter app demonstrates how:

*  AngularJS Material `layout` and `flex` options can easily configure HTML containers
*  AngularJS Material components `<md-toolbar>`, `<md-sidenav>`, and `<md-icon>` can quickly provide
   a base application structure
*  Custom controllers can be used and show `<md-bottomsheet>` with HTML templates
*  Custom controller can easily, and programmatically open/close the SideNav component
*  Responsive breakpoints and `$mdMedia` are used
*  Theming can be altered/configured using `$mdThemingProvider`


This sample application is purposed as both a learning tool and a skeleton application for a typical
[AngularJS Material](http://angularjs.org/) web app, comprised of a side navigation area and a
content area. You can use it to quickly bootstrap your angular webapp projects and dev environment
for these projects.


### "How to build an App"

Here are some generalized steps that may be used to conceptualize the application implementation
process:

1. Plan your layout and the components you want to use

2. Use hard-coded HTML and mock content to make sure the components appear as desired

3. Wire components to your application logic

   > Use the seamless integration possible with AngularJS directives and controllers.<br/>
   > This integration assumes that you have unit tested your application logic.

4. Add Responsive breakpoints

5. Add Theming support

6. Confirm ARIA compliance

7. Write End-to-end (e2e) Tests

   > It is important to validate your application logic with AngularJS Material UI components.


### Prerequisites

This project assumes that you have NodeJS and any relevant development tools (like XCode) already
installed.


### Getting Started

This project uses [jspm.io](http://jspm.io), a package manager for SystemJS which is built on top
of the dynamic ES6 module loader. This allows developers to load any module format (ES6, CommonJS,
AMD, and globals).


Clone this repository and execute the following commands in a terminal:

* `git checkout master`
* `npm install`
* `npm run serve`

> **Note:** Open the dev console to see any warnings and browse the elements.

### Layout

You will notice a few files/directories within this project:

 1. `app/src` - This is where all of your application files are stored.
 2. `app/assets` - This folder contains some tutorial-provided images and icons which are used by
    the application.
 3. `index.html` - The entry point to your application. This uses System.js to load the
    `app/src/boot/boot.js` bootstrap file which in turn loads the `app/src/app.js` file that imports
     all of your dependencies and declares them as AngularJS modules, and configures the icons and
     theming for the application.

### Troubleshooting

If you have issues getting the application to run or work as expected:

1. Make sure you have installed JSPM and run the `jspm update` command.
2. Reach out on our [Forum](https://groups.google.com/forum/#!forum/ngmaterial) to see if any other
   developers have had the same issue.
3. This project is based against the `master` branch of AngularJS Material, so it is always showing
   the latest and greatest. You may want to update the `package.json` to use Version 1.1.0 or
   another stable release to make sure it isn't because of something we changed recently.
4. Search for the issue here on [GitHub](https://github.com/angular/material-start/issues?q=is%3Aissue+is%3Aopen).
5. If you don't see an existing issue, please open a new one with the relevant information and the
   details of the problem you are facing.
