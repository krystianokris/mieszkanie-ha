export interface Room3d {id:string;name:string;image:string;path:string;}
export function room3d(_id: string): Room3d | undefined { return undefined; }
export const EXTRAS: Record<string, {name:string;kicker:string;image:string;path:string}[]> = {};
export function haNavigate(path:string) { history.pushState(null,"",path); window.dispatchEvent(new CustomEvent("location-changed")); }
