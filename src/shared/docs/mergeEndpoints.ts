export function mergeEndpoint(targetObj: Record<string, any>, endpointObj: Record<string, any>) {
  for (const path in endpointObj) {
    if (!targetObj[path]) targetObj[path] = {};
    Object.assign(targetObj[path], endpointObj[path]);
  }
}
