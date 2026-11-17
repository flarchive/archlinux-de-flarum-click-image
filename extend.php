<?php

/*
 * This file is part of archlinux-de/click-image.
 *
 * Copyright (c) 2022 Pierre Schmitz.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace ArchLinux\ClickImage;

use Flarum\Extend;
use s9e\TextFormatter\Configurator;
use s9e\TextFormatter\Configurator\Items\Tag;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less'),

    new Extend\Locales(__DIR__ . '/locale'),

    (new Extend\Formatter())
        ->configure(function (Configurator $config) {
            // Override img tag
            // https://github.com/s9e/TextFormatter/blob/master/src/Plugins/BBCodes/Configurator/repository.xml#L216-L221
            /** @var Tag $imgTag */
            $imgTag = $config->tags['IMG'];
            $imgTag->setTemplate(
                '<click-img src="{@src}" title="{@title}" alt="{@alt}">'
                . '<xsl:copy-of select="@height"/><xsl:copy-of select="@width"/>'
                . '</click-img>'
            );
        }),
];
