import Link from "next/link";
import { formatDate } from "@/lib/format";
import { statusLabel, vehicleLabel } from "@/lib/file-history/labels";
import type { TuningRequestRead } from "@/lib/types/file-history";

type FileHistoryListProps = {
  requests: TuningRequestRead[];
  loadFailed?: boolean;
};

export function FileHistoryList({
  requests,
  loadFailed = false,
}: FileHistoryListProps) {
  return (
    <section className="shop-panel file-history-panel">
      {loadFailed ? (
        <p className="form-banner" role="alert">
          Could not load your file history.
        </p>
      ) : null}

      {!loadFailed && requests.length === 0 ? (
        <p className="muted">No file requests yet.</p>
      ) : null}

      {requests.length > 0 ? (
        <ul className="file-history-list">
          {requests.map((request) => {
            const options = request.tuning_options
              .map((option) => option.name)
              .join(", ");

            return (
              <li key={request.uuid} className="file-history-item">
                <div className="file-history-main">
                  <p className="file-history-name">{vehicleLabel(request)}</p>
                  <p className="file-history-meta muted">
                    <span
                      className={[
                        "file-history-status",
                        `is-${request.status}`,
                      ].join(" ")}
                    >
                      {statusLabel(request.status)}
                    </span>
                    {" · "}
                    {request.file_kind.toUpperCase()} · {request.gearbox} ·{" "}
                    {request.tuning_points_spent} TuningPoints ·{" "}
                    {formatDate(request.created)}
                  </p>
                  {options ? (
                    <p className="file-history-meta muted">Options: {options}</p>
                  ) : null}
                </div>
                <Link
                  href={`/file-history/${request.uuid}`}
                  className="cta cta-secondary file-history-download"
                >
                  View files
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
