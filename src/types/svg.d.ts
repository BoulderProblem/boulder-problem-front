declare module '*.svg' {
  import * as React from 'react';

  const content: React.FunctionComponent<
    React.SVGProps<SVGElement> & { title?: string }
  >;
  export default content;
}

declare module '*.svg?react' {
  import * as React from 'react';

  const content: React.FunctionComponent<
    React.SVGProps<SVGElement> & { title?: string }
  >;
  export default content;
}
