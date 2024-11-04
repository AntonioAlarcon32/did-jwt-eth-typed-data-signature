import { jsonToSolidityTypes } from '@juanelas/solidity-types-from-json'
import { decodeJWT } from 'did-jwt'
import { type VerificationMethod } from 'did-resolver'
import { type TypedDataDomain, verifyTypedData } from 'ethers'

export { type VerificationMethod } from 'did-resolver'

/**
 * Verifies a JWT signature using the EIP-712 algorithm. The TypedData structure
 * is automatically inferred from the header and payload of the JWT: `{ header:
 * any, payload:: any }`. The EIP-712 domain should be obtained from the
 * `payload.domain` of the input data. If not present, or may be overriden, an
 * optional domain argument `domain`.
 *
 * @param data the JWT data: headerBase64Url.payloadBase64Url
 * @param signature the JWT signature encoded in base64url
 * @param authenticators the list of verification methods to verify the
 * signature against
 * @param domain an optional @link{TypedDataDomain} to use instead of the one in
 * `payload.domain`
 *
 * @returns an object with the properties of the verification method used to sign
 *
 * @throws Error
 * Thrown if the verification fails. invalid_signature: Signature invalid for JWT
 */
export function verifyEthTypedDataSignature (
  data: string,
  signature: string,
  authenticators: VerificationMethod[],
  domain?: TypedDataDomain
): VerificationMethod {
  let signer: VerificationMethod | undefined

  const availableAuthenticators: boolean = authenticators.find((a: VerificationMethod) => {
    return (a.blockchainAccountId ?? a.ethereumAddress) !== undefined
  }) !== undefined

  if (availableAuthenticators) {
    const fullJwt: string = data + '.' + signature
    const { header, payload } = decodeJWT(fullJwt)
    const dataObj = {
      header,
      payload
    }
    const types = jsonToSolidityTypes(dataObj, { mainTypeName: 'JWT' })
    const solidityTypes = types.types
    const signatureFormatted = '0x' + signature
    const eip712Domain: TypedDataDomain = domain ?? payload.domain
    const recoveredAddress = verifyTypedData(eip712Domain, solidityTypes, dataObj, signatureFormatted)
    signer = authenticators.find(authenticator => {
      if (typeof authenticator.blockchainAccountId === 'string') {
        const [, chainId, address] = authenticator.blockchainAccountId.split(':')
        if (address.toLowerCase() === recoveredAddress.toLowerCase()) {
          if (eip712Domain?.chainId !== undefined && eip712Domain.chainId !== null) {
            return eip712Domain.chainId.toString() === chainId
          }
          return true
        }
      } else if (typeof authenticator.ethereumAddress === 'string') {
        if (eip712Domain.chainId !== undefined && eip712Domain.chainId !== null) {
          return authenticator.ethereumAddress.toLowerCase() === recoveredAddress.toLowerCase()
        }
      }
      return false
    })
  }

  if (signer === undefined) throw new Error('invalid_signature: Signature invalid for JWT')
  return signer
}

/**
 * A record of valid proof types that can be verified by this verifier for the EthTypedDataSignature signature algorithm.
 */
export const validSignatures: Record<string, string[]> = {
  EthTypedDataSignature: [
    'EcdsaSecp256k1VerificationKey2019',
    'EcdsaSecp256k1RecoveryMethod2020'
  ]
}
