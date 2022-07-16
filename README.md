# Simple Deno Website Boilerplate

[![](https://github.com/BrunoBernardino/deno-boilerplate-simple-website/workflows/Run%20Tests/badge.svg)](https://github.com/BrunoBernardino/deno-boilerplate-simple-website/actions?workflow=Run+Tests)

This is a simple website boilerplate built using [Deno](https://deno.land) and deployed using [Deno Deploy](https://deno.com/deploy).

Demo at [simple-deno-website-boilerplate.onbrn.com](https://simple-deno-website-boilerplate.onbrn.com).

## Framework-less

This right here is vanilla. It's very easy to update and maintain.

It's meant to have no extra dependencies, builders, packagers, bundlers, or pre/post-processors. Just vanilla stuff.

You can build pretty complex and complicated things without frameworks or loads of dependencies, but if you need a framework, I'd suggest you try [fresh](https://fresh.deno.dev/), [Snel](https://crewdevio.mod.land/projects/Snel), or [Aleph](https://github.com/alephjs/aleph.js) to still be able to enjoy a lot of Deno. They're pretty nice.

## Requirements

This was tested with `deno@1.22.0`, though it's possible older versions might work.

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

Everything else can be structured differently.

## Deployment

- Deno Deploy: Just push to the `main` branch. Any other branch will create a preview deployment.

## TODOs

Here are some things you will likely want to change before "publishing" this, or after cloning it:

- [ ] `baseUrl`, `defaultTitle`, `defaultDescription`, and the analytics code in `recordPageView`, and `content-security-policy` in `lib/utils.ts`
- [ ] Title, description, and links in this `README.md` file
- [ ] `robots.txt` and `sitemap.xml` files
