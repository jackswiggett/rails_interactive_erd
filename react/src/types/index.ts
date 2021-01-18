/** Information about a database table column */
export type Column = {
  name: string;
  type: string;
  comment?: string;
  hideEdge: boolean;
  associations: string[];
  enumValues?: { [key: string]: string | number };
};

/** Information about a database entity (model) */
export type Entity = {
  name: string;
  friendlyName: string;
  comment?: string;
  columns: Column[];
};

/** Information about the database schema */
export type Schema = {
  entities: Entity[];
  logoImagePath?: string;
};

/** A result from searching entities and columns */
export type Result = {
  /** Entity displayed in the search result */
  entity: Entity;
  /** Column displayed in the search result. If not provided, the result is for an entity only. */
  column?: Column;
  /**
   * The text to display for this result, broken apart such that each entry at an odd index should
   * be bolded, and each entry at an even index should not
   */
  splitText: string[];
  /** The relevancy score for this result; higher is more relevant */
  score: number;
};
