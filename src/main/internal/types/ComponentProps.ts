import React from 'react';

type ComponentProps<T = any> = { [key: string]: any } & React.ClassAttributes<T>;

export default ComponentProps;