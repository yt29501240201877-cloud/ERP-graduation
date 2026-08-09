import { useNotification } from "../../hooks/useNotifications";
import Styles from "./NotificationBell.module.css";

export default function NotificationBell() {
  const token = localStorage.getItem("token");
  const { notifications, unreadCount, markAsRead, deleteNotification, markAllAsRead } =
    useNotification(token);

  return (
    <div className="dropdown">
      <button
        className="btn btn-link text-light position-relative"
        type="button"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-expanded="false"
      >
        <i className="bi bi-bell fs-5"></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 translate-middle badge rounded-pill bg-danger">
            {unreadCount}
          </span>
        )}
      </button>

      <ul
        className={`${Styles.glassCard} dropdown-menu dropdown-menu-end shadow`}
        style={{ width: "400px", maxHeight: "500px", overflowY: "auto" }}
      >
        <li>
          <h6 className="dropdown-header">Notifications</h6>
        </li>

        {notifications.length === 0 ? (
          <li>
            <span className="dropdown-item-text text-center text-muted">
              There is no notifications.
            </span>
          </li>
        ) : (
          notifications.map((n) => (
            <li key={n._id}>
              <div
                className={`dropdown-item-text py-2 d-flex gap-2 justify-content-between align-items-center ${!n.readAt ? "bg-light" : ""}`}
              >
                <div>
                  <strong className="d-block">{n.title}</strong>
                  <p className="mb-1 small text-secondary">{n.message}</p>
                  <small className="text-muted d-block mb-2">
                    {new Date(n.createdAt).toLocaleString()}
                  </small>
                </div>

                <div className="d-flex gap-2">
                  {!n.readAt && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => markAsRead(n._id)}
                    >
                      <i className="bi bi-envelope-open"></i>
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteNotification(n._id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
              <hr className="dropdown-divider" />
            </li>
          ))
        )}
        {notifications.length > 0 && (
          <li>
            <div className="text-center">
              <button
                type="button"
                className="btn btn-sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                <i className="bi bi-check-all me-1"></i> Mark all as read
              </button>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}
