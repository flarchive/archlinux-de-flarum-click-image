import app from 'flarum/forum/app';

export default class ClickImage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(this._createStyle());
    try {
      const src = this.getAttribute('src');
      const hostname = src.startsWith('/') ? window.location.hostname : new URL(src).hostname;
      const placeHolder = this._createPlaceholder(hostname);

      placeHolder.addEventListener(
        'click',
        (event) => {
          placeHolder.classList.add('loading');
          event.preventDefault();
          const img = this._createImg();
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
      const placeHolder = this._createPlaceholder(this.getAttribute('src'));
      placeHolder.classList.add('error');
      this.shadowRoot.appendChild(placeHolder);
    }
  }

  _createPlaceholder(hostname) {
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

  _createStyle() {
    const style = document.createElement('style');
    style.innerHTML = `
        :host {
          --background-color: #ccc;
          --border-color: #ddd;
          --color: #333;
          --error-color: #f00;
        }
        div {
          padding: 8px;
          box-sizing: border-box;
          border: 1px solid var(--border-color);
          height: 150px;
          width: 100%;
          max-width: 100%;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          background-color: var(--background-color);
          cursor: pointer;
          transition: width .2s ease-in-out, height .2s ease-in-out;
        }
        span {
          font-family: sans-serif;
          font-size: 14px;
          color: var(--color);
        }
        a {
          color: unset;
        }
        .error-message {
          display: none;
        }
        .error .placeholder-message {
          display: none;
        }
        .error .error-message {
          display: inline-block;
        }
        .loading {
          cursor: wait;
        }
        .loading span {
          display: none;
        }
        .loading::before {
          content: ' '
        }
        .error {
          cursor: unset;
        }
        .error span {
          color: var(--error-color);
        }
      `;

    return style;
  }

  _createImg() {
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
