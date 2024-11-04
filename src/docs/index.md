[![License: {{PKG_LICENSE}}](https://img.shields.io/badge/License-{{PKG_LICENSE}}-yellow.svg)](LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
{{BADGES}}

# {{PKG_NAME}}

{{PKG_DESCRIPTION}}

- [{{PKG_NAME}}](#pkg_name)
  - [Install](#install)
  - [Usage example](#usage-example)
  - [API reference documentation](#api-reference-documentation)

## Install

`{{PKG_NAME}}` can be imported to your project with `npm`:

```console
npm install {{PKG_NAME}}
```

Then either require (Node.js CJS):

```javascript
const {{PKG_CAMELCASE}} = require('{{PKG_NAME}}')
```

or import (JavaScript ES module):

```javascript
import * as {{PKG_CAMELCASE}} from '{{PKG_NAME}}'
```

> The appropriate version for browser or node should be automatically chosen when importing. However, if your bundler does not import the appropriate module version (node esm, node cjs or browser esm), you can force it to use a specific one by just importing one of the followings:
>
> - `{{PKG_NAME}}/dist/cjs/index.node`: for Node.js CJS module
> - `{{PKG_NAME}}/dist/esm/index.node`: for Node.js ESM module
> - `{{PKG_NAME}}/dist/esm/index.browser`: for browser ESM module
>
> If you are coding TypeScript, types will not be automatically detected when using the specific versions. You can easily get the types in by creating and importing to your TS project a new types declaration file `{{PKG_NAME_NO_SCOPE}}.d.ts` with the following line:
>
> ```typescript
> declare module '{{PKG_NAME}}/dist/esm/index.browser' // use the specific module file you are importing
> ```

{{BROWSER_BUNDLES_INSTALLATION}}

## Usage example

A typical use would be to use any web3 wallet to sign a JWT using `did-jwt`. With `did-jwt`, verification keys are resolved using the Decentralized ID (DID) of the signing identity of the token, which is passed as the `iss` attribute of the JWT payload. As a result for verification to work, the verification key should be added to the issuer's DID document.

1. Import did-jwt and the external ethereum typeddate signer
    ```typescript
    import {
      ethTypedDataSigner,
      EthTypedDataSignerAlgorithm,
      verifyEthTypedDataSignature,
      validSignatures,
    } from 'did-jwt-eth-typed-data-signature'

    import { 
      createJWT, 
      decodeJWT, 
      verifyJWT, 
      AddSigningAlgorithm, 
      AddVerifierAlgorithm,
    } from 'did-jwt';

    ```
    > You should use a version of did-jwt supporting Ethereum EIP-712 typed-data signatures. There is currently a pull request on the main track. On the mean time you can install the did-jwt fork at [this fork](https://github.com/AntonioAlarcon32/did-jwt)
2. Let use a web3 signer using an injected provider and the [`ethers`](https://github.com/ethers-io/ethers.js) library
    ```typescript
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    ```
3. Add the algorithms to did-jwt
    ```typescript
    AddSigningAlgorithm('EthTypedDataSignature', EthTypedDataSignerAlgorithm())
    AddVerifierAlgorithm('EthTypedDataSignature', verifyEthTypedDataSignature, validSignatures)
    ```
4. Define the domain and ethTypedDataSigner
    ```typescript
    const domain: TypedDataDomain = {
      name: 'VerifiableCredential',
      version: '1',
      chainId: 11155111, // Sepolia testnet
    };
    const jwtSigner = ethTypedDataSigner(signer, domain);
    ```
5. Now you can use the signer to sign and verify did-jwtSigner
    ```typescript
        const newJwt = await createJWT(
          { sub: `did:ethr:sepolia:${await signer.getAddress()}`, name: 'Bob Smith', domain },
          { issuer: `did:ethr:sepolia:${await signer.getAddress()}`, signer: jwtSigner },
          { alg: 'EthTypedDataSignature' }
        )
    ```
## API reference documentation

[Check the API](../../docs/API.md)
