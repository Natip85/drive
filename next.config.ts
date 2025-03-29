/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import { env } from "./src/env";
import type { NextConfig } from "next";

const UTHost = `${env.UPLOADTHING_APP_ID}.ufs.sh`;

const config: NextConfig = {
  skipTrailingSlashRedirect: true,
  reactStrictMode: true,
  devIndicators: false,
  images: {
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: UTHost,
        pathname: "/f/*",
      },
    ],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: `${env.ASSETS_PATH_PREFIX_V0}:path*`,
  //       destination: `https://${UTHost}/f/:path*`,
  //     },
  //     {
  //       source: '/ingest/static/:path*',
  //       destination: 'https://us-assets.i.posthog.com/static/:path*',
  //     },
  //     {
  //       source: '/ingest/:path*',
  //       destination: `${env.NEXT_PUBLIC_POSTHOG_HOST}/:path*`,
  //     },
  //     {
  //       source: '/ingest/decide',
  //       destination: `${env.NEXT_PUBLIC_POSTHOG_HOST}/decide`,
  //     },
  //   ]
  // },
  experimental: {
    reactCompiler: true,
    turbo: {
      rules: {
        "*.svg": {
          loaders: [
            {
              loader: "@svgr/webpack",
              options: {
                typescript: true,
                ext: "tsx",
              },
            },
          ],
          as: "*.tsx",
        },
      },
    },
  },
  webpack: (webpackConfig) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    webpackConfig.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            typescript: true,
            ext: "tsx",
          },
        },
      ],
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return webpackConfig;
  },
};

export default config;
