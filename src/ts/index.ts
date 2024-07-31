/**
 * EIP-712 Ethereum TypedData Signer/Verifier for DID-JWT. It supports using any Web3 connected wallet.
 *
 * @packageDocumentation
 */

// If you want your module to be compatible with node16 or nodenext module resolution, add always the extension to imported files.
export { ethTypedDataSigner, EthTypedDataSignerAlgorithm } from './eth-typeddata-signer'
export { verifyEthTypedDataSignature, type VerificationMethod, validSignatures } from './eth-typeddata-verifier'
