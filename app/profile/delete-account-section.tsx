"use client";

import { useActionState, useState } from "react";
import {
  deleteAccountAction,
  type DeleteAccountState,
} from "@/app/actions/profile";
import { clearClientSignedIn } from "@/lib/auth/client-session";

const initialState: DeleteAccountState = { ok: false };

export function DeleteAccountSection() {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [state, formAction, pending] = useActionState(
    deleteAccountAction,
    initialState,
  );

  const canSubmit = confirmText === "DELETE";

  return (
    <section className="profile-danger">
      <h2 className="profile-danger-title">Danger zone</h2>
      <p className="muted profile-danger-lead">
        Permanently delete your account and TuningPoints balance. This cannot
        be undone.
      </p>

      {!open ? (
        <button
          type="button"
          className="btn-danger"
          onClick={() => setOpen(true)}
        >
          Delete account
        </button>
      ) : (
        <form
          action={formAction}
          className="profile-danger-form"
          onSubmit={() => {
            clearClientSignedIn();
          }}
        >
          {state.error ? (
            <p className="form-banner" role="alert">
              {state.error}
            </p>
          ) : null}

          <label className="field" htmlFor="confirm-delete">
            <span className="field-label">
              Type <strong>DELETE</strong> to confirm
            </span>
            <input
              id="confirm-delete"
              name="confirm_delete"
              type="text"
              autoComplete="off"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              placeholder="DELETE"
              disabled={pending}
            />
          </label>

          <div className="profile-danger-actions">
            <button
              type="submit"
              className="btn-danger"
              disabled={pending || !canSubmit}
            >
              {pending ? "Deleting…" : "Permanently delete account"}
            </button>
            <button
              type="button"
              className="cta cta-secondary"
              disabled={pending}
              onClick={() => {
                setOpen(false);
                setConfirmText("");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
