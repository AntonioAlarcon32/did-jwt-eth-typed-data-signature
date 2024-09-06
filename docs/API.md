# did-jwt-eth-typed-data-signature v0.9.4

EIP-712 Ethereum TypedData Signer/Verifier for DID-JWT. It supports using any Web3 connected wallet.

## Interfaces

### VerificationMethod

Represents the properties of a Verification Method listed in a DID document.

This data type includes public key representations that are no longer present in the spec but are still used by
several DID methods / resolvers and kept for backward compatibility.

#### See

 - [https://www.w3.org/TR/did-core/#verification-methods](https://www.w3.org/TR/did-core/#verification-methods)
 - [https://www.w3.org/TR/did-core/#verification-method-properties](https://www.w3.org/TR/did-core/#verification-method-properties)

#### Properties

| Property | Type |
| ------ | ------ |
| `blockchainAccountId?` | `string` |
| `conditionAnd?` | [`VerificationMethod`](API.md#verificationmethod)[] |
| `conditionDelegated?` | `string` |
| `conditionOr?` | [`VerificationMethod`](API.md#verificationmethod)[] |
| `conditionThreshold?` | [`VerificationMethod`](API.md#verificationmethod)[] |
| `conditionWeightedThreshold?` | `ConditionWeightedThreshold`[] |
| `controller` | `string` |
| `ethereumAddress?` | `string` |
| `id` | `string` |
| `publicKeyBase58?` | `string` |
| `publicKeyBase64?` | `string` |
| `publicKeyHex?` | `string` |
| `publicKeyJwk?` | `JsonWebKey` |
| `publicKeyMultibase?` | `string` |
| `relationshipChild?` | `string`[] |
| `relationshipParent?` | `string`[] |
| `relationshipSibling?` | `string`[] |
| `threshold?` | `number` |
| `type` | `string` |

## Variables

### validSignatures

> `const` **validSignatures**: `Record`\<`string`, `string`[]\>

## Functions

### EthTypedDataSignerAlgorithm()

> **EthTypedDataSignerAlgorithm**(): `SignerAlgorithm`

#### Returns

`SignerAlgorithm`

***

### ethTypedDataSigner()

#### Param

#### Param

#### ethTypedDataSigner(privateKey, domain)

> **ethTypedDataSigner**(`privateKey`, `domain`?): `Signer`

Creates a configured signer function for signing data using the EIP-712 algorithm.

 The signing function itself takes the data as a `Uint8Array` or `string` and returns a `base64Url`-encoded signature

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `privateKey` | `SigningKey` | the signer's private key |
| `domain`? | `TypedDataDomain` | an EIP-712 domain object |

##### Returns

`Signer`

##### Param

##### Param

#### ethTypedDataSigner(privateKeyHex, domain)

> **ethTypedDataSigner**(`privateKeyHex`, `domain`?): `Signer`

Creates a configured signer function for signing data using the EIP-712 algorithm.

 The signing function itself takes the data as a `Uint8Array` or `string` and returns a `base64Url`-encoded signature

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `privateKeyHex` | `string` | the signer's private key as a hexadecinmal string |
| `domain`? | `TypedDataDomain` | an EIP-712 domain object |

##### Returns

`Signer`

##### Param

##### Param

#### ethTypedDataSigner(ethersSigner, domain)

> **ethTypedDataSigner**(`ethersSigner`, `domain`?): `Signer`

Creates a configured signer function for signing data using the EIP-712 algorithm.

 The signing function itself takes the data as a `Uint8Array` or `string` and returns a `base64Url`-encoded signature

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ethersSigner` | `Signer` | an Ethers' signer. It could be use to pass external signers connected e.g. with walletconnect or injected a browser context. |
| `domain`? | `TypedDataDomain` | an EIP-712 domain object |

##### Returns

`Signer`

##### Param

##### Param

***

### verifyEthTypedDataSignature()

> **verifyEthTypedDataSignature**(`data`, `signature`, `authenticators`): [`VerificationMethod`](API.md#verificationmethod)

Verifies a JWT signature using the EIP-712 algorithm. The TypedData structure is automatically inferred from the header and payload of the JWT: `{ header: any, payload:: any}`

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `string` | the JWT data: headerBase64Url.payloadBase64Url |
| `signature` | `string` | the JWT signature encoded in base64url |
| `authenticators` | [`VerificationMethod`](API.md#verificationmethod)[] | the list of authenticators to verify the signature against |

#### Returns

[`VerificationMethod`](API.md#verificationmethod)
