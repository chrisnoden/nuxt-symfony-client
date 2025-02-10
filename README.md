# Introduction

This repo is part of a client/server project. The client (front-end) is served using
[Nuxt v3](https://nuxt.com) and the server (back-end) serves RESTful JSON API
using [Symfony 7.2](https://symfony.com) built on [PHP 8.3](https://php.net)

- [Front-End Client Repository](https://github.com/chrisnoden/nuxt-symfony-client)
- [Back-End Server Repository](https://github.com/chrisnoden/nuxt-symfony-server)

The intention is that the back-end server is deployed behind a firewall and is only
accessible by the front-end (Nuxt) server. The BFF (back-end for front-end) pattern
is used in the front-end.

Thus, this Nuxt project provides `server/api` code that, in effect, 
proxies the communications between the front-end and the back-end.

Key cookies for the Symfony Security bundle are automatically passed
to the back-end. CSRF is injected into nearly all the api routes.

> This nuxt implementation uses the 
> [v4 compatability mode](https://nuxt.com/docs/api/nuxt-config#compatibilityversion).

# NB

I use a Mac (with Apple Silicon) so all my bash commands are tested 
on the Mac terminal.

## Dev Setup

Make sure to create a .env file and install the dependencies:
```bash
cp .env.example .env
yarn install
```

> You should edit the .env file to suit your environment

Install a local certificate for SSL browsing:
```bash
brew install mkcert
mkcert fe.nss.wip
mkcert -install
```

> You will need to edit your etc/hosts file (on MacOs this is `sudo vi /etc/hosts`)
> add the line `127.0.0.1 fe.nss.wip`
> 

Start the development server and open a browser tab to it:
```bash
yarn dev -o
```

# Good To Know Stuff

There are a number of tools/libraries/frameworks that I love and have used
some of them in this project:

- [TailwindCSS](https://tailwindcss.com/)
- [HeadlessUI](https://headlessui.com/v1/vue)
- ~[PrimeVue](https://primevue.org/) - principally for the DataTable~
- [ShadCN for Nuxt](https://nuxt.com/modules/shadcn) - I have switched to ShadCN instead of PrimeVue

I also try very hard to do "TypeScript" (but can't promise I'm good at it)
and I use the [composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
for the vue components.

