# Approvals

Each Brand decides in Wispu whether its agents' changes apply at once or
wait for a person. `list_brands` shows it per Brand (`approvals_enabled`).
Only a person approves or rejects, in Wispu. No tool can do it.

## Requests

- `list_approvals(status, action)` lists the requests this person's agents
  filed: `status` open (waiting, or approved and still running) or decided
  (executed, rejected, expired or failed).
- `get_approval(approval_id)` reads one: what it changes, its state, the
  person's note, and the link to decide it while it is open. In clients with
  screens it shows the approval card. Check at most every 30 seconds, and
  only after the person says they decided.
- A rejected request is final. Do not file it again unless the person asks,
  and read their note first.
- A failed execution may have run in part: read the record again before
  filing a new request.

## Work queue

`list_work_items(kind, include_claimed)` lists open work in the Brand:
Editor pieces with a work order, ideas assigned to the person, and agents'
requests a person rejected in the last week, with their note.

- `claim_work_item(work_item_id, minutes, note)` marks an item as yours so
  others see it is taken. Claim again to renew.
- `release_work_item(work_item_id, outcome, note)` lets it go, with the
  outcome.
