<p align="center"><strong>Digest Delivery</strong></p>
<p align="center"><em>Get your feeds, articles and newsletters delivered to your Kindle.</em></p>
<p align="center">
  <a href="https://github.com/samtgarson/digest-delivery/actions/workflows/deliver.yml">
    <img alt="delivery status"
      src="https://github.com/samtgarson/digest-delivery/actions/workflows/deliver.yml/badge.svg" />
  </a>
  <a href="https://github.com/samtgarson/digest-delivery/actions/workflows/build.yml">
    <img alt="build status" src="https://github.com/samtgarson/digest-delivery/actions/workflows/build.yml/badge.svg" />
  </a>
</p>

Send Digest Delivery your newsletters, articles, blogs and read-laters, and it will compile them beautifully into a real
Ebook (.mobi) and send it to your Kindle at a frequency you chose—so you can get the reading experience you want without
the distractions.

## How it works

Digest Delivery provides you with a unique key which you can use to send articles to your digest, as well as a Zapier
integration to allow you to integrate most RSS or Read Later services.

The app is split into 3 parts:

#### Next.js app (`/src`)

This houses the marketing site and dashboard, allowing logged in users to manage their accounts and view their past and
upcoming digests, as well as an API for Zapier to interact with to save articles to an upcoming digest.

#### Delivery Worker (`/delivery`)

This is a script which runs periodically on a Github Action, responsible for compiling articles into ebooks, generating
book covers, and sending them to Kindles. It is run in a Docker container.

#### Common (`/common`)

Common utilities and classes used by both the other two parts.
