import app from 'flarum/forum/app';
import styles from '!!raw-loader!./ClickImage.css';

export default class ClickImage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(this.#createStyle());
    try {
      const src = this.getAttribute('src');
      const hostname = src.startsWith('/') ? window.location.hostname : new URL(src).hostname;
      const placeHolder = this.#createPlaceholder(hostname);

      placeHolder.addEventListener(
        'click',
        (event) => {
          placeHolder.classList.add('loading');
          event.preventDefault();
          const img = this.#createImg();
          img.onerror = () => {
            placeHolder.classList.remove('loading');
            placeHolder.classList.add('error');
          };
          img.onload = () => {
            placeHolder.style.width = `min(${img.width}px, 100%)`;
            placeHolder.style.height = 'auto';
            placeHolder.style.aspectRatio = `${img.width} / ${img.height}`;
            setTimeout(() => this.replaceWith(img), 200);
          };
        },
        { once: true }
      );
      this.shadowRoot.appendChild(placeHolder);
    } catch (e) {
      const placeHolder = this.#createPlaceholder(this.getAttribute('src'));
      placeHolder.classList.add('error');
      this.shadowRoot.appendChild(placeHolder);
    }
  }

  #createPlaceholder(hostname) {
    const div = document.createElement('div');
    div.innerHTML = `
        <span class="placeholder-message">${app.translator
          .trans('archlinux-de-flarum-click-image.forum.load_button', { domain: hostname })
          .join('')}</span>
        <span class="error-message">${app.translator
          .trans('archlinux-de-flarum-click-image.forum.error_message', { domain: hostname })
          .join('')}</span>
      `;
    return div;
  }

  #createStyle() {
    const style = document.createElement('style');
    style.innerHTML = styles;

    return style;
  }

  #createImg() {
    const img = document.createElement('img');
    if (this.getAttribute('height') > 0) {
      img.height = this.getAttribute('height');
    }
    if (this.getAttribute('width') > 0) {
      img.height = this.getAttribute('width');
    }
    if (this.getAttribute('alt').length > 0) {
      img.alt = this.getAttribute('alt');
    }
    if (this.getAttribute('title').length > 0) {
      img.title = this.getAttribute('title');
    }
    img.src = this.getAttribute('src');
    return img;
  }
}
