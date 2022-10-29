# Simple Deno Website Boilerplate

[![](https://github.com/BrunoBernardino/deno-boilerplate-simple-website/workflows/Run%20Tests/badge.svg)](https://github.com/BrunoBernardino/deno-boilerplate-simple-website/actions?workflow=Run+Tests)

This is a simple website boilerplate built using [Deno](https://deno.land) and deployed using [Deno Deploy](https://deno.com/deploy).

Demo at [simple-deno-website-boilerplate.onbrn.com](https://simple-deno-website-boilerplate.onbrn.com).

## Framework-less

This right here is vanilla TypeScript and JavaScript. It's very easy to update and maintain.

It's meant to have no extra dependencies, builders, packagers, bundlers, or pre/post-processors. Just vanilla stuff.

It does include some examples for building complex apps, like:

1. No JS form submission in `/form`
2. Dynamic client-side updates in `/dynamic` with vanilla JS
3. Hydration in `/ssr` (when some JS is dynamically created to update the client state once it's finished the initial load) with vanilla JS
4. Using Just-In-Time-transpiled-TypeScript (inspired by [ts-serve](https://github.com/ayame113/ts-serve)) [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) for dynamic client-side updates in `/web-component`

You can build pretty complex and complicated things without frameworks or loads of dependencies, but if you need a framework, I'd suggest you try [fresh](https://fresh.deno.dev/), [Snel](https://crewdevio.mod.land/projects/Snel), or [Aleph](https://github.com/alephjs/aleph.js) to still be able to enjoy a lot of Deno. They're pretty nice.

## Requirements

This was tested with `deno`'s version stated in the `.dvmrc` file, though it's possible older versions might work.

There are no other dependencies. **Deno**!

## Development

```sh
$ make start
$ make format
$ make test
```

## Structure

- Backend routes are defined at `routes.ts`.
- Static files are defined at `public/`.
- Pages are defined at `pages/`.

Everything else can be structured differently.

## Deployment

- Deno Deploy: Just push to the `main` branch. Any other branch will create a preview deployment.

## TODOs

Here are some things you will likely want to change before "publishing" this, or after cloning it:

- [ ] `baseUrl`, `defaultTitle`, `defaultDescription`, and the analytics code in `recordPageView`, and `content-security-policy` in `lib/utils.ts`
- [ ] Title, description, and links in this `README.md` file
- [ ] `robots.txt` and `sitemap.xml` files
