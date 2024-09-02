import { Signer as EthersSigner, SigningKey, type TypedDataDomain, Wallet } from 'ethers'
import { jsonToSolidityTypes } from '@juanelas/solidity-types-from-json'
import { toJose, type SignerAlgorithm, EcdsaSignature, type Signer, decodeJWT } from 'did-jwt'

/**
 *  Creates a configured signer function for signing data using the EIP-712 algorithm.
 *
 *  The signing function itself takes the data as a `Uint8Array` or `string` and returns a `base64Url`-encoded signature
 *
 * @param domain an EIP-712 domain object
 * @param privateKey the signer's private key
 */
export function ethTypedDataSigner (privateKey: SigningKey, domain?: TypedDataDomain): Signer
/**
 * Creates a configured signer function for signing data using the EIP-712 algorithm.
 *
 *  The signing function itself takes the data as a `Uint8Array` or `string` and returns a `base64Url`-encoded signature
 *
 * @param domain an EIP-712 domain object
 * @param privateKeyHex the signer's private key as a hexadecinmal string
 */
export function ethTypedDataSigner (privateKeyHex: string, domain?: TypedDataDomain): Signer
/**
 * Creates a configured signer function for signing data using the EIP-712 algorithm.
 *
 *  The signing function itself takes the data as a `Uint8Array` or `string` and returns a `base64Url`-encoded signature
 *
 * @param domain an EIP-712 domain object
 * @param ethersSigner an Ethers' signer. It could be use to pass external signers connected e.g. with walletconnect or injected a browser context.
 */
export function ethTypedDataSigner (ethersSigner: EthersSigner, domain?: TypedDataDomain): Signer
/**
 *
 * @param domain
 * @param ethersSignerOrPrivateKey
 * @returns
 */
export function ethTypedDataSigner (ethersSignerOrPrivateKey: SigningKey | string | EthersSigner, domain?: TypedDataDomain): Signer {
  return async (data: string | Uint8Array): Promise<string> => {
    let dataObj: Record<string, any>
    const dataStr = typeof data !== 'string' ? data.toString() : data
    try {
      dataObj = JSON.parse(dataStr)
    } catch (error) {
      // Let us check if it is a JWT signature of headerB64.payloadB64.signatureb64
      // Since there is no signature now we just add a fake one and try to decode the JWT
      const { header, payload } = decodeJWT(dataStr + '.fakesignature')
      dataObj = {
        header,
        payload
      }
      if (dataObj.payload.domain === undefined) {
        dataObj.payload.domain = domain
      } else if (domain === undefined) {
        domain = dataObj.payload.domain
      }
    }

    if (domain === undefined) {
      throw new Error('No domain specified. Pass the domain argument or define domain in the JWS payload')
    }

    const types = jsonToSolidityTypes(dataObj, { mainTypeName: 'JWT' })
    const solidityTypes = types.types

    const wallet = (typeof ethersSignerOrPrivateKey === 'string' || ethersSignerOrPrivateKey instanceof SigningKey) ? new Wallet(ethersSignerOrPrivateKey) : ethersSignerOrPrivateKey

    let signature: string = await wallet.signTypedData(domain, solidityTypes, dataObj)
    if (signature.startsWith('0x')) {
      signature = signature.slice(2)
    }
    return signature
  }
}

export function EthTypedDataSignerAlgorithm (recoverable?: boolean): SignerAlgorithm {
  return async function sign (payload: string, signer: Signer): Promise<string> {
    const signature: EcdsaSignature | string = await signer(payload)
    if (signature instanceof Object) {
      return toJose(signature, recoverable)
    } else {
      return signature
    }
  }
}
