import React, { ReactType } from 'react';

function isElementOfType(type: ReactType | Iterable<ReactType>): (it: any) => boolean;
function isElementOfType(type: ReactType | Iterable<ReactType>, it: any): boolean;
function isElementOfType(type: any, it?: any): ((it: any) => boolean) | boolean {
  let ret: ((it: any) => boolean) | boolean = false;

  if (arguments.length > 1) {
    const types: ReactType[] | null =
      type !== null
        && typeof type === 'object'
        && typeof type[Symbol.iterator] === 'function'
        ? (Array.isArray(type) ? type : Array.from(type))
        : null; 

    ret = React.isValidElement(it)
      && types === null && it.type === type
        || types !== null && types.indexOf(it.type) >= 0;
  } else {
    ret = (it: any = null) => isElementOfType(type, it);
  }

  return ret;
}

export default isElementOfType;
