/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ethTypedDataSigner, verifyEthTypedDataSignature } from '#pkg'
import { Wallet, type TypedDataDomain } from 'ethers'

describe('The signing works and can be verified', function () {
  it('should properly sign an arbitrary object', async function () {
    const EIP712Domain: TypedDataDomain = {
      chainId: 11155111
    }
    const randomWallet = Wallet.createRandom()
    const signer = ethTypedDataSigner(randomWallet, EIP712Domain)
    const address: string = await randomWallet.getAddress()
    const data = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJkb21haW4iOnsiY2hhaW5JZCI6MTExNTUxMTF9fQ'
    const signature = await signer(data)
    const verifiedSigner = verifyEthTypedDataSignature(data, signature as string, [
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
  it('Signing without the domain is NOT possible', async function () {
    const randomWallet = Wallet.createRandom()
    const EIP712Domain: TypedDataDomain = {
    }
    const signer = ethTypedDataSigner(randomWallet, EIP712Domain)
    const address: string = await randomWallet.getAddress()
    const data: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'
    const signature = await signer(data)
    chai.expect(typeof signature).to.equal('string')
    chai.expect(() => verifyEthTypedDataSignature(data, signature as string, [
      {
        blockchainAccountId: `eip155:11155111:${address}`,
        id: 'did:ethr',
        type: 'EthereumAddress',
        controller: 'did:ethr:12345568979'
      }
    ])).to.throw()
  })
  it('Verification should fail if the signature is invalid', async function () {
    const randomWallet = Wallet.createRandom()
    const EIP712Domain: TypedDataDomain = {
    }
    const signer = ethTypedDataSigner(randomWallet, EIP712Domain)
    const address: string = await randomWallet.getAddress()
    const data: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'
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
  it('Key can be given as private key string', async function () {
    const key = '0x0123456789012345678901234567890123456789012345678901234567890123'
    const EIP712Domain: TypedDataDomain = {
    }
    const signer = ethTypedDataSigner(key, EIP712Domain)
    const data: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'
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
    const data = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJkb21haW4iOnsiY2hhaW5JZCI6MTExNTUxMTF9fQ'
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
})
