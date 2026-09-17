# Fonts served from this directory

Nuxt serves `public/` at the site root, so a file here at
`public/fonts/NAME.woff2` is fetched as `/fonts/NAME.woff2`.

## Kh Baphnom SatraSlekrith

Used for the two names in the envelope monogram (សុវណ្ណថៃ / សុហេង).
Declared in `app/assets/main.scss`; applied in `app/components/EnvelopeOpen.vue`
on `.mono-km`.

Drop the font in as **either** of these names — the `@font-face` lists both,
and the browser takes the first one it can load:

    public/fonts/KhBaphnom-SatraSlekrith.woff2   (preferred — smallest)
    public/fonts/KhBaphnom-SatraSlekrith.ttf     (works as-is)

No code change is needed once the file is here.

To convert a `.ttf` to `.woff2` (roughly 40% of the size):

    npx ttf2woff2 < KhBaphnom-SatraSlekrith.ttf > KhBaphnom-SatraSlekrith.woff2

Until a file exists, the monogram falls back to Fasthand, so the envelope
renders correctly either way.
