import { NextResponse } from "next/server";

export function middleware(request) {
    console.log('TEST')
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  console.log(nonce)
  const cspHeader = `
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http: 'unsafe-inline' ${
    process.env.NODE_ENV === "production" ? "" : `'unsafe-eval'`
  };
`;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("X-Test", 'test');
  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  return response;
}

export const config = {
    matcher: '/:path*',
};