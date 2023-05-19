# Click-Image

A [Flarum](http://flarum.org) extension. Load images on click.

When this extension is enabled, all user provided images within the ``[IMG]...[/IMG]`` code tag will be replaced by a
placeholder. The actual image is only loaded when that placeholder is clicked. This ensures that no third party content
is loaded without user permissions.

## Installation

Install with composer:

```sh
composer require archlinux-de/click-image:"*"
```

## Updating

```sh
composer update archlinux-de/click-image:"*"
php flarum cache:clear
```

## Links

- [Packagist](https://packagist.org/packages/archlinux-de/flarum-click-image)
- [GitHub](https://github.com/archlinux-de/flarum-click-image)
