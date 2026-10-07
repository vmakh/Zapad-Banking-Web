const statuses = ["Completed", "Pending", "Scheduled", "Waiting for approval"];

export function activityFilters(params: URLSearchParams, accountIds: string[], categories: string[]) {
  const view = params.get("view") ?? "";
  const spending = view === "spending";
  const requestedStatus = params.get("status") ?? "";
  const requestedAccount = params.get("account") ?? "";
  const requestedCategory = params.get("category") ?? "";
  const status = spending ? "Completed" : statuses.includes(requestedStatus) ? requestedStatus : "";
  const accountId = accountIds.includes(requestedAccount) ? requestedAccount : "";
  const category = spending && categories.includes(requestedCategory) ? requestedCategory : "";
  const invalid = (!!view && !spending)
    || (!!requestedStatus && requestedStatus !== status)
    || requestedAccount !== accountId
    || requestedCategory !== category;
  return { spending, status, accountId, category, invalid };
}
