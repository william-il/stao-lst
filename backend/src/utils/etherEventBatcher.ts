import { ethers } from 'ethers';
import data, { sTaoData } from '../data/ethData';
import dotenv from 'dotenv';
import { EventEmitter, EventEmitterAsyncResource } from 'events';
import { ErrorDecoder, ErrorType } from 'ethers-decode-error';
import { Redeemed } from '../types/eventsErrors';
import { EventBase } from '../types/eventsErrors';

// deprecatead
export default async function batchQueriedEvents(
  contract: ethers.Contract,
  startBlock: number | string,
  endBlock: number | string,
  filter: ethers.DeferredTopicFilter | ethers.ContractEvent,
  shouldMap = false
) {
  const lastEvents = (await contract.queryFilter(
    filter,
    startBlock,
    endBlock
  )) as ethers.EventLog[];

  let eventArr: any[] = [];
  let eventMap = new Map();

  if (shouldMap) {
    lastEvents.forEach((event) => {
      if (!eventMap.has(event.args[0])) {
        eventMap.set(event.args[0], {
          sTaoTotalAmount: event.args[1],
          sTaoTaxed: event.args[2],
          sTaoBurned: event.args[3],
          taoToUser: event.args[4],
          lastTimeUpdated: event.args[5],
          eventCount: 0,
        });
      } else {
        eventMap.get(event.args[0]).sTaoTotalAmount += event.args[1];
        eventMap.get(event.args[0]).sTaoTaxed += event.args[2];
        eventMap.get(event.args[0]).sTaoBurned += event.args[3];
        eventMap.get(event.args[0]).taoToUser += event.args[4];
        eventMap.get(event.args[0]).lastTimeUpdated = event.args[5];
        eventMap.get(event.args[0]).eventCount += 1;
      }
    });
  } else {
    lastEvents.forEach((event) => {
      eventArr.push(event.args.toArray());
    });
  }
  if (!eventArr.length) {
    return eventMap;
  } else {
    return eventArr;
  }
}

function isRedeemedEvent(event: EventBase): event is Redeemed {
  return 'ethAddress' in event;
}
