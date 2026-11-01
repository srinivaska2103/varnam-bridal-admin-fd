export default function manifest() {
  return {
    id: '/',
    name: 'VARNAM Admin',
    short_name: 'VARNAM Admin',
    description: 'VARNAM Bridal Software Administration',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#FFF8F0',
    theme_color: '#FF6B00',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/admin-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/admin-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/admin-icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}

