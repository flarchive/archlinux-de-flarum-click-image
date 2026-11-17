import bootstrapForum from '@flarum/jest-config/src/bootstrap/forum';
import app from 'flarum/forum/app';

beforeAll(async () => {
  bootstrapForum();
  // Use the DOM created by Flarum's test setup.
  globalThis.HTMLElement = window.HTMLElement;
  const { default: ClickImage } = await import('../../src/forum/ClickImage');
  window.customElements.define('click-img', ClickImage);
});

beforeEach(() => {
  app.translator.addTranslations({
    'archlinux-de-flarum-click-image.forum.load_button': 'Load image from {domain}',
    'archlinux-de-flarum-click-image.forum.error_message': 'Could not load image from {domain}',
  });
});

afterEach(() => {
  document.body.replaceChildren();
});

function createImage(source = 'https://images.example/photo.png') {
  const image = document.createElement('click-img');
  image.setAttribute('src', source);
  document.body.append(image);
  return image;
}

test('shows the translated placeholder without loading an image', () => {
  const image = createImage();

  expect(image.shadowRoot.querySelector('.placeholder-message').textContent).toBe('Load image from images.example');
  expect(image.shadowRoot.querySelector('img')).toBeNull();
  expect(document.querySelector('img')).toBeNull();
});

test('handles missing translation keys', () => {
  delete app.translator.translations['archlinux-de-flarum-click-image.forum.load_button'];
  delete app.translator.translations['archlinux-de-flarum-click-image.forum.error_message'];
  const image = createImage();

  expect(image.shadowRoot.querySelector('.placeholder-message').textContent).toBe('archlinux-de-flarum-click-image.forum.load_button');
});

test('renders a malformed source as text in the error placeholder', () => {
  const source = '<img src=x onerror=alert(1)>';
  const image = createImage(source);

  expect(image.shadowRoot.querySelector('img')).toBeNull();
  expect(image.shadowRoot.querySelector('.error-message').textContent).toBe(`Could not load image from ${source}`);
});
