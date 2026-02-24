import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Amazonia - FitLab',
    short_name: 'FitLab',
    description: 'Precision Fitness Tracking Laboratory',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#ff0000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
