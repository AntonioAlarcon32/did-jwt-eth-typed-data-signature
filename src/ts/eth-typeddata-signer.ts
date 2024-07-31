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
export function ethTypedDataSigner (domain: TypedDataDomain, privateKey: SigningKey): Signer
/**
 * Creates a configured signer function for signing data using the EIP-712 algorithm.
 *
 *  The signing function itself takes the data as a `Uint8Array` or `string` and returns a `base64Url`-encoded signature
 *
 * @param domain an EIP-712 domain object
 * @param privateKeyHex the signer's private key as a hexadecinmal string
 */
export function ethTypedDataSigner (domain: TypedDataDomain, privateKeyHex: string): Signer
/**
 * Creates a configured signer function for signing data using the EIP-712 algorithm.
 *
 *  The signing function itself takes the data as a `Uint8Array` or `string` and returns a `base64Url`-encoded signature
 *
 * @param domain an EIP-712 domain object
 * @param ethersSigner an Ethers' signer. It could be use to pass external signers connected e.g. with walletconnect or injected a browser context.
 */
export function ethTypedDataSigner (domain: TypedDataDomain, ethersSigner: EthersSigner): Signer
/**
 *
 * @param domain
 * @param ethersSignerOrPrivateKey
 * @returns
 */
export function ethTypedDataSigner (domain: TypedDataDomain, ethersSignerOrPrivateKey: SigningKey | string | EthersSigner): Signer {
  return async (data: string | Uint8Array): Promise<string> => {
    let dataObj: object
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
