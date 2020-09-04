<h1 align="center">Jellyfin API Client for JavaScript</h1>
<h3 align="center">Part of the <a href="https://jellyfin.media">Jellyfin Project</a></h3>

---

<p align="center">
<img alt="Logo Banner" src="https://raw.githubusercontent.com/jellyfin/jellyfin-ux/master/branding/SVG/banner-logo-solid.svg?sanitize=true"/>
<br/>
<br/>
<a href="https://github.com/jellyfin/jellyfin-apiclient-javascript">
<img alt="MIT License" src="https://img.shields.io/github/license/jellyfin/jellyfin-apiclient-javascript.svg"/>
</a>
<a href="https://opencollective.com/jellyfin">
<img alt="Donate" src="https://img.shields.io/opencollective/all/jellyfin.svg?label=backers"/>
</a>
<a href="https://features.jellyfin.org">
<img alt="Feature Requests" src="https://img.shields.io/badge/fider-vote%20on%20features-success.svg"/>
</a>
<a href="https://forum.jellyfin.org">
<img alt="Discuss on our Forum" src="https://img.shields.io/discourse/https/forum.jellyfin.org/users.svg"/>
</a>
<a href="https://matrix.to/#/+jellyfin:matrix.org">
<img alt="Chat on Matrix" src="https://img.shields.io/matrix/jellyfin:matrix.org.svg?logo=matrix"/>
</a>
<a href="https://www.reddit.com/r/jellyfin">
<img alt="Join our Subreddit" src="https://img.shields.io/badge/reddit-r%2Fjellyfin-%23FF5700.svg"/>
</a>
</p>

This library is meant to help clients written in JavaScript or TypeScript interact with Jellyfin's REST API.

## Compatibility

This library depends on the Fetch and Promise APIs. These will be expected to be polyfilled if used in a browser that doesn't support them.

## Build Process

### Dependencies

- Yarn

### Getting Started

1. Clone or download this repository

    ```sh
    git clone https://github.com/jellyfin/jellyfin-apiclient-javascript.git
    cd jellyfin-apiclient-javascript
    ```

2. Install build dependencies in the project directory

    ```sh
    yarn install
    ```

3. Build the library for production

    ```sh
    yarn build
    ```

4. Build the library for development

    ```sh
    yarn dev
    ```

## Building Documentation

This library is documented using [JSDoc](https://jsdoc.app/) style comments. Documentation can be generated in HTML format by running `yarn docs` and viewing the files in any modern browser. The resulting documentation will be saved in the `docs` directory.
