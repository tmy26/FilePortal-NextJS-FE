import Link from "next/link";
import { formatDate } from "@/lib/format";
import {
  formatTuningPoints,
  statusLabel,
  vehicleHeadline,
} from "@/lib/file-history/labels";
import type { TuningRequestRead } from "@/lib/types/file-history";

type FileHistoryListProps = {
  requests: TuningRequestRead[];
  loadFailed?: boolean;
};

export function FileHistoryList({
  requests,
  loadFailed = false,
}: FileHistoryListProps) {
  if (loadFailed) {
    return (
      <p className="form-banner" role="alert">
        Could not load your file history.
      </p>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="file-history-empty">
        <p className="file-history-empty-title">No requests yet</p>
        <p className="muted">New file requests will show up here with vehicle, status, and files.</p>
      </div>
    );
  }

  return (
    <ul className="file-history-index-list">
      {requests.map((request) => {
        const { typeName, title } = vehicleHeadline(request);
        const optionNames = request.tuning_options.map((option) => option.name);

        return (
          <li key={request.uuid}>
            <Link
              href={`/file-history/${request.uuid}`}
              className="file-history-card"
            >
              <div className="file-history-detail-head">
                <div className="file-history-detail-titles">
                  {typeName ? (
                    <p className="file-history-detail-kicker">{typeName}</p>
                  ) : null}
                  <p className="file-history-card-title">{title}</p>
                </div>
                <span
                  className={[
                    "file-history-status-pill",
                    `is-${request.status}`,
                  ].join(" ")}
                >
                  {statusLabel(request.status)}
                </span>
              </div>

              <ul className="file-history-chips">
                <li>{request.file_kind.toUpperCase()}</li>
                <li className="file-history-chip-caps">{request.gearbox}</li>
                <li>{formatTuningPoints(request.tuning_points_spent)}</li>
                {request.ecu?.name ? <li>{request.ecu.name}</li> : null}
                <li>{formatDate(request.created)}</li>
              </ul>

              {optionNames.length > 0 ? (
                <ul className="file-history-options">
                  {optionNames.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              ) : null}

              <span className="file-history-card-cta">View files</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
