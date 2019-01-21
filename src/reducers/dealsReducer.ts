import { GET_DEALS, GET_ROUTE, RESET_PATH } from "../actions/types";
import { IDeals, IArrival, IDeparture, INodes } from "../models/interfaces";
import { COST } from "../utils/constants";
import { cloneDeep } from "lodash";

const initialState = {
  arrivalsArray: [],
  departuresArray: [],
  nodes: [],
  path: []
};

export default function dealsReducer(state = initialState, action: any) {
  switch (action.type) {
    case GET_DEALS:
      return {
        ...state,
        arrivalsArray: getArrivals(action.payload),
        departuresArray: getDepartures(action.payload),
        nodes: createNodes(action.payload)
      };
    case GET_ROUTE:
      const nodesCopy: INodes[] = cloneDeep(state.nodes);
      const pathFindRes = dijkstra(
        nodesCopy,
        nodesCopy.find((node: INodes) => node.key === action.payload.departure),
        action.payload.weight
      );

      return {
        ...state,
        path: getPath(
          nodesCopy,
          pathFindRes.prev,
          action.payload.arrival,
          action.payload.departure,
          action.payload.weight
        )
      };
    case RESET_PATH:
      return {
        ...state,
        path: initialState.path
      };
    default:
      return state;
  }
}

function getPath(
  nodes: INodes[],
  prev: any,
  arrival: string,
  departure: string,
  weight: string
) {
  let currentIndex = nodes.findIndex((node: INodes) => node.key === arrival);
  const destinationIndex = nodes.findIndex(
    (node: INodes) => node.key === departure
  );

  const path: INodes[] = [nodes[currentIndex]];

  while (currentIndex !== destinationIndex) {
    const nextCity: any = nodes.find(
      (node: INodes) => node.key === prev[currentIndex].key
    );
    path.unshift(nextCity);

    currentIndex = nodes.findIndex((node: INodes) => node.key === nextCity.key);
  }
  return createRoute(path, weight);
}

function createRoute(path: any[], weight: string) {

  let currentIndex = 0;
  const lastIndex = path.length - 1;

  while (currentIndex <= lastIndex) {
    if (currentIndex === lastIndex) {
      path.splice(currentIndex, 1);
    } else {
      path[currentIndex].arrival = path[currentIndex + 1].key;
      path[currentIndex].departure = path[currentIndex].key;
      path[currentIndex].itineraries = path[currentIndex].edges
      .filter((k: any) => k.arrival.key === path[currentIndex].arrival 
        && k.departure.key === path[currentIndex].departure
      );
      path[currentIndex].itineraries.forEach((i: any) => delete i.arrival && delete i.departure);
      path[currentIndex].result = applyReducerToWeight(path[currentIndex].itineraries, weight)
    }
    currentIndex++;
  }
  return path;
}

function applyReducerToWeight(itineraries: any, weight: string){
  if (weight === COST) {
    return itineraries.reduce(
      (prev: any, curr: any) => {
        return prev.cost < curr.cost ? prev : curr;
      }
    );
  } else {
    return itineraries.reduce(
      (prev: any, curr: any) => {
        return prev.duration < curr.duration ? prev : curr;
      }
    );
  }
}

function getDepartures(dealsArray: IDeals) {
  const departuresAuxArray: IDeparture[] = [];
  dealsArray.deals.forEach(deal => {
    const departure = departuresAuxArray.find(
      k => k.departure === deal.departure
    );
    if (!departure) {
      departuresAuxArray.push({
        departure: deal.departure,
        key: deal.reference
      });
    }
  });
  return departuresAuxArray;
}
function getArrivals(dealsArray: IDeals) {
  const arrivalsAuxArray: IArrival[] = [];
  dealsArray.deals.forEach(deal => {
    const arrival = arrivalsAuxArray.find(k => k.arrival === deal.arrival);
    if (!arrival) {
      arrivalsAuxArray.push({ key: deal.reference, arrival: deal.arrival });
    }
  });
  return arrivalsAuxArray;
}

function createNodes(dealsArray: IDeals) {
  const nodes: INodes[] = [];
  dealsArray.deals.forEach(deal => {
    let departure = nodes.find(k => k.key === deal.departure);
    let arrival = nodes.find(k => k.key === deal.arrival);

    if (!departure) {
      departure = { key: deal.departure, edges: [] };
      nodes.push(departure);
    }
    if (!arrival) {
      arrival = { key: deal.arrival, edges: [] };
      nodes.push(arrival);
    }
    const edge = {
      arrival,
      cost: deal.cost,
      departure,
      discount: deal.discount,
      duration: parseDuration(deal.duration),
      reference: deal.reference,
      transport: deal.transport
    };
    departure.edges.push(edge);
  });
  return nodes;
}

function parseDuration({ h, m }: { h: string; m: string }) {
  return parseInt(h, undefined) * 60 + parseInt(m, undefined);
}

function dijkstra(nodes: INodes[], origin: any, weight: string) {
  const dist = new Array(nodes.length).fill(Number.MAX_SAFE_INTEGER);
  const prev = new Array(nodes.length).fill(undefined);

  dist[nodes.indexOf(origin)] = 0;
  const Q = [...nodes];

  while (Q.length > 0) {
    const minDist = Math.min(
      ...dist.filter((_, i) => Q.indexOf(nodes[i]) !== -1)
    );
    const uIndex = nodes.findIndex(
      (n, i) => dist[i] === minDist && Q.indexOf(n) !== -1
    );
    const u = nodes[uIndex];
    const indexQ = Q.findIndex(e => e === u);
    Q.splice(indexQ, 1);

    u.edges.forEach((e: any) => {
      const v = e.arrival;
      const alt = dist[uIndex] + e[weight];
      const vIndex = nodes.findIndex(n => n === v);
      if (alt < dist[vIndex]) {
        dist[vIndex] = alt;
        prev[vIndex] = u;
      }
    });
  }
  return { dist, prev };
}
