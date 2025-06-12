import { v4 as uuidv4 } from "uuid";

export function UUID() {
  const uuid = uuidv4();
  return uuid;
}
