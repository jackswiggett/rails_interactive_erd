/* eslint-disable import/no-unresolved, @typescript-eslint/no-unused-vars */

import { Selection } from 'd3';
import { graphviz } from 'd3-graphviz';

/** Let TypeScript know that d3-graphviz is available on the d3 object */
declare module 'd3' {
  interface Selection {
    graphviz: () => ReturnType<typeof graphviz>;
  }
}

/** Let TypeScript know that d3 is globally available */
declare global {
  const d3;
}
