import { Signer as EthersSigner, SigningKey, type TypedDataDomain, Wallet } from 'ethers'
import { jsonToSolidityTypes } from '@juanelas/solidity-types-from-json'
import { type SignerAlgorithm, decodeJWT, Signer } from 'did-jwt'

/**
 * Creates a configured signer function for signing data using the EIP-712 algorithm.
 * The signing function itself takes the data as a `Uint8Array` or `string` and returns a `base64Url`-encoded signature.
 *
 * @param privateKey the signer's private key
 * @param domain an EIP-712 domain object
 *
 * @returns a signer that signs using EIP-712 (Ethereum Typed Data) signarures
 */
export function ethTypedDataSigner (privateKey: SigningKey, domain?: TypedDataDomain): Signer
/**
 * Creates a configured signer function for signing data using the EIP-712 algorithm.
 * The signing function itself takes the data as a `Uint8Array` or `string` and returns a `base64Url`-encoded signature.
 *
 * @param privateKeyHex the signer's private key as a hexadecinmal string
 * @param domain an EIP-712 domain object
 *
 * @returns a signer that signs using EIP-712 (Ethereum Typed Data) signarures
 */
export function ethTypedDataSigner (privateKeyHex: string, domain?: TypedDataDomain): Signer
/**
 * Creates a configured signer function for signing data using the EIP-712 algorithm.
 * The signing function itself takes the data as a `Uint8Array` or `string` and returns a `base64Url`-encoded signature.
 *
 * @param ethersSigner an Ethers' signer. It could be used to pass external signers connected e.g. with walletconnect or injected a browser context.
 * @param domain an EIP-712 domain object. If set, when the signer receives data to sign with header.domain not set, if will default to this one.
 *
 * @returns a signer that signs using EIP-712 (Ethereum Typed Data) signarures
 */
export function ethTypedDataSigner (ethersSigner: EthersSigner, domain?: TypedDataDomain): Signer

export function ethTypedDataSigner (ethersSignerOrPrivateKey: SigningKey | string | EthersSigner, domain?: TypedDataDomain): Signer {
  const signer = async function (data: string | Uint8Array): Promise<string> {
    let dataObj: Record<string, any>
    const dataStr = typeof data !== 'string' ? (new TextDecoder()).decode(data) : data
    try {
      dataObj = JSON.parse(dataStr)
    } catch (error) {
      // Let us check if it is headerB64.payloadB64 of a JWT
      // Since there is no signature now we just add a fake one and try to decode the JWT
      const { header, payload } = decodeJWT(dataStr + '.fakesignature')
      dataObj = {
        header,
        payload
      }
    }

    const eip712Domain: TypedDataDomain = dataObj.payload?.domain ?? domain // if the object to sign does not define a domain we set the default one

    if (eip712Domain === undefined) {
      throw new Error('No domain specified. Create the signer with the domain argument or pass domain in the JWS payload.domain')
    }

    const types = jsonToSolidityTypes(dataObj, { mainTypeName: 'JWT' })
    const solidityTypes = types.types

    const wallet = (typeof ethersSignerOrPrivateKey === 'string' || ethersSignerOrPrivateKey instanceof SigningKey) ? new Wallet(ethersSignerOrPrivateKey) : ethersSignerOrPrivateKey

    let signature: string = await wallet.signTypedData(eip712Domain, solidityTypes, dataObj)
    if (signature.startsWith('0x')) {
      signature = signature.slice(2)
    }
    return signature
  }

  return signer
}

/**
 * Returns a valid SignerAlgorithm for eth typedData signature.
 * A SignerAlgorithm is a function that expects a payload to sign and a Signer.
 * For it to work it must use a Signer created with the {@link ethTypedDataSigner} function.
 *
 * @returns the EIP-712 Ethereum Typed Data SignerAlgorithm
 */
export function EthTypedDataSignerAlgorithm (): SignerAlgorithm {
  return async function sign (payload: string, signer: Signer): Promise<string> {
    const invalidSignerErrorMsg = 'only a Signer created with the ethTypedDataSigner function should be used here'
    try {
      await signer('invalid JSON data')
      throw new Error(invalidSignerErrorMsg)
    } catch (error) {
      if (error instanceof Error && error.message === invalidSignerErrorMsg) {
        throw new Error(invalidSignerErrorMsg)
      }
      const signature = await signer(payload)
      if (typeof signature !== 'string') {
        throw new Error(invalidSignerErrorMsg)
      }
      return signature
    }
  }
}
