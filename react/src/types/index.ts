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
  title: string;
  entities: Entity[];
};
