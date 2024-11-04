/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ethTypedDataSigner, EthTypedDataSignerAlgorithm, verifyEthTypedDataSignature } from '#pkg'
import { Wallet, type TypedDataDomain } from 'ethers'

describe('The signing works and can be verified', function () {
  it('should properly sign base64UrlJWTheader.base64UrlJWTpayload as string', async function () {
    const randomWallet = Wallet.createRandom()
    const signer = ethTypedDataSigner(randomWallet)
    const address: string = await randomWallet.getAddress()
    const data = 'eyJhbGciOiJFdGhUeXBlZERhdGFTaWduYXR1cmUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJkb21haW4iOnsiY2hhaW5JZCI6MTExNTUxMTF9fQ'
    const signature = await signer(data) as string
    const verifiedSigner = verifyEthTypedDataSignature(data, signature, [
      {
        blockchainAccountId: `eip155:11155111:${address}`,
        id: 'did:ethr',
        type: 'EthereumAddress',
        controller: 'did:ethr:1234'
      }
    ])
    chai.expect(typeof signature).to.equal('string')
    chai.expect(verifiedSigner).to.not.be.undefined
  })
  it('should properly sign base64UrlJWTheader.base64UrlJWTpayload as Uint8Array with external domain', async function () {
    const eip712Domain: TypedDataDomain = {
      chainId: 11155111
    }
    const randomWallet = Wallet.createRandom()
    const signer = ethTypedDataSigner(randomWallet, eip712Domain)
    const address: string = await randomWallet.getAddress()
    const data = 'eyJhbGciOiJFdGhUeXBlZERhdGFTaWduYXR1cmUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'
    const signature = await signer((new TextEncoder()).encode(data)) as string
    const verifiedSigner = verifyEthTypedDataSignature(data, signature, [
      {
        blockchainAccountId: `eip155:11155111:${address}`,
        id: 'did:ethr',
        type: 'EthereumAddress',
        controller: 'did:ethr:1234'
      }
    ], eip712Domain)
    chai.expect(typeof signature).to.equal('string')
    chai.expect(verifiedSigner).to.not.be.undefined
  })
  it('Signing without the domain is NOT possible', async function () {
    const randomWallet = Wallet.createRandom()
    const signer = ethTypedDataSigner(randomWallet)
    const data: string = 'eyJhbGciOiJFdGhUeXBlZERhdGFTaWduYXR1cmUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'
    let signature: string | null = null
    try {
      signature = await signer(data) as string
    } catch (error) {

    }
    chai.expect(signature).to.be.null
  })
  it('Verification should fail if the signature is invalid', async function () {
    const randomWallet = Wallet.createRandom()
    const EIP712Domain: TypedDataDomain = {
    }
    const signer = ethTypedDataSigner(randomWallet, EIP712Domain)
    const address: string = await randomWallet.getAddress()
    const data: string = 'eyJhbGciOiJFdGhUeXBlZERhdGFTaWduYXR1cmUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'
    const signature = await signer(data)
    let modifiedSignature: string = ''
    if (typeof signature === 'string') {
      const lastChar = signature[0]
      const newChar = String.fromCharCode((lastChar.charCodeAt(0) + 1) % 128)
      modifiedSignature = newChar + signature.slice(1)
    }
    chai.expect(typeof modifiedSignature).to.equal('string')
    chai.expect(() => {
      verifyEthTypedDataSignature(data, modifiedSignature, [
        {
          blockchainAccountId: `eip155:11155111:${address}`,
          id: 'did:ethr',
          type: 'EthereumAddress',
          controller: 'did:ethr:12345568937912'
        }
      ])
    }).to.throw()
  })
  it('Verification should fail if the are no valid authenticators', async function () {
    const randomWallet = Wallet.createRandom()
    const EIP712Domain: TypedDataDomain = {
    }
    const signer = ethTypedDataSigner(randomWallet, EIP712Domain)
    const data: string = 'eyJhbGciOiJFdGhUeXBlZERhdGFTaWduYXR1cmUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'
    const signature = await signer(data) as string

    chai.expect(typeof signature).to.equal('string')
    chai.expect(() => {
      verifyEthTypedDataSignature(data, signature, [
        {
          blockchainAccountId: 'eip155:11155111:0x388C818CA8B9251b393131C08a736A67ccB19297',
          id: 'did:ethr',
          type: 'EthereumAddress',
          controller: 'did:ethr:12345568937912'
        }
      ])
    }).to.throw()
  })
  it('Key can be given as private key string', async function () {
    const key = '0x0123456789012345678901234567890123456789012345678901234567890123'
    const signer = ethTypedDataSigner(key)
    const data: string = 'eyJhbGciOiJFdGhUeXBlZERhdGFTaWduYXR1cmUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJkb21haW4iOnsiY2hhaW5JZCI6MTExNTUxMTF9fQ'
    const signature = await signer(data)
    chai.expect(typeof signature).to.equal('string')
  })
  it('should properly sign an arbitrary object', async function () {
    const EIP712Domain: TypedDataDomain = {
      chainId: 11155111
    }
    const randomWallet = Wallet.createRandom()
    const signer = ethTypedDataSigner(randomWallet, EIP712Domain)
    const address: string = await randomWallet.getAddress()
    const data = 'eyJhbGciOiJFdGhUeXBlZERhdGFTaWduYXR1cmUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJkb21haW4iOnsiY2hhaW5JZCI6MTExNTUxMTF9fQ'
    const signature = await signer(data)
    const verifiedSigner = verifyEthTypedDataSignature(data, signature as string, [
      {
        ethereumAddress: address,
        id: 'did:ethr',
        type: 'EthereumAddress',
        controller: 'did:ethr:1234'
      }
    ])
    chai.expect(typeof signature).to.equal('string')
    chai.expect(verifiedSigner).to.not.be.undefined
  })
  it('SigningAlgorithm is properly returned', async function () {
    const signerAlg = EthTypedDataSignerAlgorithm()
    const data: string = 'eyJhbGciOiJFdGhUeXBlZERhdGFTaWduYXR1cmUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJkb21haW4iOnsiY2hhaW5JZCI6MTExNTUxMTF9fQ'
    const randomWallet = Wallet.createRandom()
    const signer = ethTypedDataSigner(randomWallet)
    const address: string = await randomWallet.getAddress()
    const signature = await signerAlg(data, signer)
    const verifiedSigner = verifyEthTypedDataSignature(data, signature, [
      {
        blockchainAccountId: `eip155:11155111:${address}`,
        id: 'did:ethr',
        type: 'EthereumAddress',
        controller: 'did:ethr:1234'
      }
    ])
    chai.expect(typeof signature).to.equal('string')
    chai.expect(verifiedSigner).to.not.be.undefined
  })
  it('SigningAlgorithm fails with a signer not created ethTypedDataSigner', async function () {
    const signerAlg = EthTypedDataSignerAlgorithm()

    const data: string = 'eyJhbGciOiJFdGhUeXBlZERhdGFTaWduYXR1cmUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJkb21haW4iOnsiY2hhaW5JZCI6MTExNTUxMTF9fQ'
    let signature: string | null = null
    const signer = async (data: string | Uint8Array): Promise<string> => {
      return 'signature'
    }
    try {
      signature = await signerAlg(data, signer)
    } catch (error) {
    }
    chai.expect(signature).to.be.null

    const data2: string = '{}'
    let signature2: string | null = null
    const signer2 = async (data: string | Uint8Array): Promise<any> => {
      JSON.parse(typeof data === 'string' ? data : (new TextDecoder()).decode(data))
      return { r: '1234', s: '2341' }
    }
    try {
      signature2 = await signerAlg(data2, signer2)
    } catch (error) {
    }
    chai.expect(signature2).to.be.null
  })
})
