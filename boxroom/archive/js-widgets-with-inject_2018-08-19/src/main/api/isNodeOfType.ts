import React, { ReactType } from 'react';
import isElementOfType from './isElementOfType';

function isNodeOfType(type: ReactType | Iterable<ReactType>): (it: any) => boolean;
function isNodeOfType(type: ReactType | Iterable<ReactType>, it: any): boolean;
function isNodeOfType(type: any, it?: any): ((it: any) => boolean) | boolean {
  let ret: ((it: any) => boolean) | boolean = false;

  if (arguments.length > 1) {
    const types: ReactType[] | null = type !== null && typeof type === 'object'
      && typeof type[Symbol.iterator] === 'function'
      ? (Array.isArray(type) ? type : Array.from(type))
      : null;

    if (it !== null && typeof it === 'object' && typeof it[Symbol.iterator] === 'function') {
      const items = Array.isArray(it) ? it : Array.from(it);

      for (let i = 0; i < items.length; ++i) {
        if (!isNodeOfType(types || type, items[i])) {
          ret = false;
          break;
        } else {
          ret = true;
        }
      }
    } else {
      ret = isElementOfType(type, it); 
    }
  } else {
    ret = it => isNodeOfType(type, it); 
  }

  return ret;
}

export default isNodeOfType;
