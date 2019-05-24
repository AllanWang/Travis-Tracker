import StringUnion from "./string-union";

export const TravisPanel = StringUnion('search' , 'main');
export type TravisPanel = typeof TravisPanel.type;
