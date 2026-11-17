const redirects = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header',
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // The redesign replaced these routes.
  const redesignRedirects = [
    { source: '/posts/page/:number', destination: '/posts', permanent: true },
    { source: '/products', destination: '/shop', permanent: true },
  ]

  const redirects = [internetExplorerRedirect, ...redesignRedirects]

  return redirects
}

export default redirects
