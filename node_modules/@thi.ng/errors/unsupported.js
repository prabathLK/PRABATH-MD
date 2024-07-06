import { defError } from "./deferror.js";
const UnsupportedOperationError = defError(
  () => "unsupported operation"
);
const unsupported = (msg) => {
  throw new UnsupportedOperationError(msg);
};
export {
  UnsupportedOperationError,
  unsupported
};
