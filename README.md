[![License: EUPL_1.2](https://img.shields.io/badge/License-EUPL_1.2-yellow.svg)](LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Build and test](https://github.com/AntonioAlarcon32/did-jwt-eth-typed-data-signature/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/AntonioAlarcon32/did-jwt-eth-typed-data-signature/actions/workflows/build-and-test.yml)

# did-jwt-eth-typed-data-signature

EIP-712 Ethereum TypedData Signer/Verifier for DID-JWT. It supports using any Web3 connected wallet.

- [Install](#install)
- [Usage example](#usage-example)
- [API reference documentation](#api-reference-documentation)

## Install

`did-jwt-eth-typed-data-signature` can be imported to your project with `npm`:

```console
npm install did-jwt-eth-typed-data-signature
```

Then either require (Node.js CJS):

```javascript
const didJwtEthTypedDataSignature = require('did-jwt-eth-typed-data-signature')
```

or import (JavaScript ES module):

```javascript
import * as didJwtEthTypedDataSignature from 'did-jwt-eth-typed-data-signature'
```

> The appropriate version for browser or node should be automatically chosen when importing. However, if your bundler does not import the appropriate module version (node esm, node cjs or browser esm), you can force it to use a specific one by just importing one of the followings:
>
> - `did-jwt-eth-typed-data-signature/dist/cjs/index.node`: for Node.js CJS module
> - `did-jwt-eth-typed-data-signature/dist/esm/index.node`: for Node.js ESM module
> - `did-jwt-eth-typed-data-signature/dist/esm/index.browser`: for browser ESM module
>
> If you are coding TypeScript, types will not be automatically detected when using the specific versions. You can easily get the types in by creating and importing to your TS project a new types declaration file `did-jwt-eth-typed-data-signature.d.ts` with the following line:
>
> ```typescript
> declare module 'did-jwt-eth-typed-data-signature/dist/esm/index.browser' // use the specific module file you are importing
> ```

You can also download browser ESM, IIFE and UMD bundles directly from the [releases' page](https://github.com/AntonioAlarcon32/did-jwt-eth-typed-data-signature/releases) and manually add them to your project.

## Usage example

A typical use would be to use any web3 wallet to sign a JWT using `did-jwt`. With `did-jwt`, verification keys are resolved using the Decentralized ID (DID) of the signing identity of the token, which is passed as the `iss` attribute of the JWT payload. As a result for verification to work, the verification key should be added to the issuer's DID document.

```typescript
TO-DO

```

## API reference documentation

[Check the API](docs/API.md)
