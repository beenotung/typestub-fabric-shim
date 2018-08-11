import {Chaincode} from "@theledger/fabric-chaincode-utils";
import * as winston from "winston";
import {strict} from "assert";
import {Timestamp} from 'google-protobuf/google/protobuf/timestamp_pb'

export as namespace Shim;
export = Shim.Shim & Shim;

declare class ChaincodeSupportClient {
  /**
   * @param {Object} chaincode
   * @param {string} url format of 'grpc(s)://host:port'
   * @param {Object} opts
   * */
  constructor<A extends Chaincode>(chaincode: A, url: string, opts)

  close()

  chat(convStarterMsg)

  handleInit(msg)

  handleTransaction(msg)

  async handleGetState(collection, key, channel_id, txId)

  async handlePutState(collection, key, value, channel_id, txId)

  async handleDeleteState(collection, key, channel_id, txId)

  async handleGetStateByRange(collection, startKey, endKey, channel_id, txId)

  async handleQueryStateNext(id, channel_id, txId)

  async handleQueryStateClose(id, channel_id, txId)

  async handleGetQueryResult(collection, query, channel_id, txId)

  async handleGetHistoryForKey(key, channel_id, txId)

  async handleInvokeChaincode(chaincodeName, args, channel_id, txId)

  toString(): string
}

declare interface SuccessResponse {
  status: number
  payload: Buffer
}

declare interface ErrorResponse {
  status: number
  message: string
}

declare interface ProposalCreator {
  mspid: string
}

declare interface SignedProposal {
  signature: Buffer
  proposal: Proposal
}

declare interface Proposal {
  header: Header
  payload: ChaincodeProposalPayload
}

declare interface Header {
  channel_header: ChannelHeader
  signature_header: SignatureHeader
}

declare interface ChannelHeader {
  type: number
  version: number
  timestamp: Timestamp
  channel_id: string
  tx_id: string
  epoch: number
}

declare interface SignatureHeader {
  creator: ProposalCreator
  nonce: Buffer
}

declare interface ChaincodeProposalPayload {
  input: Buffer
  transientMap: Map<string, Buffer>
}

declare class ChaincodeStub {
  constructor(client: ChaincodeSupportClient, channel_id: string, txId: string, chaincodeInput, signedProposal)

  getArgs(): string[]

  getStringArgs(): string[]

  getFunctionAndParameters(): { fcn: strict, params: string[] }

  getTxID(): string

  getChannelID(): string

  getCreator(): ProposalCreator

  getTransient(): Map<string, Buffer>

  getSignedProposal(): SignedProposal

  /**
   * Returns the timestamp when the transaction was created. This
   * is taken from the transaction {@link ChannelHeader}, therefore it will indicate the
   * client's timestamp, and will have the same value across all endorsers.
   */
  getTxTimestamp(): Timestamp

  /**
   * @returns {string} A HEX-encoded string of SHA256 hash of the transaction's nonce, creator and epoch concatenated
   * */
  getBinding(): string

  async getState(key: string)

  async putState(key: string, value: byte[])

  async deleteState(key: string): byte[]

  async getStateByRange(startKey: string, endKey: string): Promise<Shim.StateQueryIterator>

  async getQueryResult(query: string): Promise<Shim.StateQueryIterator>

  async getHistoryForKey(key: string): Promise<Shim.HistoryQueryIterator>

  async invokeChaincode(chaincodeName: string, args: byte[][], channel: string)

  setEvent(name: string, payload: byte[])

  createCompositeKey(objectType: string, attributes: string[]): string

  splitCompositeKey(compositeKey: string): { objectType: string, attributes: string[] }

  async getStateByPartialCompositeKey(objectType: string, attributes: string[]): Promise<Shim.StateQueryIterator>

  async getPrivateData(collection: string, key: string): Promise<string>

  async putPrivateData(collection: string, key: string, value: string)

  async deletePrivateData(collection: string, key: string)

  async getPrivateDataByRange(collection: string, startKey: string, endKey: string): Promise<Shim.Iterators.PrivateQueryIterator>

  async getPrivateDataByPartialCompositeKey(collection: string, objectType: string, attributes: string[]): Promise<Shim.Iterators.PrivateQueryIterator>

  async getPrivateDataQueryResult(collection: string, query: string): Promise<Shim.Iterators.PrivateQueryIterator>
}


declare type byte = number

declare namespace Shim {
  export class Shim {
    static start<A extends Chaincode>(chaincode: A): ChaincodeSupportClient

    static success(payload: Buffer | string): SuccessResponse

    static error(msg: string): ErrorResponse

    static newLogger(name: string): winston.LoggerInstance
  }

  export class ClientIdentity {
    constructor(stub)

    getID(): string

    getMSPID(): string

    getAttributeValue(attrName: string): string | null

    assertAttributeValue(attrName: string, attrValue: string): boolean

    getX509Certificate(): object
  }

  export class Stub extends ChaincodeStub {

  }

  export namespace Stub {
    export const RESPONSE_CODE = {
      // OK constant - status code less than 400, endorser will endorse it.
      // OK means init or invoke successfully.
      OK: 200,
      // ERRORTHRESHOLD constant - status code greater than or equal to 400 will be considered an error and rejected by endorser.
      ERRORTHRESHOLD: 400,
      // ERROR constant - default error value
      ERROR: 500
    }
  }

  export namespace Iterators {
    /**
     * @private */
    export class CommonIterator {
      constructor(handler: ChaincodeSupportClient, channel_id: string, txID: string, response, type)

      async close()

      async next()
    }

    export class StateQueryIterator extends CommonIterator {
    }

    export class HistoryQueryIterator extends CommonIterator {
    }

    /** @private */
    export class PrivateQueryIterator extends CommonIterator {
    }
  }

  export class StateQueryIterator extends Iterators.StateQueryIterator {
  }

  export class HistoryQueryIterator extends Iterators.HistoryQueryIterator {
  }

  export class ChaincodeInterface {
    async Init(stub: ChaincodeStub)

    async Invoke(stub: ChaincodeStub)
  }
}
